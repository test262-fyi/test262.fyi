#!/bin/sh

# install jsvu as main installer (https://github.com/GoogleChromeLabs/jsvu)
npm install -g jsvu

# add install dir to PATH
export PATH="${HOME}/.jsvu/bin:${PATH}"

# install given engine
jsvu --os=linux64 --engines=$1