#!/bin/sh

./scripts/install/esvu.sh libjs
./scripts/test262.sh libjs "${HOME}/.esvu/bin/ladybird-js" 16
