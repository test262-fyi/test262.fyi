#!/bin/sh

./scripts/install/jsvu.sh javascriptcore
"${HOME}/.jsvu/bin/jsc" --version

./scripts/test262.sh jsc "${HOME}/.jsvu/bin/jsc"