#!/bin/sh

./scripts/install/jsvu.sh quickjs
./scripts/test262.sh qjs "${HOME}/.jsvu/bin/quickjs"