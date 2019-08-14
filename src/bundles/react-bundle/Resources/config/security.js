/**
 *   Firewall Config  service Security
 *
 *   // example cross domain
 *   firewalls   :{
 *      react_area:{
 *        pattern:                    /^\/react/,
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
    firewalls   :   {}
  }
};
