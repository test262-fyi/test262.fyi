#!/bin/sh

./scripts/install/jsvu.sh chakra
"${HOME}/.jsvu/bin/ch" --version

./scripts/test262.sh ch "${HOME}/.jsvu/bin/ch"