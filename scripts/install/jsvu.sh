#!/bin/sh

# install jsvu as main installer (our fork - https://github.com/CanadaHonk/jsvu)
npm install -g github:CanadaHonk/jsvu

# install given engine
jsvu --os=linux64 --engines=$1

cp "$HOME/.jsvu/status.json" "jsvu.json"