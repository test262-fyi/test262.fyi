#!/bin/sh

# download node v0.10.x
curl -L -o node.tar.gz "https://nodejs.org/dist/latest-v0.10.x/node-v0.10.48-linux-x64.tar.gz"
tar -zxf node.tar.gz

# install swc deps
cd helpers/sucrase
npm install
cd ../..

node helpers/sucrase/version.js > version.txt

./scripts/test262.sh node "$(pwd)/node-v0.10.48-linux-x64/bin/node" 4 "$(pwd)/helpers/sucrase/preprocessor.js" "$(pwd)/helpers/sucrase/transformer.js"