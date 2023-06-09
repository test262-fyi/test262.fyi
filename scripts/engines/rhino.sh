#!/bin/sh

# download rhino (hardcoded link)
curl -L -o rhino.jar https://github.com/mozilla/rhino/releases/download/Rhino1_7_14_Release/rhino-1.7.14.jar

./scripts/test262.sh rhino "$(pwd)/helpers/rhino.sh" 24