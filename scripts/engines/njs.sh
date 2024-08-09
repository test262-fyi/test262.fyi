#!/bin/sh

# clone repo and build (no CI builds)
git clone https://github.com/nginx/njs.git --depth 1

cd njs
git rev-parse HEAD > ../version.txt

./configure
make

cp build/njs ../njs_bin
cd ..
rm -rf njs
mv njs_bin njs

./scripts/test262.sh njs "$(pwd)/njs" 16
