DISTRIB := $(shell uname)
VERBOSE = 0 

all: framework npm  install 

install:
	./console npm:install
	make asset
	make sequelize
	./console router:generate:routes
	./console npm:list
	
node:
	make framework
	make install


#
# PM2 MANAGEMENT PRODUCTION 
#
startup:
	./node_modules/pm2/bin/pm2 startup

start:
	make asset
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
	#make clean
	@if [  -f package.json  ] ; then  \
		echo "###########  NODE JS  MODULES  INSTALLATION  ###########" ;\
		if [ $(VERBOSE) = 0 ] ; then \
			npm -s install  ;\
		else \
			npm -ddd install  ;\
		fi \
	fi

asset:
	./console assets:dump 
	./console assets:install 

framework:
	@if [ ! -d tmp ] ; then  \
		mkdir tmp ;\
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

sequelize:
	./console Sequelize:generate:entities
	./console Sequelize:fixtures:load

clean:
	@if [ -e  node_modules ] ; then \
		echo "###########  CLEAN  NODE MODULES ###########" ;\
		rm -rf node_modules/* ; \
	fi

.EXPORT_ALL_VARIABLES:
.PHONY: vendors doc

