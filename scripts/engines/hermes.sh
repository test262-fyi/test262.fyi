#!/bin/sh

./scripts/install/jsvu.sh hermes
"${HOME}/.jsvu/bin/hermes" --version

./scripts/test262.sh hermes "${HOME}/.jsvu/bin/hermes"