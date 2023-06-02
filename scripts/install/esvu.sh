#!/bin/sh

# install esvu as extra/missing installer (https://github.com/devsnek/esvu)
npm install -g esvu

# add install dir to PATH
export PATH="${HOME}/.esvu/bin:${PATH}"

# install given engine
esvu --os=linux64 --engines=$1