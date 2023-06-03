#!/bin/sh

./scripts/install/jsvu.sh quickjs
"${HOME}/.jsvu/bin/quickjs" --version

./scripts/test262.sh qjs "${HOME}/.jsvu/bin/quickjs"