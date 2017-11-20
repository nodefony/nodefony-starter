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
make build

if [ "$DB" = "mysql" ]
then
	./nodefony generate:bundle:angular generatedBundle ./src/bundles
	make deploy &
	sleep 60;
	make status &
else
	./nodefony generate:bundle generatedBundle ./src/bundles
	./nodefony dev &
fi
