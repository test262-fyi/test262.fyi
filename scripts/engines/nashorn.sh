#!/bin/sh

# install java 13
sudo apt install openjdk-13-jre-headless

echo "print('test')" > test.js
jjs test.js

# ./scripts/test262.sh nashorn "$(which jjs)" 24