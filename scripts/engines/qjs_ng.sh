#!/bin/sh

# use upstream jsvu for quickjs-ng
npm install -g jsvu@latest
jsvu --os=linux64 --engines=quickjs

cp "$HOME/.jsvu/status.json" "jsvu.json"

./scripts/test262.sh qjs "${HOME}/.jsvu/bin/quickjs" 32