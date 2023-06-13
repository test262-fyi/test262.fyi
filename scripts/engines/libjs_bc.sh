#!/bin/sh

export JS_EXPERIMENTAL=1

./scripts/install/esvu.sh libjs
./scripts/test262.sh serenity-js "${HOME}/.esvu/bin/serenity-js" 16