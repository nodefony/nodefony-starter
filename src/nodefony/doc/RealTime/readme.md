# **NODEFONY FRAMEWORK**

## Realtime Bundle 
__Table of content__

- [Architecture](#architecture)
- [Protocol](#protocol)
- [Configuration](#configuration) 
- [Client Usage](#client) 

## <a name="architecture"></a> Realtime Architecture

[![nodefony](https://raw.githubusercontent.com/ccamensuli/nodefony/master/src/nodefony/doc/RealTime/realtime.png)](https://github.com/ccamensuli/nodefony) [![nodefony](https://raw.githubusercontent.com/ccamensuli/nodefony/master/src/nodefony/doc/RealTime/browserRealTime.png)](https://github.com/ccamensuli/nodefony)

## <a name="protocol"></a> Realtime Protocol
 
The Realtime Service based on the [Bayeux](http://svn.cometd.org/trunk/bayeux/bayeux.html) protocol

#### Example Flow service RANDOM :  JSON_RPC over BAYEUX over Websocket 
```json
{"channel":"/meta/connect","clientId":"Ey3uru0N","connectionType":"WEBSOCKET"}

{"version":"1.0","channel":"/meta/connect","successful":true,"error":"","clientId":"Ey3uru0N","timestamp":"2015-05-27T09:03:12.634Z","advice":{"reconnect":"retry"},"ext":{"address":"{\"remoteAddress\":\"nodefony.com\",\"host\":{\"protocol\":\"http:\",\"slashes\":true,\"auth\":null,\"host\":\"nodefony.com:5151\",\"port\":\"5151\",\"hostname\":\"nodefony.com\",\"hash\":null,\"search\":null,\"query\":null,\"pathname\":\"/\",\"path\":\"/\",\"href\":\"http://nodefony.com:5151/\"}}"},"data":{"monitoring":{"type":"tcp","port":1318,"domain":"nodefony.com"},"random":{"type":"tcp","port":1315,"domain":"nodefony.com"},"dmsg":{"type":"tcp","port":1316,"domain":"nodefony.com"}}}
{"version":"1.0","channel":"/service/random","data":"READY","clientId":"Ey3uru0N"}
{"version":"1.0","channel":"/service/random","data":"{\"jsonrpc\":\"2.0\",\"result\":68,\"error\":null,\"id\":null}","clientId":"Ey3uru0N"}
{"version":"1.0","channel":"/service/random","data":"{\"jsonrpc\":\"2.0\",\"result\":86,\"error\":null,\"id\":null}","clientId":"Ey3uru0N"}
{"version":"1.0","channel":"/service/random","data":"{\"jsonrpc\":\"2.0\",\"result\":26,\"error\":null,\"id\":null}","clientId":"Ey3uru0N"}	
{"version":"1.0","channel":"/service/random","data":"{\"jsonrpc\":\"2.0\",\"result\":28,\"error\":null,\"id\":null}","clientId":"Ey3uru0N"}	
{"version":"1.0","channel":"/service/random","data":"{\"jsonrpc\":\"2.0\",\"result\":53,\"error\":null,\"id\":null}","clientId":"Ey3uru0N"}	
{"version":"1.0","channel":"/service/random","data":"{\"jsonrpc\":\"2.0\",\"result\":31,\"error\":null,\"id\":null}","clientId":"Ey3uru0N"}	
{"version":"1.0","channel":"/service/random","data":"{\"jsonrpc\":\"2.0\",\"result\":28,\"error\":null,\"id\":null}","clientId":"Ey3uru0N"}	

```

## <a name="configuration"></a> Realtime Bundle Configuration
#### Example with 2 services random and dmsg :

```bash
#
#  NODEFONY FRAMEWORK 
#
#       REALTIME BUNDLE CONFIG
#
#
 system:
    reconnect:
      handshake:               	true
      connect:                  true

  services:
    random:
      type:                     tcp
      port:                     1315
      domain:                   nodefony.com
      
    dmsg:
      type:                     tcp
      port:                     1316
      domain:                   nodefony.com
```

## <a name="client"></a> Client Usage Javascript
#### See example in Bundle demo   route : /demo/realtime
```javascript

	<script type="text/javascript" src="/vendors/stage/stage.js"></script>
	<script type="text/javascript" src="/vendors/stage/function.js"></script>
	<script type="text/javascript" src="/vendors/stage/notificationsCenter.js"></script>
	<script type="text/javascript" src="/vendors/stage/syslog/syslog.js"></script>
	<script type="text/javascript" src="/vendors/stage/io/io.js"></script>
	<script type="text/javascript" src="/vendors/stage/crypto/base64.js"></script>
	<script type="text/javascript" src="/vendors/stage/crypto/md5.js"></script>
	<script type="text/javascript" src="/vendors/stage/io/authentication/mechanisms/digest-md5/digestMd5.js"></script>
	<script type="text/javascript" src="/vendors/stage/io/authentication/sasl/sasl.js"></script>
	<script type="text/javascript" src="/vendors/stage/io/transports/socket.js"></script>
	<script type="text/javascript" src="/vendors/stage/io/protocols/bayeux/bayeux.js"></script>
	<script type="text/javascript" src="/vendors/stage/io/realtime/realtime.js"></script>

	<script>

		var server = "/realtime"		
		var realtime = new stage.realtime(server ,{
			// fire when 401 http code :  need authenticate !! 
			onUnauthorized:function(authenticate, realtime){
			},
			// fire when authetification success or not need authenticate
			onAuthorized:function(authenticate, realtime){
				// subscribe to a service ramdom sub procole JSON-RPC
				realtime.subscribe(random, JSON.stringify({
					method:"start",
					params:[5000]
				}));
			},
			// fire when error
			onError:function(obj, status ,message){
				log("ERROR", message);
			},
			// fire when message service event
			onMessage:function(service, message){
				if (service === "random"){
					log("SUCCESS", message);	
				}
			},
			// fire when socket connection ready 
			onHandshake:function(socket){
				log("SUCCESS", "HANSHAKE OK");
			},
			// fire when  server is ready
			onConnect:function(message, realtime){
				log("SUCCESS", "CONNECT server  OK");
			},
			// fire when server Disconnect
			onDisconnect:function(){
				log("WARNING", "onDisconnect");
			},
			// fire when socket service close
			onClose:function(){
				log("WARNING", "onCLose");
			},
			// fire when service subcribed 
			onSubscribe:function(service, message, realtime){
				log("INFO", "SUBSCRIBE service : " + service);
			},
			// fire when service unsubcribed 
			onUnsubscribe:function(service, message){
				log("INFO", "UNSUBSCRIBE service : " + service);
			}
		});	

		realtime.start();
	</script>

```

