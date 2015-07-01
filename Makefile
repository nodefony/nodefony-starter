DISTRIB := $(shell uname)


all: node  framework install 

install:
	./console npm:install
	make asset
	make sequelize
	./console router:generate:routes
	./console npm:list
	
node:
	make clean
	@if [  -f package.json  ] ; then  \
		echo "###########  NODE JS  MODULES  INSTALLATION  ###########" ;\
		npm -d install  ;\
	fi

	
doc:
	./node_modules/.bin/yuidoc -c vendors/yahoo/yuidoc/yuidoc.json -T default

asset:
	./console assets:install 

framework:
	@if [ ! -d tmp ] ; then  \
		mkdir tmp ;\
	fi
	@if [ ! -d bin ] ; then  \
		mkdir bin ;\
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

