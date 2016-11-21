DISTRIB := $(shell uname)
VERBOSE = 0 

all: framework npm  install 

install:
	@if [ $(VERBOSE) = 0 ] ; then \
		./console npm:install ;\
	else \
		./.console_dev npm:install ;\
	fi \

	make asset
	make sequelize

	@if [ $(VERBOSE) = 0 ] ; then \
		./console router:generate:routes ;\
		./console npm:list ;\
	else \
		./.console_dev router:generate:routes ;\
		./.console_dev npm:list ;\
	fi \

	
node:
	make framework
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
	@if [  -f package.json  ] ; then  \
		echo "###########  NODE JS  MODULES  INSTALLATION  ###########" ;\
		if [ $(VERBOSE) = 0 ] ; then \
			npm -s install  ;\
		else \
			npm -ddd install  ;\
		fi \
	fi

deps:
	./console npm:install

asset:

	@if [ $(VERBOSE) = 0 ] ; then \
		./console assets:install ;\
		./console assets:dump ;\
	else \
		./.console_dev assets:install ;\
		./.console_dev assets:dump ;\
	fi \
	 
	@if [ ! -e web/favicon.ico ] ; then \
		cp app/Resources/public/favicon.ico web/ ;\
	fi \

	@if [ ! -e web/robots.txt ] ; then  \
		cp app/Resources/public/robots.txt web/ ;\
	fi \

framework:
	echo "###########  GIT SUBMODULES ###########" ;
	git submodule sync;
	git submodule update --init --recursive

	echo "###########  CREATE FRAMEWORK REPOSITORY ###########" ;
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
	./console Sequelize:generate:entities
	./console Sequelize:fixtures:load

clean:
	@if [ -e  node_modules ] ; then \
		echo "###########  CLEAN  NODE MODULES ###########" ;\
		rm -rf node_modules/.bin ; \
		rm -rf node_modules/* ; \
	fi
	@if [ -e  tmp ] ; then \
		echo "###########  CLEAN  TEMPORARY  ###########" ;\
		rm -rf tmp/* ; \
	fi
	@if [ -e  web ] ; then \
		echo "###########  CLEAN  WEB PUBLIC DIRECTOY  ###########" ;\
		rm -rf web/* ; \
	fi
	make framework

.EXPORT_ALL_VARIABLES:
.PHONY: vendors doc

