<p align="center">
  <img src="https://github.com/nodefony/nodefony-core/raw/master/src/nodefony/bundles/framework-bundle/Resources/public/images/nodefony-logo.png"><br>
</p>
<h1 align="center">NODEFONY V4</h1>

[![Issues Status](https://img.shields.io/github/issues/nodefony/nodefony.svg)](https://github.com/nodefony/nodefony/issues) [![Build Status](https://travis-ci.org/nodefony/nodefony.svg?branch=master)](https://travis-ci.org/nodefony/nodefony) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/495/badge)](https://bestpractices.coreinfrastructure.org/projects/495)

Nodefony is Node.js full-stack web framework.  

Nodefony can be used to develop a complete solution to create a web application.

The Nodefony project is inspired by the PHP Symfony framework, a developer can find most of the concepts, configurations and patterns of Symfony framework.

Nodefony is not an exhaustive port of symfony !

## Table of content

-   [Features](#features)
-   [Requirements](#requirements)
-   [Install](#install)
-   [Start Development Mode](#start)
-   [Start Production Mode](#start_prod)
-   [Configurations](#configurations)
-   [Quick Start](#bundles)
-   [HTTPS Access](#https)
-   [References / Thanks](#references--thanks)
-   [Authors](#authors)
-   [License](#license)
-   [Demo](#demo)

## <a name="features"></a>Nodefony features :

-   Servers  ([http(s)](https://nodejs.org/dist/latest-v8.x/docs/api/https.html), [websocket(s)](https://github.com/theturtle32/WebSocket-Node), statics, sockjs)
-   [HTTP2](https://nodejs.org/api/http2.html)  http2 ready node module provides an implementation of the HTTP/2 (push server ready).
-   Dynamics routing
-   ORM ([Sequelize](http://docs.sequelizejs.com/), [mongoose](http://mongoosejs.com/index.html))
-   Simple Databases connection (mongo, ...)
-   MVC templating ([Twig](https://github.com/twigjs/twig.js))
-   Notion of real-time context in Action Controller (websocket).
-   Notion of synchronous or asynchronous execution in Action Controller (Promise).
-   Services Containers, Dependency Injection (Design Patterns)
-   Sessions Manager (ORM, memcached)
-   Authentication Manager (Digest, Basic, oAuth, Local, ldap, jwf)
-   WAF ( Web application firewall )
-   Cross-Origin Resource Sharing ([CORS](https://www.w3.org/TR/cors/))
-   Production Management ([PM2](https://github.com/Unitech/pm2/))
-   RealTime API ([Bayeux Protocol](http://autogrowsystems.github.io/faye-go/))
-   Webpack Assets management (Like WDS with HMR hot module Replacement)
-   C++ Addons (Binding in Bundle)
-   Translations
-   CLI (Command Line Interface)
-   Monitororing , Debug Bar
-   Unit Test Api in framework context ([MOCHA](https://mochajs.org/))

**Nodefony assimilates into the ecosystem of node.js with services like** :

-   [WEBPACK](https://webpack.js.org/) Module bundler for assets management of application .
-   [SockJS](https://github.com/sockjs) Server ( Like WDS 'Webpack Dev Server' and HMR management )
-   [WATCHER](https://nodejs.org/docs/latest/api/fs.html#fs_fs_watch_filename_options_listener) node.js for auto reload-files in developement mode .
-   [PM2](http://pm2.keymetrics.io/) Production Process Manager for Node.js .
-   [Passport](http://passportjs.org/) Simple, unobtrusive authentication for Node.js .
-   ~~[Angular](https://github.com/angular/angular-cli) Experimental Bundle Generator ( Angular cli no longer allows the ejection of a webpack config)~~
-   [React](https://github.com/facebookincubator/create-react-app) Experimental Bundle Generator ( Now an React Project can be merge into a Nodefony Bundle )
-   [Vue.js](https://vuejs.org) Experimental Bundle Generator ( Now an Vue.js Project can be merge into a Nodefony Bundle )

**Nodefony 4  adds the following features** :

-   C++ Addons (Binding in Bundle)
-   Authorisations
-   HTTP2
-   WEBPACK 4  


Now in this version  4 Beta,  Nodefony is evolved to a stable version without major fundamental changes.

Evolution priorities up to the stable version will focus on robustness, unit testing, documentation and security.

#### Nodefony is ported with ECMAScript 6 ( Class, Inheritance ).

You can follow Nodefony build on travis at **<https://travis-ci.org/nodefony/nodefony>**

## **Resources for Newcomers**

#### -  **[Nodefony Demo](https://nodefony.net)**

#### -  **[Nodefony Documentation](https://nodefony.net/documentation/default/nodefony)**

#### -  **[Nodefony Monitoring](https://nodefony.net/nodefony)**

#### Documentation in progress !!


## <a name="requirements"></a>Requirements

#### On your system _you must have Installed_ :

-   **[GIT](http://git-scm.com/)**  is Distributed version control system

-   **[Node.js](https://nodejs.org/)** ® is a Platform built on Chrome's JavaScript runtime ( >= 8 )

-   **[npm](https://www.npmjs.com/)** or **[yarn](https://yarnpkg.com/lang/en/)**  Packages Manager for javascript application

-   **[OpenSSL](https://www.openssl.org/)** Toolkit for the Transport Layer Security (TLS) and Secure Sockets Layer (SSL) protocols

-   **[GNU Bash](https://www.gnu.org/software/bash/)** Bash is the GNU Project's shell

#### Operating Systems : **[Install Node.js via Package](https://nodejs.org/en/download/package-manager)**

-   LINUX
    -   Debian, Ubuntu (Checked, Tested)
    -   RASPBIAN Raspberry Pi (Checked)

-   MACOS (Checked, Tested)

-   FreeBSD (Checked)
    -   pkg install bash rsync gmake gcc6
    -   setenv CC "/usr/local/bin/gcc"
    -   setenv CXX "/usr/local/bin/g++"
    -   cd /usr/local/bin/ ;ln -s pythonx.x python

-   ~~OpenBSD (Not Checked yet )~~

-   ~~WINDOWS (Not ported yet )~~

-   ~~[ELECTRON](https://github.com/nodefony/nodefony-electron) Experimental Nodefony Electron  ( Now an Electron Context can be use in Nodefony Project )~~

-   EMBEDDED SYSTEM ( Very difficult : large memory footprint )  

## <a name="install"></a>Install Nodefony Excutable Globaly

**Node.js Installation** :
 -   [nvm](https://github.com/creationix/nvm) Node Version Manager - Simple bash script to manage multiple active node.js versions 
 
  To install or update nvm, you can use the install script using cURL:

```sh
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

or Wget:

```sh
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

**Nodefony Install** :

```bash
npm -g install nodefony

# or with yarn

yarn global add nodefony
```

**likely error** : 

- EACCES error  [See Global install How to Prevent Permissions Errors](https://docs.npmjs.com/getting-started/fixing-npm-permissions) (Reinstall npm with a Node Version Manager)
- Different Node.js version (NODE_MODULE_VERSION XX) use 'nodefony rebuild'

## Generating with CLI (Command Line Interface) a Nodefony project :

 ```bash
 #  CLI generate project name : myproject

 $ nodefony create myproject
 $ cd myproject
 ```

**Cli Usage** :

```bash
$ nodefony -h
nodefony                                                                                              
    create [-i] name [path]                       Create New Nodefony Project                  
      
# OR YOU CAN USE CLI INTERACTIVE MODE (nodefony without args)

$ nodefony
 _   _    ___    ____    _____   _____    ___    _   _  __   __
| \ | |  / _ \  |  _ \  | ____| |  ___|  / _ \  | \ | | \ \ / /
|  \| | | | | | | | | | |  _|   | |_    | | | | |  \| |  \ V /
| |\  | | |_| | | |_| | | |___  |  _|   | |_| | | |\  |   | |  
|_| \_|  \___/  |____/  |_____| |_|      \___/  |_| \_|   |_|  

Version : 4.0.0-beta.5 Platform : darwin Process : nodefony PID : 16368

?  Nodefony CLI :  (Use arrow keys)
❯ Create Nodefony Project
  PM2 Tools
  --------
  Help
  Quit
```

## Build Project with Github Starter :

 ```bash
 #  Clone nodefony starter

 $ git clone https://github.com/nodefony/nodefony.git
 $ cd nodefony
 $ nodefony build
 ```
 **Cli Usage** :
 ```bash
 # OR YOU CAN USE CLI INTERACTIVE MODE TO BUILD PROJECT (nodefony without args)
 $ nodefony
              _   _    ___    ____    _____   _____    ___    _   _  __   __
             | \ | |  / _ \  |  _ \  | ____| |  ___|  / _ \  | \ | | \ \ / /
             |  \| | | | | | | | | | |  _|   | |_    | | | | |  \| |  \ V / 
             | |\  | | |_| | | |_| | | |___  |  _|   | |_| | | |\  |   | |  
             |_| \_|  \___/  |____/  |_____| |_|      \___/  |_| \_|   |_|  
                                                                            

          Version : 4.0.0-beta.6 Platform : darwin Process : nodefony PID : 51362
                
 Fri Sep 14 2018 14:46:14 INFO nodefony : WELCOME PROJECT : myproject 1.0.0
?  Nodefony CLI :  (Use arrow keys)
❯ Build Project 
  Generater 
  Tools 
  PM2 Tools 
  --------
  Help 
  Quit 
 ```
 
## <a name="start"></a>Serving a Nodefony project via an development server

**Starting Development Servers** :

```bash
$ nodefony dev

# TO STOP
$ <ctrl-c>
```
**Starting Development Servers in Debug Mode (-d)** :
```bash
$ nodefony -d dev

# TO STOP
$ <ctrl-c>
```

```bash
# OR YOU CAN USE CLI INTERACTIVE MODE (nodefony without args)
 _   _    ___    ____    _____   _____    ___    _   _  __   __
| \ | |  / _ \  |  _ \  | ____| |  ___|  / _ \  | \ | | \ \ / /
|  \| | | | | | | | | | |  _|   | |_    | | | | |  \| |  \ V /
| |\  | | |_| | | |_| | | |___  |  _|   | |_| | | |\  |   | |  
|_| \_|  \___/  |____/  |_____| |_|      \___/  |_| \_|   |_|  

Version : 4.0.0 Platform : linux  Process : nodefony PID : 31635

Fri Jul 27 2018 17:01:11 INFO nodefony : WELCOME PROJECT : myproject 1.0.0

?  Nodefony CLI :  
❯ Start Servers Development
  Start Servers Pre-Production
  Start Servers Production
  Install Project
  Rebuild Project
  Generater
  Tools
  PM2 Tools
  Run Test
  --------
  Help
  Quit
```

**Starting Development Servers in Inspector mode (--inspect)** :

[Nodejs Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started)
```bash
$ npm -g install npx

$ npx --node-arg=--inspect nodefony dev

# check chrome://inspect in your browser
```

## <a name="start_prod"></a>Serving a Nodefony Project via a Production server :

**Starting a Nodefony project with [PM2](http://pm2.keymetrics.io/)** :
```bash
$ nodefony prod
```
Tools PM2 You can see PM2 config : config/pm2.config.js
```bash
# To See log
$ nodefony logs

# To List Status of Production projects
$ nodefony list

# TO KILL PM2 DEAMON
$ nodefony kill

# TO STOP APPLICATION WITHOUT KILL PM2 DEAMON
$ nodefony stop
```

**Checking a Nodefony Project Pre-Production (Usefull to check Clusters Node)** :
```bash
$ nodefony preprod
```

## <a name="https"></a>Serving a Nodefony project with HTTPS

By default nodefony listen secure port in 5152 @see config/config.yml

During the installation process all the openssl parts were generated ( self-signed localhost certificate ).

You can Change default openssl configuration in :

    config/openssl

You must Add a Trusted CA in your Browser : projectName-root-ca.crt.pem
You can find certificate authority (ca) here:

    config/certificates/ca/projectName-root-ca.crt.pem

#### Access to Secure App with URL : <https://localhost:5152>
#### Access to App with URL : <http://localhost:5151>

[![nodefony](https://raw.githubusercontent.com/nodefony/nodefony-core/master/src/nodefony/bundles/documentation-bundle/Resources/public/images/nodefony.png)](https://nodefony.net)

## <a name="configurations"></a>Framework Configurations

Open **[config/config.yml](https://github.com/nodefony/nodefony-core/blob/master/config/config.yml)**  if you want change httpPort, domain ,servers, add bundle, locale ...

```yml
system:
  domain                        : localhost             # nodefony can listen only one domain ( no vhost )  /    [::1] for IPV6 only
  domainAlias:   # domainAlias string only <<regexp>>   example ".*\\.nodefony\\.com  ^nodefony\\.eu$ ^.*\\.nodefony\\.eu$"
    - "^127.0.0.1$"
  httpPort                      : 5151
  httpsPort                     : 5152
  domainCheck                   : true
  statics                       : true
  security                      : true
  realtime                      : true
  monitoring                    : true
  documentation                 : true
  unitTest                      : true
  demo                          : true
  locale                        : "en_en"
  servers:
    protocol                    : "2.0"             #  2.0 || 1.1
    http                        : true
    https                       : true
    ws                          : true
    wss			                    : true
    certificats:
      key                       : "config/certificates/server/privkey.pem"
      cert                      : "config/certificates/server/fullchain.pem"
      ca                        : "config/certificates/ca/projectName-root-ca.crt.pem"
      options:
        rejectUnauthorized      : true
  devServer:
    inline                      : true
    hot                         : false
    hotOnly                     : false
    overlay                     : true
    logLevel                    : info        # none, error, warning or info
    progress                    : false
    protocol                    : https
    websocket                   : true
  bundles:
    hello-bundle                : "file:src/bundles/hello-bundle"
```

## <a name="bundles"></a>Quick Start

### Install Nodefony  :
```
$ npm -g install nodefony
```
[See Global install How to Prevent Permissions Errors](https://docs.npmjs.com/getting-started/fixing-npm-permissions)

### Install Project  :
```
$ nodefony create myproject
$ cd myproject
```

### Generating a New Bundle  :

CLI Generate new bundle : default path src/bundles

```bash
$ nodefony generate:bundle name [path]

# Or Generate a New Bundle Interactive
$ nodefony

?  Nodefony CLI :  Generater
?  Nodefony CLI :  (Use arrow keys)
❯ Generate New Bundle
  Generate New Controller
  Generate New Service
  Generate New Entity
  Generate New Nodefony Project
  Generate Openssl Certificates
  Generate Haproxy Configuration
  Generate Nginx Configuration
  Generate letsEncrypt Webroot Configuration
  --------
  Quit
```

### Starting Servers to check new Bundle hello:

```bash
$ nodefony dev
```
Access to bundle route with URL : <http://localhost:5151/hello>

Access to bundle route with URL : <https://localhost:5152/hello>

#### Now hello-bundle is auto-insert in framework with watcher active and auto-config Webpack Module bundler

### Example controller  : src/bundles/hello-bundle/controller/defaultController.js

```js
module.exports = class defaultController extends nodefony.controller {
  constructor (container, context){
    super(container, context);
  }
  indexAction() {
    try {
      return this.render("hello-bundle::index.html.twig", {
        name: "hello-bundle"
      });
    } catch (e) {
      throw e;
    }
  }
};
```

### Example view  (twig) : src/bundles/hello-bundle/Resources/views/index.html.twig

```twig
{% extends '/app/Resources/views/base.html.twig' %}

{% block title %}Welcome {{name}}! {% endblock %}

{% block stylesheets %}
  {{ parent() }}
  <!-- WEBPACK BUNDLE -->
  <link rel='stylesheet' href='{{CDN("stylesheet")}}/hello-bundle/assets/css/hello.css' />
{% endblock %}

{% block body %}
      <img class='displayed' src='{{CDN("image")}}/framework-bundle/images/nodefony-logo-white.png'>
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
  <script src='{{CDN("javascript")}}/hello-bundle/assets/js/hello.js'></script>
{% endblock %}
```

### watchers :

#### The bundle generation engine build bundle config with  node.js watcher configuration

#### In developement mode  is very usefull to auto-reload files as controllers , views , routing , translations

#### without having to reboot the server.

You can see hello-bundle config   : src/bundles/hello-bundle/Resources/config/config.yml

```yml
########## nodefony CONFIG BUNDLE  hello-bundle  ############
name :                          hello-bundle
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

You can see hello-bundle config webpack : src/bundles/hello-bundle/Resources/config/webpack.config.js

```js
module.exports = webpackMerge({
  context: context,
  target: "web",
  entry       : {
    hello  : [ "./js/hello.js" ]
  },
  output: {
    path: public,
    publicPath: publicPath,
    filename: "./js/[name].js",
    library: "[name]",
    libraryTarget: "umd"
  },
  externals: {},
  resolve: {},
  module: {...}
});
```

## <a name="monitoring"></a>Monitoring FRAMEWORK

Access to monitoring route with URL : <http://localhost:5151/nodefony>

[![MONITORING](https://raw.githubusercontent.com/nodefony/nodefony-core/master/src/nodefony/doc/default/cluster.png)](https://nodefony.net/nodefony)

Monitoring in progress !!!

## Who Use Nodefony:

  [![SFR](https://raw.githubusercontent.com/nodefony/nodefony-core/master/tools/images/sfr.jpg)](https://www.sfr.fr)
  [![ALTICE](https://raw.githubusercontent.com/nodefony/nodefony-core/master/tools/images/logo.png)](https://www.sfr.fr)

## Big thanks:
  - [D-Lake](https://www.d-lake.fr/) French specialist in infrastructure and data security.

## Related Links:

-   [Node.js](https://nodejs.org/)
-   [npm](https://www.npmjs.com/)
-   [Framework Symfony](http://symfony.com/)
-   [Twig.js](https://github.com/justjohn/twig.js/wiki)
-   [PM2](https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md)
-   [WEBPACK](https://webpack.js.org/)

More informations  **[Nodefony Documentation](https://nodefony.net/documentation/default/nodefony)**

## <a name="authors"></a>Authors

-   Christophe CAMENSULI  [github/ccamensuli](https://github.com/ccamensuli)

## <a name="license"></a>License

[CeCILL-B](https://github.com/nodefony/nodefony/blob/master/LICENSE)

## <a name="demo"></a>Demo

[Demo](https://nodefony.net)
