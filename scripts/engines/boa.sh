#!/bin/sh

URL=https://github.com/boa-dev/boa
git ls-remote ${URL}.git HEAD | cut -f1 > version.txt

# download release
curl -L -o boa ${URL}/releases/download/nightly/boa-x86_64-unknown-linux-gnu
chmod +x boa

./scripts/test262.sh boa "$(pwd)/boa" 24
