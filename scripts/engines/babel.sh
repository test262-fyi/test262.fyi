#!/bin/sh

# download node v0.10.x
curl -L -o node.tar.gz "https://nodejs.org/dist/latest-v0.10.x/node-v0.10.48-linux-x64.tar.gz"

mkdir node
tar -zxf node.tar.gz -C "node"
rm node.tar.gz

# download babel/babel-test262-runner as a base (but use our harness instead)
git clone https://github.com/babel/babel-test262-runner.git --depth 1

cd babel-test262-runner
npm install
cd ..

node helpers/babel/version.js > version.txt

./scripts/test262.sh node "$(pwd)/node/bin/node" 12 --preprocessor="$(pwd)/helpers/babel/preprocessor.js"