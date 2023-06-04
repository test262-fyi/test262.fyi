#!/bin/sh

engines=( v8 sm jsc chakra graaljs hermes libjs engine262 qjs xs )

for x in "${engines[@]}"
do
  echo "$x"

  curl -L -o "results/$x.zip" "https://nightly.link/CanadaHonk/test262.fyi/workflows/run/main/$x.zip"

  mkdir "results/$x"
  unzip -o -d "results/$x" "results/$x.zip"

  rm "results/$x.zip"
done