DISTRIB := $(shell uname)
VERBOSE = 0 

all: framework npm  install 

install:
	@echo "";
	@echo "#########################################" ;
	@echo "#            NODEFONY INSTALL           #" ;
	@echo "#########################################" ;
	@echo "";

	@if [ $(VERBOSE) = 0 ] ; then \
		echo "./console npm:install";\
		./console npm:install ;\
	else \
		echo "./.console_dev npm:install";\
		./.console_dev npm:install ;\
	fi \

	@echo "make asset";
	make asset
	@echo "make sequelize";
	make sequelize

	@if [ $(VERBOSE) = 0 ] ; then \
		echo "./console router:generate:routes";\
		./console router:generate:routes ;\
		echo "./console npm:list";\
		./console npm:list ;\
	else \
		echo "./.console_dev router:generate:routes";\
		./.console_dev router:generate:routes ;\
		echo "./.console_dev npm:list";\
		./.console_dev npm:list ;\
	fi \

	
node:
	@echo "make framework";
	make framework
	@echo "make install";
	make install


#
# PM2 MANAGEMENT PRODUCTION 
#
startup:
	./node_modules/pm2/bin/pm2 startup

start:
	#make asset
	./nodefony_pm2 &

stop:
	./node_modules/pm2/bin/pm2 stop nodefony

kill:
	./node_modules/pm2/bin/pm2 kill

show:
	./node_modules/pm2/bin/pm2 show nodefony

monit:
	./node_modules/pm2/bin/pm2 monit nodefony

status:
	./node_modules/pm2/bin/pm2 status

reload:
	./node_modules/pm2/bin/pm2 reload all

restart:
	./node_modules/pm2/bin/pm2 restart all


# NODEFONY BUILD FRAMEWORK 
npm:
	@if [  -f package.json  ] ; then \
		echo "" ;\
		echo "#######################################################" ; \
		echo "#            NODE JS  MODULES  INSTALLATION           #" ; \
		echo "#######################################################" ; \
		echo "" ;\
		if [ $(VERBOSE) = 0 ] ; then \
			echo "npm -s install" ;\
			npm -s install  ;\
		else \
			echo "npm -ddd install" ;\
			npm -ddd install  ;\
		fi \
	fi

deps:
	./console npm:install

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
	 
	@if [ ! -e web/favicon.ico ] ; then \
		cp app/Resources/public/favicon.ico web/ ;\
	fi \

	@if [ ! -e web/robots.txt ] ; then  \
		cp app/Resources/public/robots.txt web/ ;\
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

sequelize:
	@echo "./console Sequelize:generate:entities";
	./console Sequelize:generate:entities
	@echo "./console Sequelize:fixtures:load";
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
	make framework

.EXPORT_ALL_VARIABLES:
.PHONY: vendors doc

