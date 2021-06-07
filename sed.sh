#! /bin/bash

SED=gsed

if ! command -v gsed &> /dev/null
then
    SED=sed
fi

$SED "$@"