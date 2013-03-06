#!/bin/sh
if [ "x$TITANIUM_CLI_XCODEBUILD" == "x" ]; then NO_COLORS="--no-colors"; else NO_COLORS=""; fi
/usr/local/bin/node "/usr/local/bin/titanium" build --platform iphone --sdk 3.0.2.GA --no-prompt --no-banner $NO_COLORS --xcode
exit $?
