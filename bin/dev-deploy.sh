#!/usr/bin/env bash

npx nodefony sequelize:revert
rm -rf ./app/Resources/databases/nodefony.db
npx nodefony build
