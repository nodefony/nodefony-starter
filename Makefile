DISTRIB := $(shell uname)


all: node install framework asset orm

install:
	@if [ -x  vendors/asciiArt/figlet222/figlet ] ; then  \
		echo "###########  INSTALL FIGLET ASCIIART  ###########" ;\
		cp vendors/asciiArt/figlet222/figlet bin/ ;\
	fi
	@if [ ! -d tmp ] ; then  \
		mkdir tmp ;\
	fi
	@if [ ! -d bin ] ; then  \
		mkdir bin ;\
	fi
node:
	@if [  -f package.json  ] ; then  \
		echo "###########  NODE JS  MODULES  INSTALATION  ###########" ;\
		npm -d install  ;\
	fi

vendors:
	
doc:
	./node_modules/.bin/yuidoc -c vendors/yahoo/yuidoc/yuidoc.json -T default


asset:
	./console assets:install 

framework:
	./console npm:install
	./console npm:list
	./console router:generate:routes

orm:
	./console ORM2:connections:state
	./console ORM2:generate:entities
	./console ORM2:entity:show
	./console ORM2:fixtures:load

clean:
	@if [ -e  node_modules ] ; then \
		echo "###########  CLEAN  NODE MODULES ###########" ;\
		rm -rf node_modules/* ; \
		rm -rf node_modules/.* ; \
	fi

.EXPORT_ALL_VARIABLES:
.PHONY: vendors doc

