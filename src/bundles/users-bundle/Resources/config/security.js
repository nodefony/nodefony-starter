/**
 *   Firewall Config  service Security
 *
 *   // example cross domain
 *   firewalls   :{
 *      users_area:{
 *        pattern:                    /^\/users/,
 *        crossDomain:{
 *            "allow-origin":           "*",
 *            "Access-Control":{
 *              "Access-Control-Allow-Methods":         "GET, POST, PUT, DELETE, OPTIONS",
 *              "Access-Control-Allow-Headers":         "ETag, Authorization,  X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date",
 *              "Access-Control-Allow-Credentials":     true,
 *              "Access-Control-Expose-Headers":        "WWW-Authenticate ,X-Json",
 *              "Access-Control-Max-Age":               10
 *            }
 *        }
 *      }
 *    }
 **/

module.exports = {
  security:{
    /**
     *  FIREWALL  PROVIDER
     */
    providers: {
      anonymous: {
        anonymous: {
          provider: "anonymous"
        }
      },
      nodefony: {
        entity: {
          name: "user",
          property: "username"
        }
      }
    },
    encoders: {
      user: {
        algorithm: "bcrypt",
        saltRounds: 13
      }
    },

    /**
     *  FIREWALL  Authorization
     */
    access_control: [{
      path: /^\/nodefony/,
      roles: ["ROLE_MONITORING"],
      requires_channel: "https",
      allow_if: {
        roles: ["ROLE_ADMIN", "ROLE_USER"]
      }
    }],
    
    firewalls   :   {
      // SECURITY AREA MONITORING  <passport-local>
      nodefony_area: {
        pattern: /^\/nodefony/,
        provider: "nodefony",
        form_login: {
          login_path: "/login/nodefony",
          check_path: "/login/check",
          default_target_path: "/"
        },
        "passport-local": {
          usernameField: 'username',
          passwordField: 'passwd'
        },
        logout: "/logout",
        context: null,
        redirectHttps: true
      }
    }
  }
};
