#!/bin/sh

# clone test262
git clone https://github.com/tc39/test262.git --depth 1
cd test262

# install test262 harness (https://github.com/bterlson/test262-harness)
npm install -g test262-harness

test262-harness --reporter=json --threads=4 --host-type=$1 --host-path=`which $2` test/**/*.js