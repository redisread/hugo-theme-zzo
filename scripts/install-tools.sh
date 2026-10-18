#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/toolchain.env"
destination="${1:-$PWD/.build/toolchain}"
mkdir -p "$destination"
destination="$(cd "$destination" && pwd)"
staging="$(mktemp -d)"
trap 'rm -rf "$staging"' EXIT
case "$(uname -s)/$(uname -m)" in
  Linux/x86_64) hugo_asset="hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"; sass_platform=linux-x64 ;;
  Darwin/arm64) hugo_asset="hugo_extended_${HUGO_VERSION}_darwin-universal.pkg"; sass_platform=macos-arm64 ;;
  *) echo 'Supported installers: Linux x86_64 and macOS arm64. See migration guide for manual installation.' >&2; exit 1 ;;
esac
curl -fsSL --retry 3 "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${hugo_asset}" -o "$staging/$hugo_asset"
curl -fsSL --retry 3 "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_checksums.txt" -o "$staging/checksums.txt"
(cd "$staging"; awk -v file="$hugo_asset" '$2 == file' checksums.txt > selected.sha256; test -s selected.sha256; shasum -a 256 -c selected.sha256)
if [[ "$hugo_asset" == *.pkg ]]; then
  pkgutil --expand-full "$staging/$hugo_asset" "$staging/package"
  cp "$staging/package/Payload/hugo" "$destination/hugo"
else
  tar -xzf "$staging/$hugo_asset" -C "$staging" hugo
  cp "$staging/hugo" "$destination/hugo"
fi
curl -fsSL --retry 3 "https://github.com/sass/dart-sass/releases/download/${DART_SASS_VERSION}/dart-sass-${DART_SASS_VERSION}-${sass_platform}.tar.gz" -o "$staging/sass.tar.gz"
tar -xzf "$staging/sass.tar.gz" -C "$destination"
"$destination/hugo" version
"$destination/dart-sass/sass" --version
printf 'Add to PATH: %s:%s/dart-sass\n' "$destination" "$destination"
