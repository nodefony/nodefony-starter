DISTRIB := $(shell uname)
VERBOSE = 0 
NODE_VERSION := $(shell node -v)

VERSION := $(subst v,,$(subst .,,$(NODE_VERSION)))
#$(error $(VERSION))  
VERSION := $(shell expr $(VERSION) )

all:  install 

install:

	make npm ;

	@echo "";
	@echo "#########################################" ;
	@echo "#      NODEFONY INSTALL BUNDLES         #" ;
	@echo "#########################################" ;
	@echo "";

	@if [ $(VERBOSE) = 0 ] ; then \
		echo "./console npm:install";\
		./console npm:install ;\
	else \
		echo "./.console_dev npm:install";\
		./.console_dev npm:install ;\
	fi \

	@echo "";
	@echo "#########################################" ;
	@echo "#        NODEFONY ASSETS INSTALL        #" ;
	@echo "#########################################" ;
	@echo "";
	@if [ $(VERBOSE) = 0 ] ; then \
		echo "./console assets:install" ;\
		./console assets:install ;\
	else \
		echo "./.console_dev assets:install" ;\
		./.console_dev assets:install ;\
	fi \

build:
	@echo "";
	@echo "#########################################" ;
	@echo "#            NODEFONY BUILD             #" ;
	@echo "#########################################" ;
	@echo "";

	make clean ;

	make npm ;
	
	make install ;

	make sequelize

	@if [ $(VERBOSE) = 0 ] ; then \
		echo "./console router:generate:routes";\
		./console router:generate:routes ;\
		echo "./console router:match:url /";\
		./console router:match:url /\
		echo "./console npm:list";\
		./console npm:list ;\
	else \
		echo "./.console_dev router:generate:routes";\
		./.console_dev router:generate:routes ;\
		echo "./console router:match:url /";\
		./console router:match:url /\
		echo "./.console_dev npm:list";\
		./.console_dev npm:list ;\
	fi \

	make certificates ;

#
# PM2 MANAGEMENT PRODUCTION 
#
startup:
	./node_modules/pm2/bin/pm2 startup

start:
	./node_modules/pm2/bin/pm2 update
	./nodefony_pm2 &

stop:
	./node_modules/pm2/bin/pm2 stop nodefony

kill:
	./node_modules/pm2/bin/pm2 kill

show:
	./node_modules/pm2/bin/pm2 show nodefony

monitor:
	./node_modules/pm2/bin/pm2 monit nodefony

status:
	./node_modules/pm2/bin/pm2 status

reload:
	./node_modules/pm2/bin/pm2 reload nodefony

restart:
	./node_modules/pm2/bin/pm2 restart nodefony

logs:
	./node_modules/pm2/bin/pm2 --lines 1000 logs nodefony

# NODEFONY BUILD FRAMEWORK 
npm:
	@echo "" ;
	@echo "#######################################################" ;
	@echo "#                node.js  INSTALLATION                #" ;
	@echo "#######################################################" ;
	@echo "" ;

	@[ $(VERSION) -ge 600 ]  || echo '$(NODE_VERSION) NODEFONY ERROR NODE VERSION must have version >= v6.0.0  See https://nodejs.org/en/download/package-manager for upgrade version ';  
	
	@if [  -f package.json  ] ; then \
		if [ $(VERBOSE) = 0 ] ; then \
			echo "npm -s install" ;\
			npm -s install  ;\
		else \
			echo "npm -ddd install" ;\
			npm -ddd install  ;\
		fi \
	fi

deploy:
	make asset ;
	make start &

asset:
	@echo "";
	@echo "#########################################" ;
	@echo "#            NODEFONY ASSETS            #" ;
	@echo "#########################################" ;
	@echo "";

	@if [ $(VERBOSE) = 0 ] ; then \
		echo "./console assets:install" ;\
		./console assets:install ;\
		echo "./console assets:dump" ;\
		./console assets:dump ;\
	else \
		echo "./.console_dev assets:install" ;\
		./.console_dev assets:install ;\
		echo "./.console_dev assets:dump" ;\
		./.console_dev assets:dump ;\
	fi \
	 
	

framework:
	@echo "";
	@echo "#######################################" ;
	@echo "#            GIT SUBMODULES           #" ;
	@echo "#######################################" ;
	@echo "";

	git submodule sync;
	git submodule update --init --recursive

	@echo "";
	@echo "####################################################" ;
	@echo "#            CREATE FRAMEWORK REPOSITORY           #" ;
	@echo "####################################################" ;
	@echo "";

	@if [ ! -d tmp ] ; then  \
		mkdir tmp ;\
	fi
	@if [ ! -d tmp/upload ] ; then  \
		mkdir tmp/upload ;\
	fi
	@if [ ! -d bin ] ; then  \
		mkdir bin ;\
	fi
	@if [ ! -d web ] ; then  \
		mkdir web ;\
	fi
	@if [ ! -d web/js ] ; then  \
		mkdir web/js ;\
	fi
	@if [ ! -d web/css ] ; then  \
		mkdir web/css ;\
	fi
	@if [ ! -d web/images ] ; then  \
		mkdir web/images ;\
	fi
	@if [ ! -d web/assets ] ; then  \
		mkdir  web/assets ;\
	fi
	@if [ ! -d web/assets/js ] ; then  \
		mkdir web/assets/js ;\
	fi
	@if [ ! -d web/assets/css ] ; then  \
		mkdir web/assets/css ;\
	fi
	@if [ ! -d web/assets/images ] ; then  \
		mkdir web/assets/images ;\
	fi
	@if [ ! -d web/vendors ] ; then  \
		mkdir web/vendors ;\
		cd web/vendors ;\
		ln -s ../../src/nodefony-stage stage ;\
		cd ../.. ;\
	fi
	@if [ ! -e web/favicon.ico ] ; then \
		echo " copy favicon.ico " ;\
		cp app/Resources/public/favicon.ico web/ ;\
	fi 
	@if [ ! -e web/robots.txt ] ; then  \
		echo " copy robots.txt " ;\
		cp app/Resources/public/robots.txt web/ ;\
	fi 

sequelize:
	./console Sequelize:generate:entities
	./console Sequelize:fixtures:load

clean:
	@if [ -e  node_modules ] ; then \
		echo ""; \
		echo "############################################" ;\
		echo "#            CLEAN  NODE MODULES           #" ;\
		echo "############################################" ;\
		echo ""; \
		rm -rf node_modules/.bin ; \
		rm -rf node_modules/* ; \
	fi
	@if [ -e  tmp ] ; then \
		echo ""; \
		echo "##########################################" ;\
		echo "#            CLEAN  TEMPORARY            #" ;\
		echo "##########################################" ;\
		echo ""; \
		rm -rf tmp/* ; \
	fi
	@if [ -e  web ] ; then \
		echo ""; \
		echo "###################################################" ;\
		echo "#            CLEAN  WEB PUBLIC DIRECTOY           #" ;\
		echo "###################################################" ;\
		echo ""; \
		rm -rf web/* ; \
	fi
	make framework ;

test:
	npm test ;

certificates:
	@echo "";
	@echo "#########################################" ;
	@echo "#         NODEFONY CERTIFICATES         #" ;
	@echo "#########################################" ;
	@echo "";
	./bin/generateCertificates.sh;

docker-build:
	@echo "";
	@echo "#########################################" ;
	@echo "#         NODEFONY DOCKER BUILD         #" ;
	@echo "#########################################" ;
	@echo "";

	make clean ;

	make npm ;
	
	make install ;

	make certificates ;

.EXPORT_ALL_VARIABLES:
.PHONY: vendors doc
