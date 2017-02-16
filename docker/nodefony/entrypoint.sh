#!/usr/bin/env bash


cp /docker/config/config.yml /nodefony/config/config.yml
cp /docker/config/pm2.json /nodefony/config/pm2.json
cp /docker/app/config/config.yml /nodefony/app/config/config.yml

cd /nodefony

make sequelize
make asset


# DEVEOLPPEMENT
./nodefony_dev

# PRODUCTION 
#./node_modules/pm2/bin/pm2 update
#./nodefony_pm2 

