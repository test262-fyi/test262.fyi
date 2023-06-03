#!/bin/sh

./scripts/install/jsvu.sh graaljs
./scripts/test262.sh graaljs "${HOME}/.jsvu/bin/graaljs"