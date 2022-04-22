#!/bin/sh

set -e

if [ -d node_modules/folks-finance-js-sdk/dist/v1 ]; then
  exit 0
fi

if [ "$1" == "alpine" ]; then
  sed -i 's/src\/index\.ts/src\/\*\*\/\*\.ts/' node_modules/folks-finance-js-sdk/tsconfig.json
else
  sed -i '' 's/src\/index\.ts/src\/\*\*\/\*\.ts/' node_modules/folks-finance-js-sdk/tsconfig.json
fi

cd node_modules/folks-finance-js-sdk && npm run build
