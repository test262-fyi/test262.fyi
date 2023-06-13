#!/bin/sh

export JS_EXPERIMENTAL=1

./scripts/install/jsvu.sh spidermonkey
./scripts/test262.sh jsshell "${HOME}/.jsvu/bin/sm" 32