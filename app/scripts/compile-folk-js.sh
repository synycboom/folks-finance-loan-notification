#!/bin/sh

set -e

if [ -d node_modules/folks-finance-js-sdk/dist/v1 ]; then
  exit 0
fi

sed -i 's/src\/index\.ts/src\/\*\*\/\*\.ts/' node_modules/folks-finance-js-sdk/tsconfig.json

cd node_modules/folks-finance-js-sdk && npm run build
