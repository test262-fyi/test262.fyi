#!/bin/sh

# install rust
curl https://sh.rustup.rs -sSf | sh

# clone repo and build (no CI builds)
git clone https://github.com/boa-dev/boa.git --depth 1

cd boa
git rev-parse HEAD > ../version.txt

cargo build --release

cp target/release/boa ../boa

./scripts/test262.sh boa "$(pwd)/boa" 24