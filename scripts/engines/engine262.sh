#!/bin/sh

./scripts/install/esvu.sh engine262
"${HOME}/.esvu/bin/engine262" --version

./scripts/test262.sh engine262 "${HOME}/.esvu/bin/engine262"