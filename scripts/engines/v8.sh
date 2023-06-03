#!/bin/sh

./scripts/install/jsvu.sh v8
"${HOME}/.jsvu/bin/v8" --version

./scripts/test262.sh d8 "${HOME}/.jsvu/bin/v8"