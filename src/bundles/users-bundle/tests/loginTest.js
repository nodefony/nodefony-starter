/*
 *   MODEFONY FRAMEWORK UNIT TEST
 *
 *   MOCHA STYLE
 *
 *   In the global context you can find :
 *
 *	nodefony : namespace to get library
 *	kernel :   instance of kernel who launch the test
 *
 */
const assert = require('assert');
const http = require('node:http');
const https = require('node:https');

describe("BUNDLE users", () => {

  before(() => {
    //for example
    assert.equal(typeof nodefony, "object");
    // check instance kernel
    assert.equal(typeof kernel, "object");
    const serviceHttps = kernel.get("httpsServer");
    const openssl = serviceHttps.getCertificats();
    global.baseUrl = `https://${kernel.settings.system.domain}:${kernel.settings.system.httpsPort}/api/jwt`;
    const request = kernel.get("fetch")
    global.fetch = request.fetch
    global.formData = request.library.FormData
    global.Headers = request.library.Headers
    const httpAgent = new http.Agent({
      keepAlive: true
    });
    const httpsAgent = new https.Agent({
      keepAlive: true,
      key: openssl.key,
      cert: openssl.cert,
      ca: openssl.ca,
    });
    global.options = {
      agent: function(_parsedURL) {
        if (_parsedURL.protocol == 'http:') {
          return httpAgent;
        } else {
          return httpsAgent;
        }
      }
    };
  });

  describe('API LOGIN', () => {
    beforeEach(() => {});
    before(() => {});

    it("LOGIN JWT", async () => {
      //const formData = new global.FormData()
      //formData.set('username', 'admin')
      //formData.set('passwd', 'admin')

      const meta = {
        //'Content-Type': 'application/json',
        //"Accept":"application/json"
      };
      const headers = new global.Headers(meta);
      const params = new URLSearchParams();
      params.append('username', "admin");
      params.append('passwd', "admin");
      //console.log(formData)
      let options = nodefony.extend({
        method: 'POST',
        headers: headers,
        body:params,
        /*body: JSON.stringify({
          username: "admin",
          passwd: "admin"
        })*/
      }, global.options)
      //console.log(formData)
      const url = `${global.baseUrl}/login`;
      //let url = "https://127.0.0.1:5152/api/jwt/login"
      let response = await global.fetch(url, options)
        .catch(e => {
          console.log(e)
          throw e;
        });
      const body = await response.json()
      assert(body.result);
      assert(body.result.token);
      global.token = body.result.token;
      assert(body.result.refreshToken);
      global.refreshToken = body.result.refreshToken;
      assert(body.result.decodedToken.data);
      assert.strictEqual(body.result.decodedToken.data.authenticated, true);
      assert(body.result.decodedToken.iat);
      assert(body.result.decodedToken.exp);
      assert.strictEqual(body.api, "login-api");
      assert.strictEqual(body.code, 200);
      assert.strictEqual(body.message, 'OK');
      assert.strictEqual(body.messageId, null);
      //assert.strictEqual(body.error, undefined);
      //assert.strictEqual(body.errorCode, undefined);
      assert.strictEqual(body.url, `${global.baseUrl}/login`);
      assert.strictEqual(body.method, 'POST');
      assert.strictEqual(body.scheme, 'https');
      assert.strictEqual(body.severity, 'INFO');
      assert.strictEqual(body.code, 200);
    })

    it("BAD PASSWD LOGIN  JWT ", async () => {
      const meta = {
        'Content-Type': 'application/json',
        "Accept":"application/json"
      };
      const headers = new global.Headers(meta);
      const url = `${global.baseUrl}/login`;
      let options = nodefony.extend({
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          username: "admin",
          passwd: "testfalse"
        })
      }, global.options)
      let response = await global.fetch(url, options)
        .catch(e => {
          console.log(e)
          throw e;
        });
      const body = await response.json()
      assert.strictEqual(body.code, 401);
      assert(body.error);
    });

    it("BAD NAME LOGIN JWT ", async () => {
      const meta = {
        'Content-Type':'application/json',
        "Accept":"application/json"
      };
      const headers = new global.Headers(meta);
      const url = `${global.baseUrl}/login`;
      let options = nodefony.extend({
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          username: "badname",
          passwd: "admin"
        })
      }, global.options)
      let response = await global.fetch(url, options)
        .catch(e => {
          console.log(e)
          throw e;
        });
      const body = await response.json()
      assert.strictEqual(body.code, 404);
      assert.strictEqual(body.error.message, "User : badname not Found");
    });

    it("BAD LOGIN NO credentials ", async () => {
      const meta = {
        'Content-Type':'application/json',
        "Accept":"application/json"
      };
      const headers = new global.Headers(meta);
      const url = `${global.baseUrl}/login`;
      let options = nodefony.extend({
        method: 'POST',
        headers: headers,
        body: JSON.stringify({

        })
      }, global.options)
      let response = await global.fetch(url, options)
        .catch(e => {
          console.log(e)
          throw e;
        });
      const body = await response.json()
      assert.strictEqual(body.code, 400);
      assert.strictEqual(body.error.message, "Missing credentials");
    });

  });

});
