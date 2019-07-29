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
const http = require("http");

describe("BUNDLE users", () => {

	describe('CORE', () => {

		beforeEach(() =>{});

		before( () => {});

		// EXAMPLE  NODEFONY
		it("NAMESPACE LOADED", (done) => {
			// check nodefony namespace
			assert.equal( typeof nodefony, "object" );
			// check instance kernel
			assert.equal( kernel instanceof nodefony.kernel, true)
			done();
		});
	});

	describe('ROUTE', () => {

		beforeEach( () => {});

		before( () =>{});

		it("ROUTE users ", (done) => {
			let options = {
				hostname: kernel.settings.system.domain,
				port: kernel.settings.system.httpPort,
				path: "/users",
				method: 'GET'
			};

			let request = http.request(options, (res) => {
				assert.equal(res.statusCode, 200);
				assert.equal(res.headers.server, "nodefony");
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					// check result here
				});
        res.on('end', () => {
          done();
        });
			})
			request.end();
		});

	});
});
