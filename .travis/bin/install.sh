#!/bin/sh

echo "INSTALL NODEFONY TRAVIS ENVIRONEMENT $DB ACTIVE ";

if [ "$DB" = "mysql" ]
then
	echo "NODEFONY TRAVIS ENVIRONEMENT MYSQL ACTIVE " ;
	cp .travis/config/config.yml app/config/config.yml ;
else
	echo "NODEFONY TRAVIS ENVIRONEMENT SQLITE ACTIVE " ;
fi

#configuring the system
make build

#configuring the system
ln -s /usr/bin/nodejs /usr/bin/node

if [ "$DB" = "mysql" ]
then
	make deploy & 
	sleep 15;
	make status &
else
	./nodefony_dev &
fi

