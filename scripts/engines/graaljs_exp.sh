#!/bin/sh

export JS_EXPERIMENTAL=1

./scripts/install/jsvu.sh graaljs
./scripts/test262.sh graaljs "${HOME}/.jsvu/bin/graaljs" 32
