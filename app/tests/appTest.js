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
 *
 *
 */
const assert = require('assert');

describe("BUNDLE app", () => {
  beforeEach(() => {
    const requestClient = kernel.get("requestClient");
    const httpsServer = kernel.get("httpsServer");
    const certificats = httpsServer.getCertificats();
    const defaultOptions = {
      method: 'GET',
      timeout: 5000,
      agentOptions: {
        cert: certificats.cert,
        key: certificats.key,
        ca: certificats.ca
      }
    };
    const myurl = `https://${kernel.settings.system.domain}:${kernel.settings.system.httpsPort}`;
    global.request = requestClient.create(myurl, defaultOptions);
  });

  describe('ROUTE', () => {

    it("ROUTE  ", async () => {
      let options = {
        timeout: 1500
      };
      let result = await global.request.http("", options);
      assert.equal(result.json.statusCode, 200);
      assert.equal(result.json.headers.server, "nodefony");
    });

  });

});