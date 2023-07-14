#!/bin/sh

# clone repo and build (no CI builds)
# git clone https://github.com/boa-dev/boa.git --depth 1

# cd boa
# git rev-parse HEAD > ../version.txt

# cargo build --release

# cp target/release/boa ../boa_bin
# cd ..
# rm -rf boa
# mv boa_bin boa

# download release
echo "0.17" > version.txt

curl -L -o boa https://github.com/boa-dev/boa/releases/download/v0.17/boa-linux-amd64
chmod +x boa

./scripts/test262.sh boa "$(pwd)/boa" 24