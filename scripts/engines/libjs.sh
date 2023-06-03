#!/bin/sh

./scripts/install/esvu.sh libjs
"${HOME}/.esvu/bin/serenity-js" --version

./scripts/test262.sh serenity-js "${HOME}/.esvu/bin/serenity-js"