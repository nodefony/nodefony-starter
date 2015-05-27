# **NODEFONY FRAMEWORK**

## Realtime Bundle 
__Table of content__

- [Architecture](#architecture)
- [Protocol](#protocol)
- [Configuration](#configuration) 

## <a name="architecture"></a> Realtime Architecture

[![nodefony](https://raw.githubusercontent.com/ccamensuli/nodefony/master/src/nodefony/doc/RealTime/realtime.png)](https://github.com/ccamensuli/nodefony)

## <a name="protocol"></a> Realtime Protocol
 
The Realtime Service based on the [Bayeux](http://svn.cometd.org/trunk/bayeux/bayeux.html) protoco`

### Example flow JSON_RPC over BAYEUX over Websocket 
```json
{"channel":"/meta/connect","clientId":"VkWgDHd0V","connectionType":"WEBSOCKET"}

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
