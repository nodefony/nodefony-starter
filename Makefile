DISTRIB := $(shell uname)


all: node  framework 

install:
	./console router:generate:routes
	make asset
	#make orm
	make sequelize
	
node:
	make clean
	@if [  -f package.json  ] ; then  \
		echo "###########  NODE JS  MODULES  INSTALLATION  ###########" ;\
		npm -d install  ;\
	fi

vendors:
	
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
	./console npm:install
	./console npm:list

orm:
	./console ORM2:connections:state
	./console ORM2:generate:entities
	./console ORM2:entity:show
	./console ORM2:fixtures:load

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

