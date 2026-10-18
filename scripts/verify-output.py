#!/usr/bin/env python3
"""Validate generated artifacts; optionally compare routes/feed/search with a baseline."""
import argparse
import json
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser()
parser.add_argument('output', type=Path)
parser.add_argument('--baseline', type=Path)
args = parser.parse_args()
root = args.output
assert root.is_dir(), root
files = {p.relative_to(root) for p in root.rglob('*') if p.is_file()}
assert any(p.name == 'index.html' for p in files), 'No HTML pages'
assert any(p.name == 'index.json' for p in files), 'No search indexes'
for path in sorted(files):
    if path.suffix == '.json':
        value = json.loads((root / path).read_text())
        if path.name == 'index.json':
            assert isinstance(value, list), f'Invalid search index: {path}'
            uris = [row['uri'] for row in value]
            assert len(uris) == len(set(uris)), f'Duplicate search results: {path}'
    elif path.suffix == '.xml':
        ET.parse(root / path)

if args.baseline:
    old = args.baseline
    routes = {p.relative_to(old) for p in old.rglob('*') if p.is_file() and p.suffix in {'.html', '.json', '.xml'}}
    assert not routes - files, f'Missing routes: {sorted(routes - files)}'
    for path in sorted(routes):
        if path.name == 'index.json':
            before = {urlparse(row['uri']).path: row for row in json.loads((old / path).read_text())}
            after = {urlparse(row['uri']).path: row for row in json.loads((root / path).read_text())}
            assert before.keys() == after.keys(), f'Changed search URLs: {path}'
            for uri, row in before.items():
                assert row['title'] == after[uri]['title'], f'Changed title: {uri}'
                # Empty YAML entries normalize from [null] to [].
                assert [tag for tag in row.get('tags') or [] if tag] == [tag for tag in after[uri].get('tags') or [] if tag], f'Changed tags: {uri}'
        elif path.name == 'index.xml':
            before = [item.findtext('link') for item in ET.parse(old / path).findall('./channel/item')]
            after = [item.findtext('link') for item in ET.parse(root / path).findall('./channel/item')]
            assert before == after, f'Changed RSS items: {path}'
print(f'Validated {len(files)} artifacts' + (' and baseline route/search/RSS parity' if args.baseline else ''))
