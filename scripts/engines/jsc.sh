#!/bin/sh

./scripts/install/jsvu.sh javascriptcore
./scripts/test262.sh jsc "${HOME}/.jsvu/bin/jsc" 24