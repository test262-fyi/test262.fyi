#!/bin/sh

# install java 13
# sudo apt install openjdk-13-jre-headless

java -version

./scripts/test262.sh nashorn "$(which jjs)" 4