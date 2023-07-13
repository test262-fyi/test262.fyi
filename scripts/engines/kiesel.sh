#!/bin/sh

curl -L -o version.txt https://files.kiesel.dev/version.txt
./scripts/install/esvu.sh kiesel
./scripts/test262.sh kiesel "${HOME}/.esvu/bin/kiesel" 32