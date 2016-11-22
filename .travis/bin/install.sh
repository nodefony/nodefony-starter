#!/bin/sh

make clean ;

if [ "$DB" = "mysql" ]
	echo "NODEFONY TRAVIS ENVIRONEMENT MYSQL ACTIVE " ;
	cp .travis/config/config.yml app/config/config.yml ;
then
	echo "NODEFONY TRAVIS ENVIRONEMENT SQLITE ACTIVE " ;
fi

#configuring the system
make

./nodefony_dev &

