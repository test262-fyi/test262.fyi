#!/bin/sh

./scripts/install/jsvu.sh hermes
./scripts/test262.sh hermes "${HOME}/.jsvu/bin/hermes" 64