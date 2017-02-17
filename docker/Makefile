DISTRIB := $(shell uname)
VERBOSE = 0 
NODE_VERSION := $(shell node -v)

VERSION := $(subst v,,$(subst .,,$(NODE_VERSION)))
#$(error $(VERSION))  
VERSION := $(shell expr $(VERSION) )

all:  compose-up 


image:
	@echo "";
	@echo "#########################################" ;
	@echo "#         IMAGE DOCKER NODEFONY         #" ;
	@echo "#########################################" ;
	@echo "";
	docker build  -t nodefony ./2.0.3/

run:
	docker run -it -p 127.0.0.1:5151:5151 --name=nodefony nodefony

stop:
	docker stop nodefony 

rm: 
	docker rm -f nodefony 

port:
	docker port nodefony 

compose-up:
	@echo "";
	@echo "#########################################" ;
	@echo "#           DOCKER NODEFONY             #" ;
	@echo "#########################################" ;
	@echo "";
	@docker-compose up;

compose-build:
	@echo "";
	@echo "#########################################" ;
	@echo "#         DOCKER NODEFONY BUILD         #" ;
	@echo "#########################################" ;
	@echo "";
	docker-compose build ;

compose-start:
	docker-compose up;

compose-stop:
	docker-compose -f stop ;

ps:
	docker ps -a;

network:
	docker  network ls ;

network-clean:
	docker  network prune ;

volume:
	docker  volume ls ;

volume-clean:
	docker  volume prune ;

get-ip:
	@echo "";
	@echo "#########################################" ;
	@echo "#         DOCKER CONTAINR NODEFONY      #" ;
	@echo "#########################################" ;
	@echo "";
	@docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' nodefony
	@echo "";

	@echo "";
	@echo "#########################################" ;
	@echo "#         DOCKER CONTAINR NGINX         #" ;
	@echo "#########################################" ;
	@echo "";
	@docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' nginx
	@echo "";

inspect:
	@docker inspect nodefony

clean:
	make network-clean ;
	make volume-clean ;


.EXPORT_ALL_VARIABLES:
.PHONY: vendors doc
