/**
 *
 *
 *	CONFIG BUNDLE  vault-bundle
 *
 * ===============================================================================
 *
 *  Copyright © 2022/2022        admin | admin@nodefony.com
 *
 * ===============================================================================
 *
 *
 */
let connect = {}
switch (kernel.appEnvironment.environment) {
  case "production":
  case "development":
  default:
    connect = {
      apiVersion: 'v1', // default
      endpoint: 'http://localhost:8200', // default
      token: 'hvs.PsM5RkqpM35LUkGFUdKXTJMv',
    }
}

module.exports = {
  type: "sandbox",
  locale: "en_en",

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
   *        controller:             true,
   *        config:                 true,        // only routing and services
   *        views:                  true,
   *        translations:           true,
   *        webpack:                true
   *      }
   *
   */
  watch: false,

  /**
   * DEV SERVER
   */
  devServer: {
    hot: false
  },

  /**
   *
   *	Insert here the bundle-specific configurations
   *
   *	You can also override config of another bundle
   *	with the name of the bundle
   *
   *	example : create an other database connector
   */
  vault: {
    connect: connect,
    getCredentialsApprole: kernel.appEnvironment.vault.getVaultCredentialsApprole,
    prepareAuth: kernel.appEnvironment.vault.prepareAuth,
    active: kernel.appEnvironment.vault.active,
    config: {
      mount: {
        path: "nodefony",
      },
      auths: {
        approle: {
          mountPoint: 'nodefony-auth',
          roleName: 'nodefony-role',
        }
      },
      policy: {
        name: 'nodefony-policy',
        rules: '{ "path": { "nodefony/data/*": { "policy": "write" } } }',
      },
      secrets: [{
        path: "nodefony/data/database/postgresql/connector/nodefony",
        data: {
          username: "postgres",
          password: "nodefony"
        }
      }, {
        path: "nodefony/data/database/mongo/connector/nodefony",
        data: {
          user: "nodefony",
          pass: "nodefony"
        }
      }, {
        path: "nodefony/data/database/mysql/connector/nodefony",
        data: {
          username: "mysql",
          password: "nodefony"
        }
      }]
    }
  }
}
