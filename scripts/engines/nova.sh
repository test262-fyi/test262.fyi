#!/bin/sh

# clone repo and build (no CI builds)
git clone https://github.com/trynova/nova.git --depth 1

cd nova
git rev-parse HEAD > ../version.txt

cargo build --release --jobs 1 --bin nova_cli

cp target/release/nova_cli ../nova_bin
cd ..
rm -rf nova
mv nova_bin nova

./scripts/test262.sh nova "$(pwd)/nova" 24
