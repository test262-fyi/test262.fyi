#!/bin/sh

# clone repo to get the git hash
git clone https://github.com/ferus-web/bali.git --depth 1

cd bali
git rev-parse HEAD > ../version.txt
cd ..
rm -rf bali

./scripts/install/esvu.sh bali
./scripts/test262.sh bali "${HOME}/.esvu/bin/bali" 16
