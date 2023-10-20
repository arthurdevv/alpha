#!/usr/bin/env bash

NAME="Alpha"
ALPHA_PATH="$(dirname "$(dirname "$(dirname "$(realpath "$0")")")")"
CLI="$ALPHA_PATH/resources/bin/cli.js"
ELECTRON="$ALPHA_PATH/$NAME.exe"
ELECTRON_RUN_AS_NODE=1 "$ELECTRON" "$CLI" "$@"
exit $?