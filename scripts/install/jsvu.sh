#!/bin/sh

# install jsvu as main installer (https://github.com/GoogleChromeLabs/jsvu)
npm install -g jsvu

# install given engine
jsvu --os=linux64 --engines=$1