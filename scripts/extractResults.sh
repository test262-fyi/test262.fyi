#!/usr/bin/env bash

for file in results/*.zip; do
  x="$(basename $file .zip)"
  echo "$x"

  mkdir -p "results/$x"
  unzip -o -d "results/$x" "results/$x.zip"

  rm "results/$x.zip"
done
