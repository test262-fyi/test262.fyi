#!/bin/sh

export JS_EXPERIMENTAL=1

./scripts/install/jsvu.sh v8
./scripts/test262.sh d8 "${HOME}/.jsvu/bin/v8" 24