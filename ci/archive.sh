#!/bin/bash -ex

pushd `dirname $0`/.. > /dev/null
root=$(pwd -P)
popd > /dev/null

source $root/ci/vars.sh

#
# Build
#

## FIXME
export FIREFOX_BIN=$(which firefox)
echo "Firefox path: ${FIREFOX_BIN}"

npm install
npm run test:ci
FIREFOX_BIN=$(which firefox) NODE_ENV=production GATEWAY="https://pz-gateway.${PCF_DOMAIN}" npm run build
echo "pushstate: enabled" > dist/Staticfile

#
# Package artifacts
#

zip -jr ${APP}.${EXT} dist
