#!/bin/sh

./scripts/install/jsvu.sh xs
"${HOME}/.jsvu/bin/xs" --version

./scripts/test262.sh xs "${HOME}/.jsvu/bin/xs"