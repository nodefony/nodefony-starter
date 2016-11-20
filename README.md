# **NODEFONY  FRAMEWORK**   [![Build Status](https://secure.travis-ci.org/nodefony/nodefony.png)](http://travis-ci.org/nodefony/nodefony) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/495/badge)](https://bestpractices.coreinfrastructure.org/projects/495)


##  **Framework Node.js  Symfony Like**

####-  **[Nodefony Demo](https://nodefony.net)**  
####-  **[Nodefony Documentation](https://nodefony.net/documentation)**  
####-  **[Nodefony Monitoring](https://nodefony.net/nodefony)**


#### Documentation in progress !!

## __Table of content__

- [Requirements](#requirements)
- [Install](#install)
- [Start](#start)
- [Configurations](#configurations)
- [Command line Interface](#cli)
- [Get Started](#bundles)
- [References / Thanks](#references--thanks)
- [Authors](#authors)
- [License](#license)
- [Demo](#demo)


## <a name="requirements"></a>Requirements

#### On your system *you must have Installed* :   
- ###### **[GIT](http://git-scm.com/)**  is Distributed version control system

-  **[GNU Make](https://www.gnu.org/software/make/)**  is a Tool which controls the generation of executables

-  **[Node.js](https://nodejs.org/)** ® is a Platform built on Chrome's JavaScript runtime

-  **[npm](https://www.npmjs.com/)**  is the Package Manager for javascript application

   npm will be automatically installed by Node.js

#### System :
- LINUX ( Checked )

  -  **[Install Node.js via Package](https://nodejs.org/en/download/package-manager)** 

- MACOS ( Checked )

- ~~WINDOWS ( Unchecked )~~

- EMBEDDED SYSTEM ( Very difficult : large memory footprint )  

## <a name="install"></a>Install Framework **More Info : [ Getting Started with Nodefony ](https://nodefony.net/documentation/Beta/nodefony/started)**  

**Node.js** :

```bash
$ git clone https://github.com/nodefony/nodefony.git

$ cd nodefony

$ make

```

## <a name="start"></a>Start

Add host name "nodefony.com" in your /etc/hosts  :
```bash
$ sudo vim /etc/hosts

##
# Host Database
#
# localhost is used to configure the loopback interface
##
127.0.0.1       localhost nodefony.com

```

Start the server to check:
```bash

# TO START NODEFONY IN DEVELOPMENT NODE

$ ./nodefony_dev


# OR 

# TO START NODEFONY IN PRODUCTION CLUSTER NODE

$ make start

# TO STOP 
$ make stop

# TO KILL ALL
$ make kill


```

Access to App with URL : http://nodefony.com:5151

[![nodefony](https://raw.githubusercontent.com/nodefony/nodefony/dev/src/nodefony/bundles/documentationBundle/Resources/public/images/nodefony.png)](https://github.com/nodefony/nodefony)

## <a name="configurations"></a>Configurations Kernel
Open **[./config/config.yml](https://github.com/nodefony/nodefony/blob/master/src/nodefony/config/config.yml)**  if you want change httpPort, domain server, locale ...
```bash
	#
	#  NODEFONY FRAMEWORK
	#
	#       KERNEL CONFIG
	#
	#
	name:                         "NODEFONY"
	system:                         
  		version:                      "1.0.0-beta"
  		domain:                       nodefony.com
  		httpPort:                     5151
  		httpsPort:                    5152
  		statics:                      true
  		security:                     true
  		realtime:                     true
  		monitoring:                   true

  		locale:                       "fr_fr"   

  		log:
    		active:                     true
    		messages:                   "/tmp/nodefony.log"
    		error:                      "/tmp/errorNodefony.log"
    		services:                   "/tmp/servicesNodefony.log"
    		rotate:                     false

```

## <a name="cli"></a>Command Line Interface
```bash
$./console -h            
	      _   _    ___    ____    _____   _____    ___    _   _  __   __
             | \ | |  / _ \  |  _ \  | ____| |  ___|  / _ \  | \ | | \ \ / /
             |  \| | | | | | | | | | |  _|   | |_    | | | | |  \| |  \ V /
             | |\  | | |_| | | |_| | | |___  |  _|   | |_| | | |\  |   | |  
             |_| \_|  \___/  |____/  |_____| |_|      \___/  |_| \_|   |_|  


		      CONSOLE Version : 1.0 PLATFORM : darwin  PROCESS PID : 60384

Usage: node console

  -h, --help     
  -v, --version  show version

Commands : [arguments]
nodefony
	npm:list								 List all installed packages
	npm:install							 Install all framework packages
framework
	generate:bundle nameBundle path                                  Generate a Bundle directory in path directory
	generate:controller  nameController path                         Generate a controller js file in bundle path
	generate:command nameCommand path                                Generate a command js file in bundle path
	generate:service nameService path                                Generate a service js file in bundle path
	router:generate:routes                                           Generate all routes
	router:generate:route routeName                                  Generate one route
	router:match:url url                                             Get route who match url
assetic
	assets:install                                                   Installs bundles web assets link under a public web directory
	assets:dump                                                      Dump  all bundles web assets under a public web directory
security
	encoders:Digest firewall login password [realm]                  Generate encoding keys digest MD5
sequelize
	Sequelize:fixtures:load                                          Load data fixtures to your database
	Sequelize:generate:entities                                      Generate All Entities
	Sequelize:query:sql connectionName SQL                           query sql in database connection  
	Sequelize:entity:findAll entity                                  query findAll ENTITY
App
	server:run                                                       Run Application                                                     Run Application

```

## <a name="bundles"></a>Get Started
#### Generate hello Bundle :
CLI Generate new bundle :    generate:bundle nameBundle path

```bash
$ ./console generate:bundle helloBundle src/bundles
              _   _    ___    ____    _____   _____    ___    _   _  __   __
             | \ | |  / _ \  |  _ \  | ____| |  ___|  / _ \  | \ | | \ \ / /
             |  \| | | | | | | | | | |  _|   | |_    | | | | |  \| |  \ V /
             | |\  | | |_| | | |_| | | |___  |  _|   | |_| | | |\  |   | |  
             |_| \_|  \___/  |____/  |_____| |_|      \___/  |_| \_|   |_|  


		      CONSOLE Version : 1.0 PLATFORM : darwin  PROCESS PID : 1069

GENERATE bundle : helloBundle LOCATION : src/bundles
Create Directory :helloBundle
Create Directory :Command
Create Directory :controller
Create File      :defaultController.js
Create Directory :manager
Create Directory :tests
Create Directory :Resources
Create Directory :config
Create File      :config.yml
Create File      :routing.yml
Create Directory :public
Create Directory :js
Create Directory :css
Create Directory :images
Create Directory :translations
Create Directory :views
Create File      :index.html.twig
Create Directory :core
Create Directory :Entity
Create File      :helloBundle.js
```
#### Add hello bundle in Framework :
Open Bundle App "appKernel.js" to add new hello Bundle in **registerBundles** array : **[./app/appKernel.js](https://github.com/nodefony/nodefony/blob/master/app/appKernel.js)**
```js
/*
 *	ENTRY POINT FRAMEWORK APP KERNEL
 */

nodefony.register("appKernel",function(){

	var appKernel = function(type, environment, debug, loader){

		// kernel constructor
		var kernel = this.$super;
		kernel.constructor(environment, debug, loader, type)

		/*
	 	*	Bundles to register in Application
	 	*/
		this.registerBundles([
			...
			"./src/bundles/helloBundle"
		]);

		...

	}.herite(nodefony.kernel);

	return appKernel;
})
```
#### Start Framework to check new Bundle hello:
```bash
$ make install
$ ./nodefony_dev
```

Access to bundle route with URL : http://nodefony.com:5151/hello


#### Start Framework in PRODUCTION CLUSTER MODE:
```
# TO START NODEFONY IN CLUSTER NODE

$ make start

# TO STOP 
$ make kill 

```

#### Monitoring FRAMEWORK in PRODUCTION CLUSTER MODE:

Access to monitoring route with URL : http://nodefony.com:5151/nodefony

[![MONITORING](https://raw.githubusercontent.com/nodefony/nodefony/master/src/nodefony/doc/Beta/cluster.png)](https://github.com/nodefony/nodefony)

Monitoring in progress !!! 


## <a name="references--thanks"></a>References / Thanks
#### NPM : *Will be automatically installed by Makefile*

```bash

.-----------------------------------------------------------------------------------------------------------------------------------------.
|                                                       NPM NODEFONY PACKAGES                                                             |
|-----------------------------------------------------------------------------------------------------------------------------------------|
|     NAME      | VERSION |						   DESCRIPTION                                                    |
|---------------|---------|---------------------------------------------------------------------------------------------------------------|
| less          | 2.6.1   | Leaner CSS                                                                                                    |
| memcached     | 2.2.1   | A fully featured Memcached API client, supporting both ...						          |
| mysql         | 2.10.2  | A node.js driver for mysql. It is written in JavaScript, does not require compiling ...			  |
| sequelize     | 3.19.3  | Multi dialect ORM for Node.JS/io.js                                                                           |
| sqlite3       | 3.1.1   | Asynchronous, non-blocking SQLite3 bindings                                                                   |
| synchronize   | 0.9.15  | Turns asynchronous function into synchronous                                                                  |
| uglify-js     | 2.6.2   | JavaScript parser, mangler/compressor and beautifier toolkit                                                  |
| uglifycss     | 0.0.20  | Port of YUI CSS Compressor to NodeJS                                                                          |
| ascii-table   | 0.0.8   | Easy tables for your console data                                                                             |
| asciify       | 1.3.5   | Plain text awesomizer. A hybrid npm module and CLI for turning plain text into ascii art.                     |
| async         | 1.5.2   | Higher-order functions and common patterns for asynchronous code                                              |
| connect       | 2.30.2  | High performance middleware framework                                                                         |
| js-yaml       | 3.5.4   | YAML 1.2 parser and serializer                                                                                |
| markdown-it   | 6.0.0   | Markdown-it - modern pluggable markdown parser.                                                               |
| mime          | 1.3.4   | A comprehensive library for mime-type mapping                                                                 |
| mkdirp        | 0.5.1   | Recursively mkdir, like `mkdir -p`                                                                            |
| node-getopt   | 0.2.3   | featured command line args parser                                                                             |
| node-pre-gyp  | 0.6.23  | Node.js native addon binary install tool                                                                      |
| npm           | 3.8.1   | a package manager for JavaScript                                                                              |
| promise       | 7.1.1   | Bare bones Promises/A+ implementation                                                                         |
| shortid       | 2.2.4   | Amazingly short non-sequential url-friendly unique id generator.                                              |
| twig          | 0.8.8   | JS port of the Twig templating language.                                                                      |
| websocket     | 1.0.22  | Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.               |
| pm2		| 1.1.3   | Production process manager for Node.JS applications with a built-in load balancer.				  |
| xml2js        | 0.4.16  | Simple XML to JavaScript object converter.                                                                    |
'-----------------------------------------------------------------------------------------------------------------------------------------'



```

**Big thanks:**


**Related Links:**
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Framework Symfony](http://symfony.com/)
- [Twig.js](https://github.com/justjohn/twig.js/wiki)

More informations [Documentation](https://nodefony.net/documentation)

## <a name="authors"></a>Authors

- Christophe CAMENSULI  [github/ccamensuli](https://github.com/ccamensuli)

##  <a name="license"></a>License

[CeCILL-B](https://github.com/nodefony/nodefony/blob/master/LICENSE)

##  <a name="demo"></a>Demo 

[Demo](http://nodefony.net)
