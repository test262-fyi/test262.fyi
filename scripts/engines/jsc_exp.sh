#!/bin/sh

export JS_EXPERIMENTAL=1

./scripts/install/jsvu.sh javascriptcore
./scripts/test262.sh jsc "${HOME}/.jsvu/bin/jsc" 32