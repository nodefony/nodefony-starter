/**
 *  NODEFONY APP CONFIG
 *
 *   @here You can OVERRIDE all Bundles Configurations
 */
const path = require("path");

module.exports = {
  locale: "en_en",
  App: {
    projectYear: 2019,
    locale: "en_en",
    authorName: "admin",
    authorMail: "admin@nodefony.com",
  },
  lang: {
    en_en: "english",
    fr_fr: "français"
  },
  /**
   *    WATCHERS
   *
   *  watchers Listen to changes, deletion, renaming of files and directories
   *  of different components
   *
   *  For watch all components
   *      watch:                    true
   *  or
   *      watch:{
   *        controller:             true
   *        config:                 true        // only  routing.yml
   *        views:                  true
   *        translations:           true
   *        webpack:                true
   *      }
   *
   */
  watch: false,

  /**
   *    OVERRIDE MONITORING BUNDLE
   *
   *    see MONITORING BUNDLE config for more options
   *
   */
  "monitoring-bundle": {
    debugBar: true,
    forceDebugBarProd: false,
    profiler: {
      active: false,
      storage: "orm"
    }
  },

  /**
   *    OVERRIDE FRAMEWORK Bundle
   *
   *    see FRAMEWORK BUNDLE config for more options
   *
   */
  "framework-bundle": {
    webpack: {
      cache: true,
      outputFileSystem: "file-system" // memory-fs not implemented yet
    },
    stats: {
      colors: true,
      verbose: true,
      maxModules: 16 // Infinity
    }
  },

  /**
   *  OVERRIDE MAIL Bundle
   *
   *   @see FRAMEWORK MAIL config for more options
   *     https://nodemailer.com
   *
   *   @examples :   gmail
   *    https://myaccount.google.com/security
   *
   *    nodemailer :{
   *      default : "gmail",
   *      transporters :{
   *        gmail : {
   *          host: "smtp.gmail.com",
   *          port: 465,
   *          secure: true, // true for 465, false for other ports
   *          auth: {
   *            user: "user@gmail.com",
   *            pass: "xxxxxxxxx"
   *          },
   *          tls: {
   *            // do not fail on invalid certs
   *            rejectUnauthorized: false
   *          }
   *        }
   *      }
   *    }
   */
  "mail-bundle": {
    nodemailer: {
      default: "free",
      transporters: {
        /*free: {
          host: "smtp.free.fr",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: "", // generated  user
            pass: "" // generated  password
          }
        }*/
      }
    }
  },

  /**
   *  OVERRIDE ORM SEQUELIZE BUNDLE
   *
   *       @see SEQUELIZE BUNDLE config for more options
   *       @more options http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html
   *
   *       Nodefony Database Management
   *        dialect :               'mysql'|'sqlite'|'postgres'|'mssql'
   *
   *       By default nodefony create  connector name nodefony ( driver sqlite )
   *       for manage Sessions / Users
   *
   *       For mysql/mariadb create database nodefony before
   *       Mysql > CREATE DATABASE nodefony;
   *
   *       Here create new databases connectors
   *       and use for sync connectors :
   *       nodefony sequelize:sync
   */
  "sequelize-bundle": {
    debug: false,
    connectors: {
      /*nodefony: {
        driver: "mysql",
        dbname: 'nodefony',
        username: 'nodefony',
        password: 'nodefony',
        options: {
          dialect: "mysql",
          host: "localhost",
          port: "3306",
          pool:{
            max: 5,
            min: 0,
            idle: 10000,
            acquire: 60000
          }
        }
      }*/
    }
  },

  /**
   *   OVERRIDE ORM BUNDLE MONGOOSE
   *
   *       @see MONGO BUNDLE config for more options
   *       @more options https://mongoosejs.com/docs/connections.html
   *
   *
   *       By default nodefony create  connector name nodefony
   *       for manage Sessions / Users
   */
  "mongoose-bundle": {
    debug: false,
    connectors: {
      nodefony: {
        host: "localhost",
        port: 27017,
        dbname: "nodefony",
        settings: {
          user: "",
          pass: "",
          authSource: "admin",
          reconnectTries: 100,
          reconnectInterval: 5000,
          autoReconnect: true,
          poolSize: 5
        }
      }
    }
  },

  /**
   *  OVERRIDE BUNDLE HTTP SETTINGS
   *
   *       see HTTP BUNDLE config for more options
   *
   *       query string parser
   *       form-data multipart parser
   *       upload
   *       statics files
   *       session
   *       http server
   *       https server
   *       upload
   *       websocket server
   *       websocket secure server
   *       sockjs dev server ( webpack dev server like WDS)
   *
   */
  "http-bundle": {
    // For more options request parser formidable @see : https://github.com/felixge/node-formidable
    request: {
      uploadDir: "/tmp", // temporing file upload system
      maxFileSize: 2097152, // In Bytes
      maxFieldsSize: 2097152, // 2MB
      maxFields: 1000, // 0 for unlimited
    },
    //For more options queryString parser QS @see : https://github.com/ljharb/qs
    queryString: {
      parameterLimit: 1000,
      delimiter: "&"
    },
    //Server @see :                https://nodejs.org/dist/latest-v8.x/docs/api/http.html*http_class_http_server
    http: {
      responseTimeout: 40000,
      headers: {
        "Cache-Control": "private, no-store, max-age=0, no-cache, must-revalidate"
      }
    },
    https: {
      responseTimeout: 40000,
      headers: {
        "Cache-Control": "private, no-store, max-age=0, no-cache, must-revalidate"
      }
    },
    http2: {
      enablePush: true
    },
    statics: {
      defaultOptions: {
        cacheControl: true,
        maxAge: 0
      },
      web: {
        path: "web",
        options: {
          maxAge: 0 //30*24*60*60*1000
        }
      }
    },
    session: {
      start: false, // false || true || Session Context Name (waf)
      name: "nodefony",
      handler: "orm", // files | orm | memcached
      //save_path: "./tmp/sessions", // for session.storage.files only
      use_strict_mode: true,
      gc_probability: 1,
      gc_divisor: 100,
      gc_maxlifetime: 1440,
      use_cookies: true,
      use_only_cookies: true,
      referer_check: false,
      cookie: {
        maxAge: 0, // like cookie_lifetime php  => secondes or ms style ('1d', "1h")
        secure: false, // Set true for https site only see https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Set-Cookie
        httpOnly: true
      },
      memcached: {
        servers: {
          nodefony: {
            location: "127.0.0.1",
            port: 11211,
            weight: 1
          }
        }
      }
    }
  },

  /**
   *    OVERRIDE REDIS BUNDLE SETTINGS
   *
   *   All Options :                https://github.com/NodeRedis/node_redis
   *
   *   Add clients connections
   *   connections :{
   *     data :{
   *       name: "data"
   *      },
   *     publish :{
   *       name: "publish"
   *      },
   *     subscribe :{
   *       name: "subscribe"
   *      }
   *    }
   */
  "redis-bundle": {
    redis: {
      debug: true,
      globalOptions: {
        host: "localhost",
        port: 6379,
        family: "IPv4",
        disable_resubscribing: false,
        tls: null,
        no_ready_check: false,
        socket_keepalive: false,
        return_buffers: false,
        retry_unfulfilled_commands: true
      },
      connections: {
        main: {
          name: "main"
        }
      }
    }
  },

  /**
   * OVERRIDE ELASTIC BUNDLE SETTINGS
   *   elasticsearch
   *
   *	 options  :  https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/configuration.html
   *
   */
  "elastic-bundle": {
    elasticsearch: {
      globalHostsOptions: {
        protocol: "http"
      },
      globalOptions: {
        ssl: {
          //key : path.resolve("config","certificates","server","privkey.pem"),
          //cert : path.resolve("config","certificates","server","cert.pem"),
          //ca : path.resolve("config","certificates","ca","nodefony-root-ca.crt.pem")
        }
      },
      connections: {
        main: {
          hosts: [{
            host: "localhost",
            port: 9200
          }],
          sniffOnStart: true,
          sniffInterval: 5000
        }
      }
    }
  },

  /**
   *  OVERRIDE SECURITY BUNDLE
   *
   *   HEADERS SECURITY
   *
   *    Content-Security-Policy
   *    Strict-Transport-Security
   *     ...
   *    Manage and Clean hsts in chrome
   *     chrome://net-internals/*hsts
   */
  "security-bundle": {
    headers: {
      http: {
        //"Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
        "X-Frame-Options": "SAMEORIGIN",
        "X-Content-Type-Options": "nosniff"
      },
      https: {
        //"Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
        "X-Frame-Options": "SAMEORIGIN",
        "X-Content-Type-Options": "nosniff"
      }
    }
  },

  /**
   *  OVERRIDE BUNDLE REALTIME
   *
   *       see REALTIME BUNDLE config for more options
   *       monitoring service realtime
   */
  "realtime-bundle": {
    services: {
      monitoring: {
        type: "tcp",
        port: 1318,
        domain: "0.0.0.0"
      }
    }
  }
};
