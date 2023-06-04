#!/bin/sh

node scripts/install/circle.js facebook/hermes main build linux "output/hermes-cli-linux.tar.gz" hermes.tar.gz
tar -zxf hermes.tar.gz --directory "hermes"

./scripts/test262.sh hermes "$PWD/hermes/hermes" 24