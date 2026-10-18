#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$root/.build/themes"
ln -sfn "$root" "$root/.build/themes/zzo"
hugo --source "$root/exampleSite" --themesDir "$root/.build/themes" --destination "$root/.build/example" --baseURL http://127.0.0.1:4173/ --gc --minify --panicOnWarning
python3 "$root/scripts/verify-output.py" "$root/.build/example"
