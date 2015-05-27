# **NODEFONY FRAMEWORK**

## Realtime Bundle 
__Table of content__

- [Architecture](#architecture)
- [Protocol](#protocol)
- [Configuration](#configuration) 

## <a name="architecture"></a> Realtime Architecture

[![nodefony](https://raw.githubusercontent.com/ccamensuli/nodefony/master/src/nodefony/doc/RealTime/realtime.png)](https://github.com/ccamensuli/nodefony)

## <a name="protocol"></a> Realtime Protocol
 
The Realtime Service based on the Bayeux  [Bayeux](http://svn.cometd.org/trunk/bayeux/bayeux.html) protocol


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
