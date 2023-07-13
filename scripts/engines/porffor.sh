#!/bin/sh

# clone repo and use node
git clone https://github.com/CanadaHonk/porffor.git --depth 1

cd porffor
git rev-parse HEAD > ../version.txt
cd ..

./scripts/test262.sh porffor "$(pwd)/helpers/porffor.sh" 8