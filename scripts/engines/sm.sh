#!/bin/sh

./scripts/install/jsvu.sh spidermonkey
./scripts/test262.sh jsshell "${HOME}/.jsvu/bin/sm" 24