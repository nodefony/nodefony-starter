# **NODEFONY  FRAMEWORK**  
[![Issues Status](https://img.shields.io/github/issues/nodefony/nodefony.svg)](https://github.com/nodefony/nodefony/issues) [![Build Status](https://travis-ci.org/nodefony/nodefony.svg?branch=master)](https://travis-ci.org/nodefony/nodefony) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/495/badge)](https://bestpractices.coreinfrastructure.org/projects/495)  [![bitHound Overall Score](https://www.bithound.io/github/nodefony/nodefony/badges/score.svg)](https://www.bithound.io/github/nodefony/nodefony)

Nodefony is Node.js full-stack web framework.  

Nodefony can be used to develop a complete solution to create a web application.

The Nodefony project is inspired by the PHP Symfony framework, a developer can find most of the concepts, configurations and patterns of Symfony framework.

Nodefony is not an exhaustive port of symfony !

Nodefony features :
- Servers  (http(s), websocket(s), statics, sockjs)
- Dynamics routing
- ORM ([Sequelize](http://docs.sequelizejs.com/))
- Simple Databases connection (mongo, redis ...)
- MVC templating (Twig)
- HMR hot module Replacement  (auto-reload controller views routing in developement mode)
- Notion of real-time context in Action Controller (websocket).
- Notion of synchronous or asynchronous execution in Action Controller (Promise).
- Services Containers, Dependency Injection (Design Patterns)
- Sessions Manager (ORM, memcached)
- Authentication Manager (Digest, Basic, oAuth, Local, ldap)
- Firewall ( Application Level )
- Cross-Origin Resource Sharing ([CORS](https://www.w3.org/TR/cors/))
- Production Management ([PM2](https://github.com/Unitech/pm2/))
- RealTime API (Bayeux Protocol)
- Translations
- CLI (Command Line Interface)
- Monitororing , Debug Bar
- Unit Test Api in framework context ([MOCHA](https://mochajs.org/))

Nodefony assimilates into the ecosystem of node.js with services like :
- [WEBPACK](https://webpack.js.org/) Module bundler for assets management of application .
- [WATCHER](https://nodejs.org/docs/latest/api/fs.html#fs_fs_watch_filename_options_listener) node.js for auto reload-files in developement mode .
- [PM2](http://pm2.keymetrics.io/) Production Process Manager for Node.js .
- [Passport](http://passportjs.org/) Simple, unobtrusive authentication for Node.js .

Nodefony 3  adds the following features :
- [Angular](https://github.com/angular/angular-cli) Bundle Generator ( Now an Angular Project can be merge into a Nodefony Bundle )
- ~~[React](https://github.com/facebookincubator/create-react-app) Bundle Generator ( Soon an React Project can be merge into a Nodefony Bundle )~~
- [SockJS](https://github.com/sockjs) Server ( Like WDS 'Webpack Dev Server' and HMR management )
- New cli Management (Command Line Interface )
- [Electron](https://github.com/nodefony/nodefony-electron) Experimental Nodefony Electron  ( Now an Electron Context can be use in Nodefony Project  )

Now in this version  3 Beta,  Nodefony is evolved to a stable version without major fundamental changes.

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
- [Start Development Mode](#start)
- [Configurations](#configurations)
- [Command line Interface](#cli)
- [Get Started](#bundles)
- [Start Production Mode](#start_prod)
- [HTTPS Access](#https)
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

## <a name="start"></a>Start Development Mode

Start the server to check:
```bash
# TO START NODEFONY IN DEVELOPMENT NODE

$ ./nodefony dev

// debug mode
$ ./nodefony -d dev
```

Access to App with URL : http://localhost:5151

[![nodefony](https://raw.githubusercontent.com/nodefony/nodefony-core/master/src/nodefony/bundles/documentationBundle/Resources/public/images/nodefony.png)](https://nodefony.net)

## <a name="configurations"></a>Configurations Kernel
Open **[./config/config.yml](https://github.com/nodefony/nodefony-core/blob/master/config/config.yml)**  if you want change httpPort, domain ,servers, add bundle, locale ...
```yml
system:
  domain                        : localhost                             # nodefony can listen only one domain ( no vhost )  /    [::1] for IPV6 only
  domainAlias:                                                          # domainAlias string only <<regexp>>   example ".*\\.nodefony\\.com  ^nodefony\\.eu$ ^.*\\.nodefony\\.eu$"
    - "^127.0.0.1$"
  httpPort                      : 5151
  httpsPort                     : 5152
  statics                       : true
  security                      : true
  realtime                      : true
  monitoring                    : true
  documentation                 : true
  unitTest                      : true
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

  bundles                       :
    demo                        : "src/bundles/demoBundle"                 
```

## <a name="cli"></a>Command Line Interface
```bash
$./nodefony -h            
 _   _    ___    ____    _____   _____    ___    _   _  __   __
| \ | |  / _ \  |  _ \  | ____| |  ___|  / _ \  | \ | | \ \ / /
|  \| | | | | | | | | | |  _|   | |_    | | | | |  \| |  \ V /
| |\  | | |_| | | |_| | | |___  |  _|   | |_| | | |\  |   | |  
|_| \_|  \___/  |____/  |_____| |_|      \___/  |_| \_|   |_|  

Version : 3.0.0-beta Platform : darwin Process : nodefony PID : 15336

Usage: nodefony [options] <cmd> [args...]

Options:

-d, --debug         Nodefony debug
-h, --help          Nodefony help
-v, --version       Nodefony version
-i, --interactive   Nodefony cli Interactive Mode

Command :

nodefony
    dev							 	 Run Nodefony Development Server  
    prod							 	 Run Nodefony Preprod Server
    pm2							 	 Run Nodefony Production Server ( PM2 mode )
    app							 	 Get Nodefony App name  
    npm:install							 Install all NPM framework packages
    npm:list							 List all NPM installed packages
framework
    generate:bundle nameBundle path                                  Generate a nodefony Bundle  Example : nodefony generate:bundle myBundle ./src/bundles
    generate:bundle:angular nameBundle path                          Generate a Angular Bundle  Example : nodefony generate:bundle:angular myBundle ./src/bundles
    generate:bundle:react nameBundle path                            Generate a React Bundle Example : nodefony generate:bundle:react myBundle ./src/bundles
    generate:controller  nameController bundlePath                   Generate a controller Example : nodefony generate:controller myController ./src/bundles/myBundle
    generate:command nameCommand path                                Generate a command js file in bundle path
    generate:service nameService path                                Generate a service js file in bundle path
    router:generate:routes                                           Generate all routes
    router:generate:route routeName                                  Generate one route Example : nodefony router:generate:route home
    router:match:url url                                             Get route who match url Example : nodefony router:match:url /nodefony
    webpack:dump                                                     Compile webpack for all bundles
security
    encoders:Digest firewall login password [realm]                  Generate encoding keys digest MD5 Example : nodefony encoders:Digest secured_area login password
sequelize
    Sequelize:fixtures:load                                          Load data fixtures to your database
    Sequelize:generate:entities [force]                              Generate All Entities force to delete table if exist  example : nodefony Sequelize:generate:entities force
    Sequelize:query:sql connectionName SQL                           query sql in database connection  example : nodefony  Sequelize:query:sql nodefony  'select * from users'
    Sequelize:entity:findAll entity                                  query findAll ENTITY
monitoring
    Monitoring:test:load URL [nbRequests] [concurence]               load test example : nodefony Monitoring:test:load http://localhost:5151/demo 10000 100
unitTest
    unitTest:list:all                                                List all unit tests
    unitTest:list:bundle bundleName                                  List all bundle unit tests
    unitTest:launch:all                                              Launch all tests Example : nodefony unitTest:launch:all
    unitTest:launch:bundle bundleName { testfile }                   Launch bundle tests Example: nodefony unitTest:launch:bundle demoBundle responseTest.js
```

## <a name="bundles"></a>Get Started
#### Generate hello Bundle :
CLI Generate new bundle :    generate:bundle nameBundle path

```bash
$ ./nodefony generate:bundle helloBundle src/bundles

Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : GENERATE bundle : helloBundle LOCATION : /Users/cci/repository/nodefony/src/bundles
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :helloBundle
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :Command
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :controller
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create File      :defaultController.js
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :services
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :tests
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create File      :helloBundleTest.js
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :Resources
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :config
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create File      :config.yml
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create File      :routing.yml
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :webpack
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create File      :webpack.common.js
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create File      :webpack.dev.config.js
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create File      :webpack.prod.config.js
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create File      :security.yml
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :public
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :js
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create File      :hello.js
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :css
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create File      :hello.css
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :images
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :assets
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :js
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :css
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :fonts
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :images
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :translations
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :views
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create File      :index.html.twig
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :doc
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :1.0
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create File      :readme.md
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create symbolic link :Default
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :core
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create Directory :Entity
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create File      :helloBundle.js
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create symbolic link :readme.md
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : Create File      :package.json
Wed Jul 19 2017 15:22:12 INFO SERVICE CLI KERNEL  : INSTALL ASSETS LINK IN WEB PUBLIC DIRECTORY  : /Users/cci/repository/nodefony-core/web/
┌─────────┬───────────────────┬────────────────────────────────────────────┬───────────┬────────────────┐
│ BUNDLES │ DESTINATION PATH  │ SOURCE PATH                                │ SIZE      │ ASSETS COMPILE │
├─────────┼───────────────────┼────────────────────────────────────────────┼───────────┼────────────────┤
│ hello   │ ./web/helloBundle │ ./src/bundles/helloBundle/Resources/public │ 483 bytes │ 0 bytes        │
└─────────┴───────────────────┴────────────────────────────────────────────┴───────────┴────────────────┘
Wed Jul 19 2017 15:22:12 INFO CONSOLE   : NODEFONY Kernel Life Cycle Terminate CODE : 0
```
### Start Servers to check new Bundle hello:
```bash
$ ./nodefony -d dev

# TO STOP
$ <ctrl-c>
```

#### Now helleBundle is auto-insert in framework with watcher active and auto-config Webpack Module bundler

### watchers :

#### The bundle generation engine build bundle config with  node.js watcher configuration

#### In developement mode  is very usefull to auto-reload files as controllers , views , routing , translations

#### without having to reboot the server.

You can see helloBundle config   : vim  ./src/bundles/helloBundle/Resources/config/config.yml
```yml
########## nodefony CONFIG BUNDLE  helloBundle  ############
name :                          helloBundle
version:                        "1.0.0"
locale :                        en_en

#
#  WATCHERS
#
#    watchers Listen to changes, deletion, renaming of files and directories
#    of different components
#
#    For watch all components
#
#      watch:			true
#    or
#      watch:
#        controller:	true
#        config:        true		# only  routing.yml
#        views:         true
#        translations:  true
#        webpack:       true
#
watch:                          true
```
### Webpack Module bundler :

#### The bundle generation engine build bundle config with a predefined webpack configuration

#### In this way webpack is very usefull to manage all assets of bundle

#### In developement mode watch  is very usefull to auto-compile webpack module bundle

#### without having to reboot the server

You can see helloBundle config webpack : vim  ./src/bundles/helloBundle/Resources/config/webpack/webpack-dev.config.js
```js
const path = require("path");
const webpack = require('webpack');
const ExtractTextPluginCss = require('extract-text-webpack-plugin');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const public = path.resolve(__dirname, "..", ".." ,"public");
const commonConfig = require("./webpack.common.js");
const webpackDevClient = "webpack-dev-server/client?https://"+kernel.hostHttps+"/";

module.exports = webpackMerge( {
    entry       : {
      hello  : [ "./js/hello.js" ],
    },
    output      : {
      path      : public,
      filename  : "./assets/js/[name].js",
      library   : "[name]",
      libraryTarget: "umd"
    },
    devtool     : "source-map",
    externals   : {},
    resolve     : {},
    plugins     : []
}, commonConfig );
```

### <a name="start_prod"></a>Start Production Mode
```
# TO START NODEFONY IN CLUSTER NODE PM2
$ make start

# TO KILL PM2 DEAMON
$ make kill

# TO STOP APPLICATION WITHOUT KILL PM2 DEAMON
$ make stop
```
You can see PM2 config : vim  ./config/pm2.config.js

Access to bundle route with URL : http://localhost:5151/hello

## <a name="https"></a>Nodefony HTTPS Access
By default nodefony listen secure port in 5152

During the installation process all the openssl parts were generated ( self-signed localhost certificate ).

You must Add a Trusted CA in your browser : nodefony-root-ca.crt.pem

You can find certificate authority (ca) here:

```
./config/certificates/ca/nodefony-root-ca.crt.pem

```
Access  with URL : https://localhost:5152/hello

## <a name="monitoring"></a>Monitoring FRAMEWORK

Access to monitoring route with URL : http://localhost:5151/nodefony

[![MONITORING](https://raw.githubusercontent.com/nodefony/nodefony-core/master/doc/Beta/cluster.png)](https://nodefony.net/nodefony)

Monitoring in progress !!!

## <a name="references--thanks"></a>References / Thanks
#### NPM : *Will be automatically installed by Makefile*

```
┌──────────────────────────────┬──────────┬────────────────────────────────────────────────────────────────────────────────────────────────────┬────────────────────┐
│ NAME                         │ VERSION  │ DESCRIPTION                                                                                        │ BUNDLES            │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ asciify                      │ 1.3.5    │ Plain text awesomizer. A hybrid npm module and CLI for turning plain text into ascii art.          │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ async                        │ 2.5.0    │ Higher-order functions and common patterns for asynchronous code                                   │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ babel-cli                    │ 6.24.1   │ Babel command line.                                                                                │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ babel-loader                 │ 7.1.1    │ babel module loader for webpack                                                                    │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ babel-preset-es2015          │ 6.24.1   │ Babel preset for all es2015 plugins.                                                               │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ babel-preset-es2017          │ 6.24.1   │ Babel preset for all es2017 plugins.                                                               │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ babel-register               │ 6.24.1   │ babel require hook                                                                                 │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ bluebird                     │ 3.5.0    │ Full featured Promises/A+ implementation with exceptionally good performance                       │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ bootstrap                    │ 3.3.7    │ The most popular front-end framework for developing responsive, mobile first projects on the web.  │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ bootstrap-loader             │ 2.1.0    │ Boostrap for Webpack                                                                               │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ chai                         │ 4.1.0    │ BDD/TDD assertion library for node.js and the browser. Test framework agnostic.                    │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ cheerio                      │ 1.0.0-r… │ Tiny, fast, and elegant implementation of core jQuery designed specifically for the server         │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ chokidar                     │ 1.7.0    │ A neat wrapper around node.js fs.watch / fs.watchFile / fsevents.                                  │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ cli-color                    │ 1.2.0    │ Colors, formatting and other tools for the console                                                 │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ cli-table                    │ 0.3.1    │ Pretty unicode tables for the CLI                                                                  │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ clui                         │ 0.3.6    │ A Node.js toolkit for drawing nice command line tables, gauges, spinners, and sparklines.          │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ commander                    │ 2.11.0   │ the complete solution for node.js command-line programs                                            │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ connect                      │ 2.30.2   │ High performance middleware framework                                                              │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ cookie                       │ 0.3.1    │ HTTP server cookie parsing and serialization                                                       │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ core-js                      │ 2.4.1    │ Standard library                                                                                   │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ css-loader                   │ 0.28.4   │ css loader module for webpack                                                                      │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ elasticsearch                │ 13.2.0   │ The official low-level Elasticsearch client for Node.js and the browser.                           │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ extract-text-webpack-plugin  │ 3.0.0    │ Extract text from bundle into a file.                                                              │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ file-loader                  │ 0.11.2   │ file loader module for webpack                                                                     │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ font-awesome                 │ 4.7.0    │ The iconic font and CSS framework                                                                  │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ img-loader                   │ 2.0.0    │ Image minimizing loader for webpack                                                                │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ inquirer                     │ 3.2.0    │ A collection of common interactive command line user interfaces.                                   │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ jquery                       │ 3.2.1    │ JavaScript library for DOM operations                                                              │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ js-yaml                      │ 3.9.0    │ YAML 1.2 parser and serializer                                                                     │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ less                         │ 2.7.2    │ Leaner CSS                                                                                         │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ less-loader                  │ 4.0.5    │ Less loader for webpack. Compiles Less to CSS.                                                     │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ lodash                       │ 4.17.4   │ Lodash modular utilities.                                                                          │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ lodash.isregexp              │ 4.0.1    │ The lodash method `_.isRegExp` exported as a module.                                               │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ markdown-it                  │ 8.3.1    │ Markdown-it - modern pluggable markdown parser.                                                    │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ memcached                    │ 2.2.2    │ A fully featured Memcached API client, supporting both single and clustered Memcached servers thr… │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ mime                         │ 1.3.6    │ A comprehensive library for mime-type mapping                                                      │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ mkdirp                       │ 0.5.1    │ Recursively mkdir, like `mkdir -p`                                                                 │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ mocha                        │ 3.4.2    │ simple, flexible, fun test framework                                                               │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ mysql2                       │ 1.3.6    │ fast mysql driver. Implements core protocol, prepared statements, ssl and compression in native JS │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ node-emoji                   │ 1.7.0    │ simple emoji support for node.js projects                                                          │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ node-pre-gyp                 │ 0.6.36   │ Node.js native addon binary install tool                                                           │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ node-sass                    │ 4.5.3    │ Wrapper around libsass                                                                             │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ nodefony-stage               │ 0.1.0    │ Client Side Nodefony web developpement                                                             │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ npm                          │ 5.3.0    │ a package manager for JavaScript                                                                   │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ oauth2orize                  │ 1.8.0    │ OAuth 2.0 authorization server toolkit for Node.js.                                                │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ optimize-css-assets-webpack… │ 2.0.0    │ A Webpack plugin to optimize \ minimize CSS assets.                                                │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ passport                     │ 0.3.2    │ Simple, unobtrusive authentication for Node.js.                                                    │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ passport-github2             │ 0.1.10   │ GitHub authentication strategy for Passport.                                                       │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ passport-google-oauth        │ 1.0.0    │ Google (OAuth) authentication strategies for Passport.                                             │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ passport-google-oauth20      │ 1.0.0    │ Google (OAuth 2.0) authentication strategy for Passport.                                           │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ passport-http                │ 0.3.0    │ HTTP Basic and Digest authentication strategies for Passport.                                      │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ passport-ldapauth            │ 2.0.0    │ LDAP authentication strategy for Passport                                                          │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ passport-local               │ 1.0.0    │ Local username and password authentication strategy for Passport.                                  │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ passport-nodefony            │ 2.0.2    │ Passport strategy wrapper for nodefony framework                                                   │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ passport-oauth2              │ 1.4.0    │ OAuth 2.0 authentication strategy for Passport.                                                    │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ pm2                          │ 2.5.0    │ Production process manager for Node.JS applications with a built-in load balancer.                 │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ promise                      │ 8.0.1    │ Bare bones Promises/A+ implementation                                                              │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ qs                           │ 6.5.0    │ A querystring parser that supports nesting and arrays, with a depth limit                          │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ raw-loader                   │ 0.5.1    │ raw loader module for webpack                                                                      │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ request                      │ 2.81.0   │ Simplified HTTP request client.                                                                    │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ resolve-url-loader           │ 2.1.0    │ Webpack loader that resolves relative paths in url() statements based on the original source file  │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ rxjs                         │ 5.4.2    │ Reactive Extensions for modern JavaScript                                                          │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ sass-loader                  │ 6.0.6    │ Sass loader for webpack                                                                            │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ semver                       │ 5.3.0    │ The semantic version parser used by npm.                                                           │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ sequelize                    │ 4.3.2    │ Multi dialect ORM for Node.JS                                                                      │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ shelljs                      │ 0.7.8    │ Portable Unix shell commands for Node.js                                                           │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ shortid                      │ 2.2.8    │ Amazingly short non-sequential url-friendly unique id generator.                                   │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ simple-git                   │ 1.73.0   │ Simple GIT interface for node.js                                                                   │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ sqlite3                      │ 3.1.8    │ Asynchronous, non-blocking SQLite3 bindings                                                        │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ style-loader                 │ 0.18.2   │ style loader module for webpack                                                                    │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ twig                         │ 1.10.5   │ JS port of the Twig templating language.                                                           │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ uglify-es                    │ 3.0.25   │ JavaScript parser, mangler/compressor and beautifier toolkit for ES6+                              │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ uglifycss                    │ 0.0.27   │ Port of YUI CSS Compressor to NodeJS                                                               │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ url-loader                   │ 0.5.9    │ url loader module for webpack                                                                      │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ useragent                    │ 2.2.1    │ Fastest, most accurate & effecient user agent string parser, uses Browserscope's research for par… │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ webpack                      │ 3.3.0    │ Packs CommonJs/AMD modules for the browser. Allows to split your codebase into multiple bundles, … │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ webpack-merge                │ 4.1.0    │ Variant of merge that's useful for webpack configuration                                           │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ websocket                    │ 1.0.24   │ Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.    │ nodefony-core      │
├──────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ xml2js                       │ 0.4.17   │ Simple XML to JavaScript object converter.                                                         │ nodefony-core      │
└──────────────────────────────┴──────────┴────────────────────────────────────────────────────────────────────────────────────────────────────┴────────────────────┘
```

**Big thanks:**


**Related Links:**
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Framework Symfony](http://symfony.com/)
- [Twig.js](https://github.com/justjohn/twig.js/wiki)
- [PM2](https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md)
- [WEBPACK](https://webpack.js.org/)

More informations [Documentation](https://nodefony.net/documentation)

## <a name="authors"></a>Authors

- Christophe CAMENSULI  [github/ccamensuli](https://github.com/ccamensuli)

##  <a name="license"></a>License

[CeCILL-B](https://github.com/nodefony/nodefony/blob/master/LICENSE)

##  <a name="demo"></a>Demo

[Demo](https://nodefony.net)
