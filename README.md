# **NODEFONY  FRAMEWORK**  
[![Issues Status](https://img.shields.io/github/issues/nodefony/nodefony.svg)](https://github.com/nodefony/nodefony/issues) [![Build Status](https://travis-ci.org/nodefony/nodefony.svg?branch=master)](https://travis-ci.org/nodefony/nodefony) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/495/badge)](https://bestpractices.coreinfrastructure.org/projects/495)  [![bitHound Overall Score](https://www.bithound.io/github/nodefony/nodefony/badges/score.svg)](https://www.bithound.io/github/nodefony/nodefony)

Nodefony is Node.js full-stack web framework.  

Nodefony can be used to develop a complete solution to create a web application.

The Nodefony project is inspired by the PHP Symfony framework, a developer can find most of the concepts, configurations and patterns of Symfony framework.

Nodefony is not an exhaustive port of symfony !

Nodefony assimilates into the ecosystem of node.js with services like :
- Web servers (websocket(s), http(s)).
- Notion of real-time context in Action Controller (Websocket).
- Notion of synchronous or asynchronous execution in Action Controller (Promise). 
- [WEBPACK](https://webpack.js.org/) Module bundler for assets management of application .
- [WATCHER](https://nodejs.org/docs/latest/api/fs.html#fs_fs_watch_filename_options_listener) node.js for auto reload-files in developement mode .
- [PM2](http://pm2.keymetrics.io/) Production Process Manager for Node.js .
- [Passport](http://passportjs.org/) Simple, unobtrusive authentication for Node.js .

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
Open **[./config/config.yml](https://github.com/nodefony/nodefony/blob/master/src/nodefony/config/config.yml)**  if you want change httpPort, domain ,servers, add bundle, locale ...
```yml
#########################################################
#
#  NODEFONY FRAMEWORK
#
#       KERNEL CONFIG
#

name                            : "NODEFONY"
version                         : "2.1.0-beta"
system:
  domain                        : localhost                             # nodefony can listen only one domain ( no vhost )  /    [::1] for IPV6 only
  domainAlias:                                                          # domainAlias string only <<regexp>>   example ".*\\.nodefony\\.com  ^nodefony\\.eu$ ^.*\\.nodefony\\.eu$"
    - "^127.0.0.1$" 
    - "^docker.nodefony$"
  httpPort                      : 5151
  httpsPort                     : 5152
  statics                       : true
  security                      : true
  realtime                      : true
  monitoring                    : true
  locale                        : "en_en"

  servers:
    http                        : true
    https	                : true	
    ws			        : true	
    wss			        : true
    certificats:
      key                       : "config/certificates/server/privkey.pem"
      cert                      : "config/certificates/server/fullchain.pem"
      ca                        : "config/certificates/ca/nodefony-root-ca.crt.pem"
      options:
        rejectUnauthorized      : false

  bundles:
    documentation 	        : "./src/nodefony/bundles/documentationBundle"
    test		        : "./src/nodefony/bundles/unitTestBundle"
    demo			: "./src/bundles/demoBundle"

  PM2:
    script		        : "nodefony"
    name			: "demo"
    exec_mode		        : "cluster"
    max_memory_restart	        : "1024M"
    autorestart		        : true
    max_restarts		: 10
    watch			: false
    error_file                  : "tmp/nodefony.log" 
    out_file                    : "tmp/nodefony.error.log"
    merge_logs                  : true
    env:
      NODE_ENV                  : "production"
      MODE_START                : "PM2"
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
                                                                            

		      NODEFONY CONSOLE CLUSTER MASTER Version : 2.0.3-beta PLATFORM : darwin  PROCESS PID : 76088

Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : GENERATE bundle : helloBundle LOCATION : src/bundles
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :helloBundle
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :Command
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :controller
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create File      :defaultController.js
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :services
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :tests
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create File      :helloBundleTest.js
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :Resources
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :config
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create File      :config.yml
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create File      :routing.yml
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :public
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :js
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create File      :hello.js
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :css
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create File      :hello.css
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :images
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :assets
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :js
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :css
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :fonts
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :images
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :translations
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :views
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create File      :index.html.twig
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :doc
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :1.0
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create File      :readme.md
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :core
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create Directory :Entity
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create File      :helloBundle.js
Fri Mar 24 2017 16:05:01 INFO SERVICE generate   : Create File      :package.json
```
#### Now helleBundle is auto-insert in framework with watcher active and auto-config Webpack Module bundler   :
 - watcher : 

   The bundle generation engine build bundle config with  node.js watcher configuration

   In developement mode  is very usefull to auto-reload files as controllers , views , routing , translations

   without having to reboot the server.

 - Webpack Module bundler : 

   The bundle generation engine build bundle config with a predefined webpack configuration

   In this way webpack is very usefull to manage all assets of bundle

   In developement mode watch  is very usefull to auto-compile webpack module bundle

   without having to reboot the server
   
You can see helleBundle config   : vim  ./src/bundles/helloBundle/Resources/config/config.yml
```yml
########## nodefony CONFIG BUNDLE  helloBundle  ############
name :                          helloBundle
version:                        "1.0"
locale :                        en_en

#
#  WATCHERS
#    
#    watchers Listen to changes, deletion, renaming of files and directories 
#    of different components
#       
#    For watch all components 
# 
#      watch:                   true
#    or 
#      watch:
#        controller:            true
#        config:                true
#        views:                 true
#        translations:          true
#
watch:                          true

#
#  WEBPACK CONFIG       
#
webpack:
  entry:
    main:                       "./js/hello.js"
  watch:                        true
  devtool:                      "source-map"
  output:
    filename:                   "./assets/js/hello.js"
    library:                    "hello"
    libraryTarget:              "umd"

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

```
┌──────────────────────────────┬──────────┬────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ NAME                         │ VERSION  │ DESCRIPTION                                                                                        │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ asciify                      │ 1.3.5    │ Plain text awesomizer. A hybrid npm module and CLI for turning plain text into ascii art.          │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ babel-cli                    │ 6.24.1   │ Babel command line.                                                                                │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ babel-loader                 │ 6.4.1    │ babel module loader for webpack                                                                    │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ babel-preset-es2015          │ 6.24.1   │ Babel preset for all es2015 plugins.                                                               │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ babel-register               │ 6.24.1   │ babel require hook                                                                                 │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ bluebird                     │ 3.5.0    │ Full featured Promises/A+ implementation with exceptionally good performance                       │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ bootstrap                    │ 3.3.7    │ The most popular front-end framework for developing responsive, mobile first projects on the web.  │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ bootstrap-loader             │ 2.0.0    │ Boostrap for Webpack                                                                               │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ chai                         │ 3.5.0    │ BDD/TDD assertion library for node.js and the browser. Test framework agnostic.                    │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ cheerio                      │ 0.22.0   │ Tiny, fast, and elegant implementation of core jQuery designed specifically for the server         │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ chokidar                     │ 1.6.1    │ A neat wrapper around node.js fs.watch / fs.watchFile / fsevents.                                  │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ cli-color                    │ 1.2.0    │ Colors, formatting and other tools for the console                                                 │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ cli-table                    │ 0.3.1    │ Pretty unicode tables for the CLI                                                                  │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ connect                      │ 2.30.2   │ High performance middleware framework                                                              │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ cookie                       │ 0.3.1    │ HTTP server cookie parsing and serialization                                                       │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ css-loader                   │ 0.28.0   │ css loader module for webpack                                                                      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ elasticsearch                │ 13.0.0-… │ The official low-level Elasticsearch client for Node.js and the browser.                           │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ extract-text-webpack-plugin  │ 2.1.0    │ Extract text from bundle into a file.                                                              │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ file-loader                  │ 0.11.1   │ file loader module for webpack                                                                     │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ font-awesome                 │ 4.7.0    │ The iconic font and CSS framework                                                                  │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ img-loader                   │ 2.0.0    │ Image minimizing loader for webpack                                                                │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ jquery                       │ 3.2.1    │ JavaScript library for DOM operations                                                              │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ js-yaml                      │ 3.8.3    │ YAML 1.2 parser and serializer                                                                     │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ jshint                       │ 2.9.4    │ Static analysis tool for JavaScript                                                                │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ less                         │ 2.7.2    │ Leaner CSS                                                                                         │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ less-loader                  │ 4.0.3    │ Less loader for webpack. Compiles Less to CSS.                                                     │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ markdown-it                  │ 8.3.1    │ Markdown-it - modern pluggable markdown parser.                                                    │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ memcached                    │ 2.2.2    │ A fully featured Memcached API client, supporting both single and clustered Memcached servers thr… │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ mime                         │ 1.3.4    │ A comprehensive library for mime-type mapping                                                      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ mkdirp                       │ 0.5.1    │ Recursively mkdir, like `mkdir -p`                                                                 │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ mocha                        │ 3.2.0    │ simple, flexible, fun test framework                                                               │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ mysql                        │ 2.13.0   │ A node.js driver for mysql. It is written in JavaScript, does not require compiling, and is 100% … │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ node-getopt                  │ 0.2.3    │ featured command line args parser                                                                  │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ node-pre-gyp                 │ 0.6.34   │ Node.js native addon binary install tool                                                           │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ node-sass                    │ 4.5.2    │ Wrapper around libsass                                                                             │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ nodefony-stage               │ 0.0.2    │ Client Side Nodefony web developpement                                                             │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ nodegit                      │ 0.18.0   │ Node.js libgit2 asynchronous native bindings                                                       │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ npm                          │ 4.5.0    │ a package manager for JavaScript                                                                   │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ npmi                         │ 2.0.1    │ Gives a simplier API to npm install (programatically installs stuffs)                              │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ optimize-css-assets-webpack… │ 1.3.1    │ A Webpack plugin to optimize \ minimize CSS assets.                                                │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ passport                     │ 0.3.2    │ Simple, unobtrusive authentication for Node.js.                                                    │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ passport-github2             │ 0.1.10   │ GitHub authentication strategy for Passport.                                                       │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ passport-google-oauth        │ 1.0.0    │ Google (OAuth) authentication strategies for Passport.                                             │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ passport-http                │ 0.3.0    │ HTTP Basic and Digest authentication strategies for Passport.                                      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ passport-ldapauth            │ 1.0.0    │ LDAP authentication strategy for Passport                                                          │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ passport-local               │ 1.0.0    │ Local username and password authentication strategy for Passport.                                  │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ passport-nodefony            │ 2.0.2    │ Passport strategy wrapper for nodefony framework                                                   │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ pm2                          │ 2.4.5    │ Production process manager for Node.JS applications with a built-in load balancer.                 │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ promise                      │ 7.1.1    │ Bare bones Promises/A+ implementation                                                              │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ qs                           │ 6.4.0    │ A querystring parser that supports nesting and arrays, with a depth limit                          │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ raw-loader                   │ 0.5.1    │ raw loader module for webpack                                                                      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ request                      │ 2.81.0   │ Simplified HTTP request client.                                                                    │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ resolve-url-loader           │ 2.0.2    │ Webpack loader that resolves relative paths in url() statements based on the original source file  │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ sass-loader                  │ 6.0.3    │ Sass loader for webpack                                                                            │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ sequelize                    │ 3.30.4   │ Multi dialect ORM for Node.JS/io.js                                                                │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ shortid                      │ 2.2.8    │ Amazingly short non-sequential url-friendly unique id generator.                                   │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ sqlite3                      │ 3.1.8    │ Asynchronous, non-blocking SQLite3 bindings                                                        │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ style-loader                 │ 0.16.1   │ style loader module for webpack                                                                    │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ twig                         │ 1.10.4   │ JS port of the Twig templating language.                                                           │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ uglify-js                    │ 2.8.22   │ JavaScript parser, mangler/compressor and beautifier toolkit                                       │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ uglifycss                    │ 0.0.25   │ Port of YUI CSS Compressor to NodeJS                                                               │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ url-loader                   │ 0.5.8    │ url loader module for webpack                                                                      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ useragent                    │ 2.1.13   │ Fastest, most accurate & effecient user agent string parser, uses Browserscope's research for par… │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ webpack                      │ 2.4.1    │ Packs CommonJs/AMD modules for the browser. Allows to split your codebase into multiple bundles, … │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ webpack-merge                │ 4.1.0    │ Variant of merge that's useful for webpack configuration                                           │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ websocket                    │ 1.0.24   │ Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.    │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ xml2js                       │ 0.4.17   │ Simple XML to JavaScript object converter.                                                         │
└──────────────────────────────┴──────────┴────────────────────────────────────────────────────────────────────────────────────────────────────┘
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
