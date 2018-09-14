#!/bin/sh
echo "INSTALL NODEFONY TRAVIS ENVIRONEMENT $DB ACTIVE ";

if [ "$DB" = "mysql" ]
then
	echo "NODEFONY TRAVIS ENVIRONEMENT MYSQL ACTIVE " ;
	cp .travis/config/config.yml app/config/config.yml ;
else
	echo "NODEFONY TRAVIS ENVIRONEMENT SQLITE ACTIVE " ;
fi

cat /etc/hosts

#configuring the system
npm -g install nodefony

nodefony build

if [ "$DB" = "mysql" ]
then
  nodefony generate:bundle generated
  nodefony pm2 &
  sleep 60;
  nodefony status &
else
  nodefony generate:bundle generated
  nodefony dev &
fi
