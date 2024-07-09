#!/bin/sh

./scripts/install/jsvu.sh v8
./scripts/test262.sh d8 "${HOME}/.jsvu/bin/v8" 16
