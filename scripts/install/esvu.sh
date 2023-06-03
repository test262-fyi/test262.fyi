#!/bin/sh

# install esvu as extra/missing installer (our fork - https://github.com/CanadaHonk/esvu)
npm install -g github:CanadaHonk/esvu

# install given engine
esvu --engines=$1

cp "$HOME/.esvu/status.json" "esvu.json"