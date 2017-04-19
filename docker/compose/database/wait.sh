#!/usr/bin/env bash


exit 0 ;


echo "Waiting for mysql"

sleep 15

echo -e "\nmysql ready"


#until mysql -h"$MYSQL_PORT_3306_TCP_ADDR" -P3306 -uroot -pnodefony &> /dev/null
#do
#  printf "."
#  sleep 1
#done
#
#echo -e "\nmysql ready"
