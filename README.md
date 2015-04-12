# **NODEFONY FRAMEWORK**

###  **Framework Node.js Symfony Like** 


__Table of content__

- [Install](#install)
- [Start](#start) 
- [Configurations](#configurations) 
- [Command line Interface](#cli) 
- [Bundles](#bundles) 
- [Authors](#authors)
- [References / Thanks](#references--thanks)
- [License](#license)

## <a name="install"></a>Install

**node.js** :

```bash
$ git clone git@github.com:ccamensuli/nodefony.git

$ cd nodefony

$ make
```

## <a name="start"></a>start

Add host name "nodefony.com" in your /etc/hosts  :
```bash
$ sudo vim /etc/hosts

##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1       localhost nodefony.com 

```

Start the server :
```bash
$ ./nodefony_dev
```

Access to App with URL : http://nodefony.com:5151

[![nodefony](https://raw.githubusercontent.com/ccamensuli/nodefony/master/src/nodefony/doc/login.png)](https://github.com/ccamensuli/nodefony)


## <a name="cli"></a>Command Line Interface
```bash
$./console -h
              _   _    ___    ____    _____   _____    ___    _   _  __   __
             | \ | |  / _ \  |  _ \  | ____| |  ___|  / _ \  | \ | | \ \ / /
             |  \| | | | | | | | | | |  _|   | |_    | | | | |  \| |  \ V / 
             | |\  | | |_| | | |_| | | |___  |  _|   | |_| | | |\  |   | |  
             |_| \_|  \___/  |____/  |_____| |_|      \___/  |_| \_|   |_|  
                                                                            

		      CONSOLE Version : 1.0 PLATFORM : darwin  PROCESS PID : 21553

Usage: node console

  -h, --help     
  -v, --version  show version

Commands : [arguments]
framework
	generate:bundle nameBundle path                                  Generate a Bundle directory in path directory
	generate:controller  nameController path                         Generate a controller js file in bundle path
	generate:command nameCommand path                                Generate a command js file in bundle path
	generate:service nameService path                                Generate a service js file in bundle path
	npm:list                                                         List all installed packages 
	npm:install                                                      install all framework packages
	router:generate:routes                                           Generate all routes
	router:generate:route routeName                                  Generate one route
	router:match:url url                                             Get route who match url 
assetic
	assets:install                                                   Installs bundles web assets under a public web directory 
	less:render                                                      Less CSS compilateur 
	less:compile                                                     Less CSS compilateur 
	minification:compile [compilateur]                               Minificaton javascript compilateur : google / yahoo
security
	encoders:Digest firewall login password [realm]                  Generate encoding keys digest MD5
orm2
	ORM2:fixtures:load                                               Load data fixtures to your database
	ORM2:fixture:load bundleName:fixtureName                         Load a specific data fixture to your database
	ORM2:generate:entity connectionName entityName                   Generate an Entity
	ORM2:generate:bundleEntity bundleName:entityName                 Generate Bundle Entity
	ORM2:generate:entities                                           Generate All Entities
	ORM2:database:create                                             Create a database
	ORM2:entity:show                                                 show  Entities
	ORM2:connections:state                                           view  connections states
App
	server:run                                                       Run Application

```

## <a name="configurations"></a>Configurations

## <a name="bundles"></a>Bundles
Generate new bundle : 
```bash
              _   _    ___    ____    _____   _____    ___    _   _  __   __
             | \ | |  / _ \  |  _ \  | ____| |  ___|  / _ \  | \ | | \ \ / /
             |  \| | | | | | | | | | |  _|   | |_    | | | | |  \| |  \ V / 
             | |\  | | |_| | | |_| | | |___  |  _|   | |_| | | |\  |   | |  
             |_| \_|  \___/  |____/  |_____| |_|      \___/  |_| \_|   |_|  
                                                                            

		      CONSOLE Version : 1.0 PLATFORM : darwin  PROCESS PID : 21536

framework
	generate:bundle nameBundle path                                  Generate a Bundle directory in path directory

$ ./console generate:bundle myBundle src/bundles
```
More informations [wiki](https://github.com/ccamensuli/nodefony/wiki/Configurations) 
	 

## <a name="authors"></a>Authors

- Christophe CAMENSULI  [github/ccamensuli](https://github.com/ccamensuli)


## <a name="references--thanks"></a>References / Thanks

Big thanks 

**Related Links:**


##  <a name="license"></a>License

[CeCILL-B](https://github.com/ccamensuli/nodefony/blob/master/LICENSE)


