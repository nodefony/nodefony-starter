# **NODEFONY  FRAMEWORK**  
[![Issues Status](https://img.shields.io/github/issues/nodefony/nodefony.svg)](https://github.com/nodefony/nodefony/issues) [![Build Status](https://travis-ci.org/nodefony/nodefony.svg?branch=master)](https://travis-ci.org/nodefony/nodefony) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/495/badge)](https://bestpractices.coreinfrastructure.org/projects/495)  [![bitHound Overall Score](https://www.bithound.io/github/nodefony/nodefony/badges/score.svg)](https://www.bithound.io/github/nodefony/nodefony)

Nodefony is Node.js full-stack web framework.  

Nodefony can be used to develop a complete solution to create a web application.

The Nodefony project is inspired by the PHP Symfony framework, a developer can find most of the concepts, configurations and patterns of Symfony framework.

Nodefony is not an exhaustive port of symfony !

Nodefony features :
- Servers  ([http(s)](https://nodejs.org/dist/latest-v8.x/docs/api/https.html), [websocket(s)](https://github.com/theturtle32/WebSocket-Node), statics, sockjs)
- [HTTP2](https://nodejs.org/api/http2.html)  http2 ready node module provides an implementation of the HTTP/2 (push server ready).
- Dynamics routing
- ORM ([Sequelize](http://docs.sequelizejs.com/), [mongoose](http://mongoosejs.com/index.html))
- Simple Databases connection (mongo, ...)
- MVC templating ([Twig](https://github.com/twigjs/twig.js))
- HMR hot module Replacement  (auto-reload controller views routing in developement mode)
- Notion of real-time context in Action Controller (websocket).
- Notion of synchronous or asynchronous execution in Action Controller (Promise).
- Services Containers, Dependency Injection (Design Patterns)
- Sessions Manager (ORM, memcached)
- Authentication Manager (Digest, Basic, oAuth, Local, ldap)
- Firewall ( Application Level )
- Cross-Origin Resource Sharing ([CORS](https://www.w3.org/TR/cors/))
- Production Management ([PM2](https://github.com/Unitech/pm2/))
- RealTime API ([Bayeux Protocol](http://autogrowsystems.github.io/faye-go/))
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
- [React](https://github.com/facebookincubator/create-react-app) Bundle Generator ( Now an React Project can be merge into a Nodefony Bundle )
- [SockJS](https://github.com/sockjs) Server ( Like WDS 'Webpack Dev Server' and HMR management )
- ~~[Electron](https://github.com/nodefony/nodefony-electron) Experimental Nodefony Electron  ( Now an Electron Context can be use in Nodefony Project  )~~

Now in this version  3 Beta,  Nodefony is evolved to a stable version without major fundamental changes.

Evolution priorities up to the stable version will focus on robustness, unit testing, documentation and security.

#### Now nodefony is ported with ECMAScript 6 ( Class, Inheritance ).

You can follow Nodefony build on travis at **[https://travis-ci.org/nodefony/nodefony](https://travis-ci.org/nodefony/nodefony)**

##  **Resources for Newcomers**

#### -  **[Nodefony Demo](https://nodefony.net)**  
#### -  **[Nodefony Documentation](https://nodefony.net/documentation/default/nodefony)**
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

-  **[npm](https://www.npmjs.com/)** or **[yarn](https://yarnpkg.com/lang/en/)**  Packages Manager for javascript application

   npm will be automatically installed by Node.js

#### Operating Systems : **[Install Node.js via Package](https://nodejs.org/en/download/package-manager)**

- LINUX
  - debian (Checked, Tested)
  - RASPBIAN Raspberry Pi (Checked)

- FreeBSD (Checked)
  - pkg install bash rsync gmake gcc6
  - setenv CC "/usr/local/bin/gcc"
  - setenv CXX "/usr/local/bin/g++"
  - cd /usr/local/bin/ ;ln -s pythonx.x python
  - replace make by gmake

- ~~OpenBSD (Not Checked yet )~~

- MACOS (Checked, Tested)

- ~~WINDOWS (Not ported yet )~~

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
    protocol                    : "2.0"             #  2.0 || 1.1
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

Mon Nov 20 2017 16:42:01 INFO SERVICE CLI KERNEL  : GENERATE bundle : helloBundle LOCATION : /Users/cci/repository/nodefony-core/src/bundles
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :helloBundle
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :controller
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :defaultController.js
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :Resources
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :config
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :config.yml
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :routing.js
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :security.yml
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :services.js
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :webpack.config.js
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :webpack
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :webpack.dev.config.js
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :webpack.prod.config.js
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :public
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :js
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :hello.js
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :css
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :hello.css
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :images
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :assets
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :js
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :css
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :fonts
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :images
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :translations
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :views
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :index.html.twig
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :tests
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :helloTest.js
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :Command
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :helloCommand.js
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :services
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :doc
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :default
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :readme.md
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :helloBundle.js
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :readme.md
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :src
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create Directory :Entity
 Mon Nov 20 2017 16:42:01 INFO GENERATER  : Create File      :package.json
┌─────────┬───────────────────┬────────────────────────────────────────────┬───────────┬────────────────┐
│ BUNDLES │ DESTINATION PATH  │ SOURCE PATH                                │ SIZE      │ ASSETS COMPILE │
├─────────┼───────────────────┼────────────────────────────────────────────┼───────────┼────────────────┤
│ hello   │ ./web/helloBundle │ ./src/bundles/helloBundle/Resources/public │ 483 bytes │ 0 bytes        │
└─────────┴───────────────────┴────────────────────────────────────────────┴───────────┴────────────────┘
 Mon Nov 20 2017 16:42:01 INFO KERNEL CONSOLE   : NODEFONY Kernel Life Cycle Terminate CODE : 0
```
### Start Servers to check new Bundle hello:
```bash
$ ./nodefony -d dev

# TO STOP
$ <ctrl-c>
```

#### Now helloBundle is auto-insert in framework with watcher active and auto-config Webpack Module bundler

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
#        config:        true		# only  routing
#        views:         true
#        translations:  true
#        webpack:       true
#        services:      true
#
watch:                          true
```
### Webpack Module bundler :

#### The bundle generation engine build bundle config with a predefined webpack configuration

#### In this way webpack is very usefull to manage all assets of bundle

#### In developement mode watch  is very usefull to auto-compile webpack module bundle

#### without having to reboot the server

You can see helloBundle config webpack : vim  ./src/bundles/helloBundle/Resources/config/webpack.config.js
```js
const path = require("path");
const public = path.resolve(__dirname, "..", "public");
const bundleName = path.basename(path.resolve(__dirname, "..", ".."));
const ExtractTextPluginCss = require('extract-text-webpack-plugin');
const webpackMerge = require('webpack-merge');
let config = null;
if (kernel.environment === "dev") {
  config = require("./webpack/webpack.dev.config.js");
} else {
  config = require("./webpack/webpack.prod.config.js");
}

module.exports = webpackMerge({
  context: public,
  target: "web",
  entry       : {
    hello  : [ "./js/hello.js" ]
  },
  output: {
    path: public,
    filename: "./assets/js/[name].js",
    library: "[name]",
    libraryTarget: "umd"
  },
  externals: {},
  resolve: {},
  module: {...}
});  
```

### Example controller  : ./src/bundles/helloBundle/controller/defaultController.js
```js
module.exports = class defaultController extends nodefony.controller {
  constructor (container, context){
    super(container, context);
  }
  indexAction() {
    try {
      return this.render("helloBundle::index.html.twig", {
        name: "helloBundle"
      });
    } catch (e) {
      throw e;
    }
  }
};
```

### Example view  (twig) : ./src/bundles/helloBundle/Resources/views/index.html.twig
```twig
{% extends '/app/Resources/views/base.html.twig' %}

{% block title %}Welcome {{name}}! {% endblock %}

{% block stylesheets %}
  {{ parent() }}
  <!-- WEBPACK BUNDLE -->
  <link rel='stylesheet' href='{{CDN("stylesheet")}}/helloBundle/assets/css/hello.css' />
{% endblock %}

{% block body %}
      <img class='displayed' src='{{CDN("image")}}/frameworkBundle/images/nodefony-logo-white.png'>
      <h1 class='success'>
        <a href='{{url('documentation')}}'>
          <strong style='font-size:45px'>NODEFONY</strong>
        </a>
        <p>{{trans('welcome')}} {{name}}</p>
      </h1>
{% endblock %}

{% block javascripts %}
  {{ parent() }}
  <!-- WEBPACK BUNDLE -->
  <script src='{{CDN("javascript")}}/helloBundle/assets/js/hello.js'></script>
{% endblock %}
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

[![MONITORING](https://raw.githubusercontent.com/nodefony/nodefony-core/master/doc/default/cluster.png)](https://nodefony.net/nodefony)

Monitoring in progress !!!

## <a name="references--thanks"></a>References / Thanks
#### NPM : *Will be automatically installed by Makefile*

```

```

**Big thanks:**


**Related Links:**
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Framework Symfony](http://symfony.com/)
- [Twig.js](https://github.com/justjohn/twig.js/wiki)
- [PM2](https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md)
- [WEBPACK](https://webpack.js.org/)

More informations  **[Nodefony Documentation](https://nodefony.net/documentation/default/nodefony)**

## <a name="authors"></a>Authors

- Christophe CAMENSULI  [github/ccamensuli](https://github.com/ccamensuli)

##  <a name="license"></a>License

[CeCILL-B](https://github.com/nodefony/nodefony/blob/master/LICENSE)

##  <a name="demo"></a>Demo

[Demo](https://nodefony.net)
