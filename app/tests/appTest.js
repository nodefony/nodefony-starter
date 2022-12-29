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
const https = require('node:https');

describe("BUNDLE APP", () => {
  beforeEach(() => {
    const fetchService = kernel.get("fetch");
    const httpsServer = kernel.get("httpsServer");
    const certificats = httpsServer.getCertificats();
    const httpsAgent = new https.Agent({
	      keepAlive: true,
        cert: certificats.cert,
        key: certificats.key,
        ca: certificats.ca
      });
    const defaultOptions = {
      method: 'GET',
      agent: httpsAgent
    };
    global.url = `https://${kernel.settings.system.domain}:${kernel.settings.system.httpsPort}`;
    global.fetch = fetchService.fetch
    global.options = defaultOptions
  });

  describe('REQUEST ', () => {
    it("FETCH REQUEST", async () => {
      let response = await global.fetch(`${global.url}`, global.options)
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("server"), "nodefony");
      let html = await response.text()
      assert(html);
    });
  });

});
