DISTRIB := $(shell uname)
VERBOSE = 0 
NODE_VERSION := $(shell node -v)

VERSION := $(subst v,,$(subst .,,$(NODE_VERSION)))
#$(error $(VERSION))  
VERSION := $(shell expr $(VERSION) )

NODEFONY_VERSION = 2.0.3

all:  compose 

install:
	docker pull nodefony/docker-nodefony

image:
	@echo "";
	@echo "#########################################" ;
	@echo "#         IMAGE DOCKER NODEFONY         #" ;
	@echo "#########################################" ;
	@echo "";
	docker build  -t nodefony/docker-nodefony ./$(NODEFONY_VERSION)/

run:
	## WARNING ON MACOS docker host is actually on a VM  for binding  you could use virtualbox's port forwarding feature
	docker run  --rm -it --publish 127.0.0.1:5151:5151  --publish 127.0.0.1:5152:5152  -p 1318:1318 -p 1315:1315 -p 1316:1316 --name=nodefony nodefony/docker-nodefony

stop:
	-@docker stop nodefony 

rm: 
	-@docker rm -f nodefony 

port:
	docker port nodefony 

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

inspect:
	@docker inspect nodefony

clean-all:	clean-container clean  clean-images

clean:		rm network-clean volume-clean

clean-container:
	-@$(shell docker rm $(shell docker ps -a -q) )

clean-images:
	-@$(shell docker rmi $(shell docker images -q) )


# COMPOSER 

compose:
	@echo "";
	@echo "#########################################" ;
	@echo "#       DOCKER COMPOSER NODEFONY        #" ;
	@echo "#########################################" ;
	@echo "";
	docker-compose up;

compose-build:
	@echo "";
	@echo "#########################################" ;
	@echo "#         DOCKER COMPOSER BUILD         #" ;
	@echo "#########################################" ;
	@echo "";
	docker-compose build ;

compose-start:
	docker-compose up;

compose-stop:
	docker-compose -f stop ;

compose-ip:
	@echo "";
	@echo "#########################################" ;
	@echo "#         DOCKER CONTAINER NODEFONY     #" ;
	@echo "#########################################" ;
	@echo "";
	@docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' nodefony
	@echo "";

	@echo "";
	@echo "#########################################" ;
	@echo "#         DOCKER CONTAINER NGINX        #" ;
	@echo "#########################################" ;
	@echo "";
	@docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' nginx
	@echo "";

.EXPORT_ALL_VARIABLES:
.PHONY: compose
