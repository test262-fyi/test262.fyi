#!/bin/sh

./scripts/install/jsvu.sh graaljs
"${HOME}/.jsvu/bin/graaljs" --version

./scripts/test262.sh graaljs "${HOME}/.jsvu/bin/graaljs"