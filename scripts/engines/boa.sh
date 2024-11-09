#!/bin/sh

# clone repo to get the git hash
git clone https://github.com/boa-dev/boa.git --depth 1

cd boa
git rev-parse HEAD > ../version.txt
cd ..
rm -rf boa

# download release
curl -L -o boa https://github.com/boa-dev/boa/releases/download/nightly/boa-linux-amd64
chmod +x boa

./scripts/test262.sh boa "$(pwd)/boa" 24
