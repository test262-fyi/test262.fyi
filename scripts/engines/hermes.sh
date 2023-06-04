#!/bin/sh

node scripts/install/circle.js facebook/hermes main build linux "output/hermes-cli-linux.tar.gz" hermes.tar.gz

./scripts/test262.sh hermes "${HOME}/.jsvu/bin/hermes" 64