#!/bin/sh

./scripts/install/jsvu.sh spidermonkey
"${HOME}/.jsvu/bin/sm" --version

./scripts/test262.sh jsshell "${HOME}/.jsvu/bin/sm"