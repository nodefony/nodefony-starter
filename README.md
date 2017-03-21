# **NODEFONY  FRAMEWORK**  
[![Issues Status](https://img.shields.io/github/issues/nodefony/nodefony.svg)](https://github.com/nodefony/nodefony/issues) [![Build Status](https://travis-ci.org/nodefony/nodefony.svg?branch=master)](https://travis-ci.org/nodefony/nodefony) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/495/badge)](https://bestpractices.coreinfrastructure.org/projects/495) [![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/nodefony/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link) [![bitHound Overall Score](https://www.bithound.io/github/nodefony/nodefony/badges/score.svg)](https://www.bithound.io/github/nodefony/nodefony)

Nodefony is Node.js full-stack web framework.  

Nodefony can be used to develop a complete solution to create a web application.

The Nodefony project is inspired by the PHP Symfony framework, a developer can find most of the concepts, configurations and patterns of Symfony framework.

Nodefony is not an exhaustive port of symfony, nodefony add services like:
- Web servers (websocket(s), http(s)).
- Notion of real-time context in Action Controller (Websocket).
- Notion of synchronous or asynchronous execution in Action Controller (Promise). 

Now in this version Beta,  Nodefony is evolved to a stable version without major fundamental changes.

Evolution priorities up to the stable version will focus on robustness, unit testing, documentation and security.

#### Now nodefony is ported with ECMAScript 6 ( Class, Inheritance ).

You can follow Nodefony build on travis at **[https://travis-ci.org/nodefony/nodefony](https://travis-ci.org/nodefony/nodefony)**

##  **Resources for Newcomers**

#### -  **[Nodefony Demo](https://nodefony.net)**  
#### -  **[Nodefony Documentation](https://nodefony.net/documentation)**  
#### -  **[Nodefony Monitoring](https://nodefony.net/nodefony)**


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

-  **[Node.js](https://nodejs.org/)** ® is a Platform built on Chrome's JavaScript runtime ( >= 6 )

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

$ make build

```

## <a name="start"></a>Start

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

Access to App with URL : http://localhost:5151

[![nodefony](https://raw.githubusercontent.com/nodefony/nodefony/master/src/nodefony/bundles/documentationBundle/Resources/public/images/nodefony.png)](https://github.com/nodefony/nodefony)

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
  		version:                      "2.0.2-beta"
		domain:                       127.0.0.1                    # nodefony can listen only one domain ( no vhost )
		domainAlias:                  "^localhost$"                # domainAlias string only <<regexp>> the separator is space
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
                                                                            

		      NODEFONY CONSOLE CLUSTER MASTER Version : 1.0.3-beta PLATFORM : darwin  PROCESS PID : 85821

Usage: node console

  -h, --help     
  -v, --version  show version

Commands : [arguments]
nodefony
	npm:list							 List all installed packages 
	npm:install							 Install all framework packages
framework
	generate:bundle nameBundle path                                  Generate a Bundle directory in path directory
	generate:controller  nameController path                         Generate a controller js file in bundle path
	generate:command nameCommand path                                Generate a command js file in bundle path
	generate:service nameService path                                Generate a service js file in bundle path
	router:generate:routes                                           Generate all routes
	router:generate:route routeName                                  Generate one route Example : ./console router:generate:route home 
	router:match:url url                                             Get route who match url Example : ./console router:match:url /nodefony
assetic
	assets:install                                                   Installs bundles web assets link under a public web directory 
	assets:dump                                                      Dump  all bundles web assets under a public web directory 
security
	encoders:Digest firewall login password [realm]                  Generate encoding keys digest MD5 Example : ./console encoders:Digest secured_area login password
monitoring
	Monitoring:test:load URL [nbRequests] [concurence]               load test example ./console Monitoring:test:load http://nodefony.com:5151/demo 10000 100 
sequelize
	Sequelize:fixtures:load                                          Load data fixtures to your database
	Sequelize:generate:entities [force]                              Generate All Entities force to delete table if exist  example : ./console Sequelize:generate:entities force 
	Sequelize:query:sql connectionName SQL                           query sql in database connection  example : ./console  Sequelize:query:sql nodefony  'select * from users'
	Sequelize:entity:findAll entity                                  query findAll ENTITY
unitTest
	unitTest:list:all                                                List all unit tests
	unitTest:list:bundle bundleName                                  List all bundle unit tests
	unitTest:launch:all                                              Launch all tests
	unitTest:launch:bundle bundleName { testfile }                   Launch bundle tests

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
 *
 */
nodefony.register("appKernel",function(){

	var appKernel = class appKernel extends nodefony.kernel {

		constructor (type, environment, debug, loader, settings){
			
			// kernel constructor
			super(environment, debug, loader, type, settings)

			/*
	 		*	Bundles to register in Application
	 		*/
			this.registerBundles([
				...
				"./src/bundles/helloBundle"
			]);

			...	
		};
	};
	return appKernel;
})
```
#### Start Framework to check new Bundle hello:
```bash
$ make 
$ ./nodefony_dev

# TO STOP
$ <ctrl-c> 
```

Access to bundle route with URL : http://localhost:5151/hello


#### Start Framework in PRODUCTION CLUSTER MODE:
```
# TO START NODEFONY IN CLUSTER NODE

$ make start

# TO STOP 
$ make kill 

```

#### Nodefony HTTPS Access :
By default nodefony listen secure port in 5152 

During the installation process all the openssl parts were generated ( self-signed localhost certificate ).

You must Add a Trusted CA in your browser : nodefony-root-ca.crt.pem

You can find certificate authority (ca) here: 

```
./config/certificates/ca/nodefony-root-ca.crt.pem 

```
Access  with URL : https://localhost:5152/hello



#### Monitoring FRAMEWORK in PRODUCTION CLUSTER MODE:

Access to monitoring route with URL : http://localhost:5151/nodefony

[![MONITORING](https://raw.githubusercontent.com/nodefony/nodefony/master/src/nodefony/doc/Beta/cluster.png)](https://github.com/nodefony/nodefony)

Monitoring in progress !!! 


## <a name="references--thanks"></a>References / Thanks
#### NPM : *Will be automatically installed by Makefile*

```bash
.------------------------------------------------------------------------------------------------------------------------------------------------------.
|                                                                NPM NODEFONY PACKAGES                                                                 |
|------------------------------------------------------------------------------------------------------------------------------------------------------|
|         NAME          | VERSION |                                                    DESCRIPTION                                                     |
|-----------------------|---------|--------------------------------------------------------------------------------------------------------------------|
| chai                  | 3.5.0   | BDD/TDD assertion library for node.js and the browser. Test framework agnostic.                                    |
| cheerio               | 0.22.0  | Tiny, fast, and elegant implementation of core jQuery designed specifically for the server                         |
| elasticsearch         | 12.1.3  | The official low-level Elasticsearch client for Node.js and the browser.                                           |
| less                  | 2.7.2   | Leaner CSS                                                                                                         |
| memcached             | 2.2.2   | A fully featured Memcached API client, supporting both single and clustered Memcached servers through consiste ... |
| passport              | 0.3.2   | Simple, unobtrusive authentication for Node.js.                                                                    |
| passport-github2      | 0.1.10  | GitHub authentication strategy for Passport.                                                                       |
| passport-google-oauth | 1.0.0   | Google (OAuth) authentication strategies for Passport.                                                             |
| passport-http         | 0.3.0   | HTTP Basic and Digest authentication strategies for Passport.                                                      |
| passport-ldapauth     | 0.6.0   | LDAP authentication strategy for Passport                                                                          |
| passport-local        | 1.0.0   | Local username and password authentication strategy for Passport.                                                  |
| passport-nodefony     | 2.0.2   | Passport strategy wrapper for nodefony framework                                                                   |
| qs                    | 6.3.0   | A querystring parser that supports nesting and arrays, with a depth limit                                          |
| sequelize             | 3.30.1  | Multi dialect ORM for Node.JS/io.js                                                                                |
| uglify-js             | 2.7.5   | JavaScript parser, mangler/compressor and beautifier toolkit                                                       |
| uglifycss             | 0.0.25  | Port of YUI CSS Compressor to NodeJS                                                                               |
| useragent             | 2.1.12  | Fastest, most accurate & effecient user agent string parser, uses Browserscope's research for parsing              |
| yallist               | 2.0.0   | Yet Another Linked List                                                                                            |
| ascii-table           | 0.0.9   | Easy tables for your console data                                                                                  |
| asciify               | 1.3.5   | Plain text awesomizer. A hybrid npm module and CLI for turning plain text into ascii art.                          |
| bluebird              | 3.4.7   | Full featured Promises/A+ implementation with exceptionally good performance                                       |
| connect               | 2.30.2  | High performance middleware framework                                                                              |
| cookie                | 0.3.1   | HTTP server cookie parsing and serialization                                                                       |
| js-yaml               | 3.8.1   | YAML 1.2 parser and serializer                                                                                     |
| jshint                | 2.9.4   | Static analysis tool for JavaScript                                                                                |
| markdown-it           | 8.2.2   | Markdown-it - modern pluggable markdown parser.                                                                    |
| mime                  | 1.3.4   | A comprehensive library for mime-type mapping                                                                      |
| mkdirp                | 0.5.1   | Recursively mkdir, like `mkdir -p`                                                                                 |
| mysql                 | 2.13.0  | A node.js driver for mysql. It is written in JavaScript, does not require compiling, and is 100% MIT licensed.     |
| node-getopt           | 0.2.3   | featured command line args parser                                                                                  |
| node-pre-gyp          | 0.6.33  | Node.js native addon binary install tool                                                                           |
| nodegit               | 0.17.0  | Node.js libgit2 asynchronous native bindings                                                                       |
| npm                   | 4.1.2   | a package manager for JavaScript                                                                                   |
| npmi                  | 2.0.1   | Gives a simplier API to npm install (programatically installs stuffs)                                              |
| pm2                   | 2.4.0   | Production process manager for Node.JS applications with a built-in load balancer.                                 |
| promise               | 7.1.1   | Bare bones Promises/A+ implementation                                                                              |
| shortid               | 2.2.6   | Amazingly short non-sequential url-friendly unique id generator.                                                   |
| sqlite3               | 3.1.8   | Asynchronous, non-blocking SQLite3 bindings                                                                        |
| twig                  | 0.10.3  | JS port of the Twig templating language.                                                                           |
| websocket             | 1.0.24  | Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.                    |
| xml2js                | 0.4.17  | Simple XML to JavaScript object converter.                                                                         |
'------------------------------------------------------------------------------------------------------------------------------------------------------'
```

**Big thanks:**


**Related Links:**
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Framework Symfony](http://symfony.com/)
- [Twig.js](https://github.com/justjohn/twig.js/wiki)
- [PM2](https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md)

More informations [Documentation](https://nodefony.net/documentation)

## <a name="authors"></a>Authors

- Christophe CAMENSULI  [github/ccamensuli](https://github.com/ccamensuli)

##  <a name="license"></a>License

[CeCILL-B](https://github.com/nodefony/nodefony/blob/master/LICENSE)

##  <a name="demo"></a>Demo 

[Demo](https://nodefony.net)
