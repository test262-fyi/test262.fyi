#!/bin/sh

# download node v0.10.x
curl -L -o node.tar.gz "https://nodejs.org/dist/latest-v0.10.x/node-v0.10.48-linux-x64.tar.gz"
tar -zxf node.tar.gz

# install swc deps
cd helpers/swc
npm install
cd ../..

node helpers/swc/version.js > version.txt

./scripts/test262.sh node "$(pwd)/node-v0.10.48-linux-x64/bin/node" 8 "$(pwd)/helpers/swc/preprocessor.js" "$(pwd)/helpers/swc/transformer.js"