#!/bin/sh

git clone https://github.com/drogus/jawsm.git --depth 1

cd jawsm
git rev-parse HEAD >../version.txt

cargo build --release --jobs 4

cd ..

./scripts/test262.sh jawsm "$(pwd)/helpers/jawsm.sh" 8
