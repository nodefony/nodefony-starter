#!/usr/bin/env bash

cd /nodefony

make sequelize

if [ "${NODEFONY_ENVIRONMENT}" == "dev" ]
then
	# DEVEOLPPEMENT
	echo "RUN NODEFONY CONTAINER MODE :${NODEFONY_ENVIRONMENT}"
	./nodefony_dev
else
	# PRODUCTION 
	echo "RUN NODEFONY CONTAINER MODE :${NODEFONY_ENVIRONMENT}"
	make asset
	./node_modules/pm2/bin/pm2 update
	./nodefony_pm2 
fi
