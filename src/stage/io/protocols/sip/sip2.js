


stage.register.call(stage.io.protocols, "sip",function(){



	/*
 	 *
 	 * CLASS  SDP
 	 *
 	 *
 	 *
 	 */
	var parserSdp = function(body){
		if ( ! body ){
			throw new Error("SDP parser no data found !! ") ;
		}
		//this.line = body.split("\n");
		//this.nbLines = this.line.length ;
		//this.size = body.length ;
		this.raw = body ;
		this.blocks = [];
		this.sessionBlock = null;
		this.audioBlock = null;
		this.videoBlock = null;
		this.detectBlocks();
		this.parseBlocks();
			
	};
	parserSdp.prototype.detectBlocks = function(){
		
		var line = this.raw.split("\n");
		var nbLines = line.length ;
		var first = 0 ;
		var m = null ;
		for (var i = 0 ; i< nbLines ; i++){
			var res = line[i].split("=");
			var key = res[0].replace(/ |\n|\r/g,"") ;
			var value = res[1] ;
			switch(key){
				case "m":
					if (first == 0 ){
						var data = line.slice(first, i);
						var size = data.length ;
					}else{
						var data = line.slice(first+1, i);
						var size = data.length ;
					}
					var parseM = this.parseMline(m) ;
					if ( parseM ){
						var media = parseM ;	
						var type = parseM.media ;
					}else{
						var media = null ;
						var type = "session" ;
					}
					this.blocks.push({
						type		: type,
						direction	: null,
						//start		: first,
						//end		: i,
						data		: data,
						//size		: size,
						media		: media,
						information	: "",
						attributes	: [],
						bandwidths	: [],
						candidates	: [],
						connection	: null,
						encryption	: null
					});
					first = i ;
					m = value ; 	
				break;
			}
		}	
		var data = line.slice(first+1, nbLines) ;
		var size = data.length ;
		var parseM = this.parseMline(m) ;
		if ( parseM ){
			var media = parseM ;
			var type = parseM.media ;	
		}else{
			var media = null ;
			var type = "session" ;
		}
		this.blocks.push({
			type		: type,
			direction	: null,
			//start		: first,
			//end		: nbLines,
			data		: data,
			//size		: size,
			media		: media,
			information	: "",
			attributes	: [],
			bandwidths	: [],
			candidates	: [],
			connection	: null,
			encryption	: null
		});
	}

	
	var defaultAparser = function(value, block){
		if ( value )
			return value ;
		return null ;
	};

	var rtpmapParser = function(value, block){
		 //a=rtpmap:<payload type> <encoding name>/<clock rate>[/<encoding parameters>]
		if ( value ){
			var obj = {
				payloadType		: null,
				encodingName		: null,
				clockRate		: null,
				encodingParameters	: null,
				raw			: value
			}
			var res = value.split(" ");
			for (var i = 0 ; i< res.length ; i++){
				switch (i){
					case 0 :
						obj.payloadType = res[i] ;
					break;
					case 1 :
						var ret = res[i].split("/");
						obj.encodingName = ret[0] ;
						if (ret[1]){
							obj.clockRate = ret[1];	
						}
						if (ret[2]){
							obj.encodingParameters = ret[2] ;
						}
					break;
				}
			}
			
			if ( ! ( obj.encodingName in block.rtpmap ) ){
				var index = block.rtpmap.push(obj) ;
				block.rtpmap["rtpmap_"+obj.payloadType] = block.rtpmap[index-1] ;
			}
			return obj ;
		}
		return null;
	};

	var candidateParser = function(value, block){
		/* a=candidate:0 1 UDP 2122252543 169.254.105.57 65488 typ host	
		 * a=candidate:6glsxoSzDfHGkyMz 1 UDP 2130706431 93.20.94.1 35796 typ host
		 * a=candidate:2 1 UDP 1694498815 192.0.2.3 45664 typ srflx raddr 10.0.1.1 rport 8998
		 * a=candidate:86628240 1 udp 2122260223 192.168.10.234 64435 typ host generation 0 network-id 3
		 * 
		 * 
 		 * 
 		 *
		 *   candidate-attribute   = "candidate" ":" 
		 *	   foundation SP 
		 *	   component-id SP
                 *         transport SP
                 *         priority SP
                 *         connection-address SP     ;from RFC 4566
                 *         port         ;port from RFC 4566 SP 
                 *         cand-type     
                 *          [SP rel-addr]
                 *          [SP rel-port]
                 *          *(SP extension-att-name SP
                 *               extension-att-value)
                 */               
		if ( value ){
			
			var obj = {
				foundation		: null,
				componentId		: null,
				transport		: null,
				transportExt		: null,
				priority		: null,
				connectionAddress	: null,
				port			: null,
				candidateType		: null,
				remoteAddr		: null,
				remotePort		: null,
				generation		: null,
				networkId		: null,
				raw			: value
			}
			var res = value.split(" ");
			for (var i = 0 ; i< res.length ; i++){
				switch (i){
					case 0 :
						obj.foundation = res[i] ;
					break;
					case 1 :
						obj.componentId = res[i] ;
					break;
					case 2 :
						obj.transport = res[i] ;
						var ret = res[i].split("/");
						obj.transport = ret[0] ;
						if (ret[1]){
							obj.transportExt = ret[1];	
						}
					break;
					case 3 :
						obj.priority = res[i] ;
					break;
					case 4 :
						obj.connectionAddress = res[i] ;
					break;
					case 5 :
						obj.port = res[i] ;
					break;
					default :
						switch ( res[i] ){
							case "typ" :
								obj.candidateType = res[i+1] ;	
							break ;
							case "raddr" :
								obj.remoteAddr = res[i+1] ;
							break ;
							case "rport" :
								obj.remotePort = res[i+1] ;
							break ;
							case "generation" :
								obj.generation = res[i+1] ;
							break ;
							case "network-id" :
								obj.networkId = res[i+1] ;
							break ;
						}
					break;	
				}
			}
			block.candidates.push(obj)
			return value ;
		}
		return null;
	}

	var aAttribute = {
		"cat"		: defaultAparser,
		"keywds"	: defaultAparser,
		"tool"		: defaultAparser,
		"ptime"		: defaultAparser,
		"maxptime"	: defaultAparser,
		"rtpmap"	: rtpmapParser,
		"orient"	: defaultAparser,
		"type"		: defaultAparser,
		"charset"	: defaultAparser,
		"sdplang"	: defaultAparser,
		"lang"		: defaultAparser,
		"framerate"	: defaultAparser,
		"quality"	: defaultAparser,
		"fmtp"		: defaultAparser,
		"candidate"	: candidateParser	
	}
	
	var aAttributeDirection = {
		"recvonly"	: defaultAparser,
		"sendrecv"	: defaultAparser,
		"sendonly"	: defaultAparser,
		"inactive"	: defaultAparser
	}

	parserSdp.prototype.parseMline = function(data){
		// RFC https://tools.ietf.org/html/rfc4566#section-5.14
		//=<media> <port>/<number of ports> <proto> <fmt> ...
		if ( data ){
			var obj = {
				media	: "",
				port	: "",
				nbPort	: 0,
				proto	: "",
				fmt	: [],
				raw	: data
			}
			var res = data.split(" ");
			for (var i = 0 ; i< res.length ; i++){
				switch (i){
					case 0 :
						obj.media = res[i] ;
					break;
					case 1 :
						var ret = res[i].split("/");
						obj.port = ret[0] ;
						if (ret[1]){
							obj.nbPort = ret[1];	
						}else{
							obj.nbPort = 1;
						}
					break;
					case 2 :
						obj.proto = res[i] ;
					break;
					default:
						obj.fmt.push(res[i])		
				}
			}
			return obj ;
		}
		return null;
	}

	parserSdp.prototype.parseAline = function(data, block){
		//a=<attribute>:<value>
		var obj = {};
		if (  ! data ){
			return obj ;
		}
		var res = data.split(":");
		var attribute = res[0].replace(/ |\n|\r/g,"");
		var value = res[1] ;
		if (  aAttribute[attribute] ){
			obj[attribute] = aAttribute[attribute](value, block);
		}else{
			switch (attribute){
				case "setup":
					obj[attribute] = value;	
					block["setup"] = value;
				break;
				default:
					if (  aAttributeDirection[attribute] ){
						var ele = aAttributeDirection[attribute](attribute, block); 
						obj[attribute] = ele;	
						block.direction = ele ; 
					}else{
						obj[attribute] = value ;
					}
			}
		}
		return obj ;
	}

	parserSdp.prototype.parseCline = function(data){
		//c=<nettype> <addrtype> <connection-address>
		if ( data ){
			var obj = {
				nettype		: null,
				addrtype	: null,
				address		: null,
				raw		: data
			}
			var res = data.split(" ");
			for (var i = 0 ; i< res.length ; i++){
				switch (i){
					case 0 :
						obj.nettype = res[i] ;
					break;
					case 1 :
						obj.addrtype = res[i] ;
						
					break;
					case 2 :
						obj.address = res[i] ;
					break;
				}
			}
			return obj ;
		}
		return null;
	}

	parserSdp.prototype.parseOline = function(data){
		//o=<username> <sess-id> <sess-version> <nettype> <addrtype> <unicast-address>
		if ( data ){
			var obj = {
				username		: null,
				sessId			: null,
				sessVersion		: null,
				nettype			: null,
				addrtype		: null,
				unicastAddr		: null,
				raw			: data
			}
			var res = data.split(" ");
			for (var i = 0 ; i< res.length ; i++){
				switch (i){
					case 0 :
						obj.username = res[i] ;
					break;
					case 1 :
						obj.sessId = res[i] ;
					break;
					case 2 :
						obj.sessVersion = res[i] ;
					break;
					case 3 :
						obj.nettype = res[i] ;
					break;
					case 4 :
						obj.addrtype = res[i] ;
					break;
					case 5 :
						obj.unicastAddr = res[i] ;
					break;
				}
			}
			return obj ;
		}
		return null;
	}

	/*
 	 *	TIME DESCRIPTION
 	 */
	parserSdp.prototype.parseTline = function(data){
		//t=<start-time> <stop-time>
		if ( data ){
			var obj = {
				start		: null,
				stop		: null,
				raw		: data
			}
			var res = data.split(" ");
			for (var i = 0 ; i< res.length ; i++){
				switch (i){
					case 0 :
						obj.start = res[i] ;
					break;
					case 1 :
						obj.stop = res[i] ;
					break;
				}
			}
			return obj ;
		}
		return null;
	}

	parserSdp.prototype.parseRline = function(data){
		//r=<repeat interval> <active duration> <offsets from start-time>
		if ( data ){
			var obj = {
				interval	: null,
				duration	: null,
				offsets		: null,
				raw		: data
			}
			var res = data.split(" ");
			for (var i = 0 ; i< res.length ; i++){
				switch (i){
					case 0 :
						obj.interval = res[i] ;
					break;
					case 1 :
						obj.duration = res[i] ;
					break;
					case 2 :
						obj.offsets = res[i] ;
					break;
				}
			}
			return obj ;
		}
		return null;
	}

	/** BLOCK MEDIA
 	 *    Media description, if present
	 *  m=  (media name and transport address)
	 *  i= (media title)
	 *  c= (connection information -- optional if included at
	 *     session level)
	 *  b= (zero or more bandwidth information lines)
	 *  k= (encryption key)
	 *  a= (zero or more media attribute lines)
	 */
	parserSdp.prototype.blockMediaParser = function( block ){
		block["rtpmap"] = [] ;
		for (var j = 0 ; j < block.data.length ; j++){ 
			var res = block.data[j].split("=");
			var key = res[0].replace(/ |\n|\r/g,"") ;
			var value = res[1] ;	
			switch(key){
				case "a" :
					block.attributes.push( this.parseAline(value, block ) ) ;
				break;
				case "c":
					block.connection = this.parseCline(value) ;
				break;
				case "i" :
					block.information = value ;
				break;
				case "b" :
					block.bandwidths.push(value);
				break;
				case "k" :
					block.encryption = value ;
				break;
			}
		}
		return block ;
	}

	/*  BLOCK SESSION
 	 *    session description
         *  v=  (protocol version)
         *  o=  (originator and session identifier)
         *  s=  (session name)
         *  i= (session information)
         *  u= (URI of description)
         *  e= (email address)
         *  p= (phone number)
         *  c= (connection information -- not required if included in
         *     all media)
         *  b= (zero or more bandwidth information lines)
         *     One or more time descriptions ("t=" and "r=" lines; see below)
         *  z= (time zone adjustments)
         *  k= (encryption key)
         *  a= (zero or more session attribute lines)
         *     Zero or more media descriptions
	 */
	parserSdp.prototype.blockSessionParser = function(block){
		block["protocol"] = null ;
		block["originator"] = null ;
		block["timeZone"] = null ;
		block["sessionName"] = null ;
		block["originator"] = null ;
		block["protocol"] = null ;
		block["uri"] = null ;
		block["phoneNumber"] = null ;
		block["email"] = null ;
		block["timeDescription"] = null;
		block["timeRepeat"] = null;

		for (var j = 0 ; j < block.data.length ; j++){ 
			var res = block.data[j].split("=");
			var key = res[0].replace(/ |\n|\r/g,"") ;
			var value = res[1] ;	
			switch(key){
				case "v" :
					block.protocol = value ;
				break;
				case "o" :
					block.originator = this.parseOline( value ) ;
				break;
				case "s" :
					block.sessionName = value ;
				break;
				case "u" :
					block.uri = value ;
				break;
				case "e" :
					block.email = value ;
				break;
				case "p" :
					block.phoneNumber = value ;
				break;
				case "z" :
					block.timeZone = value ;
				break;
				case "a" :
					block.attributes.push( this.parseAline(value, block) ) ;
				break;
				case "c":
					block.connection = this.parseCline(value) ;
				break;
				case "i" :
					block.information = value ;
				break;
				case "b" :
					block.bandwidths.push(value);
				break;
				case "k" :
					block.encryption = value ;
				break;
				// TIME DESCRIPTION
				case "t" :
					block.timeDescription = this.parseTline(value);
				break ;
				case "r" :
					block.timeRepeat = this.parseRline(value);
				break ;
			}
		}
		return block ;
	}

	parserSdp.prototype.parseBlocks = function(){
		for (var i = 0 ; i< this.blocks.length ; i++){
			switch( this.blocks[i].type ){
				case "session" :
					this.sessionBlock = this.blockSessionParser( this.blocks[i] );
				break;
				case "audio" :
					this.audioBlock = this.blockMediaParser( this.blocks[i] );
				break;
				case "video" :
					this.videoBlock = this.blockMediaParser( this.blocks[i] );
				break;
			}
		}
	}

	/*
 	 *
 	 *	DIGEST authenticate
 	 *
 	 *
 	 */
	var stringify = function(value){
		return '"'+value+'"';
	}

	var reg =/^([^=]+)=(.+)$/;
	var parserAuthenticate = function(str){
		var ret = str.replace(/"/g,"");
		ret = ret.replace(/Digest /g,"");
		var head = ret.split(",");
		var obj = []
		for (var i= 0 ; i < head.length ; i++){
			var res = reg.exec(head[i]);
			var key = res[1].replace(/ |\n|\r/g,"");
			if (res && key)
				obj[key] = res[2]
		}	
		return obj
	};

	var MD5 = stage.crypto.md5.hex_md5_noUTF8 ;
	var BASE64 = stage.crypto.base64.encode ;

	var digest = {
		generateA1:function(username, realm, password, nonce, cnonce){
			if (cnonce)
				var A1 = username + ":" + realm + ":" + password + ":" + nonce+ ":" + cnonce ;
			else
				var A1 = username + ":" + realm + ":" + password ;//+ ":" + nonce ;
			//console.log(A1)
			return MD5(A1); 
		},

		generateA2:function(method, uri, entity_body, qop){
			var A2 = "";
			if( ! qop || qop ===  "auth"){
				A2 = method +":" + uri ;
			} else if(qop === "auth-int"){
				if( entity_body ){
					var entity = auth.MD5(entity_body);
					A2 = method + ":" + uri + ":" + entity ; 
				}else{
					A2 = method + ":" + uri + ":" + "d41d8cd98f00b204e9800998ecf8427e" ;
				}
			}
			//console.log(A2)
			return MD5(A2);
		},
		generateResponse:function(A1, nonce, noncecount, cnonce, qop, A2){
			var res = ""
			if(qop === "auth" || qop === "auth-int"){
				res = A1 + ":" + nonce +":" + noncecount +":" + cnonce +":" + qop + ":" + A2 ;
			}else{
				res = A1 + ":" + nonce + ":" + A2 ;
			}
			//console.log(res)
			return MD5(res);
		}		
	};

	var authenticate = function(dialog, username, password){
		
		this.dialog = dialog ;
		this.userName = username ;
		this.password = password;
		this.uri = "sip:" +this.dialog.sip.server ;	
		this.realm = "nodefony.com";
		this.nonce = null;
		this.cnonce =null;
		this.nonceCount = null;
		this.qop =null;
		this.algorithm = null;
		this.entity_body = null;
	};

	authenticate.prototype.register = function(message, type){
		/*if (transaction.sended){
			console.log("WWW-Authenticate error")
			return ;
		}*/	
		//console.log("AUTH REGISTER")
		//console.log(message);
		var head = message.authenticate ;	
		this.realm = head.realm	
		this.nonce = head.nonce;
		this.cnonce = head.cnonce;
		this.qop = head.qop;
		this.algorithm = head.Digestalgorithm ? head.Digestalgorithm : "md5" ;	
		if ( message.rawBody )
			this.entity_body = message.rawBody;

		switch (this.algorithm.toLowerCase()){
			case "md5" :
				this.response = this.digestMD5(message.method);
			break;
		}

		if ( ! type ){
			var method = "Authorization: ";
		}else{
			if ( type === "proxy"){
				var method = "Proxy-Authorization: ";
			}else{
				var method = "Authorization: ";	
			}
		}
		var line = "Digest username=" +stringify(this.userName)+", realm="+stringify(this.realm)+ ", nonce=" + stringify(this.nonce) +", uri="+stringify(this.uri)+", algorithm="+this.algorithm+", response="+stringify(this.response);
		this.lineResponse = method + line ; 

		//var transac = message.transaction ;
		var transac = this.dialog.createTransaction(message.transaction.to);
		this.dialog.tagTo = null ;	
		//this.dialog.sip.fire("onInitCall", this.dialog.toName, this.dialog, transac);
		var request = transac.createRequest(this.dialog.body, this.dialog.bodyType);
		request.header.response=this.lineResponse;
		request.send();
		return transac ;

	};
	
	authenticate.prototype.digestMD5 = function(method){
		var A1 = digest.generateA1(this.userName, this.realm, this.password, this.nonce, this.cnonce );
		var A2 = digest.generateA2(method, this.uri, this.entity_body, this.qop );
		return  digest.generateResponse(A1, this.nonce, this.nonceCount, this.cnonce, this.qop, A2);
	};


	/*
 	 *
 	 * CLASS PARSER HEADER SIP
 	 *
 	 *
 	 */
	var regHeaders = {
		line:/\r\n|\r|\n/,
		headName:/: */,
		Allow:/, */,
		Via:/; */,
		CallId:/^(.*)@.*$/,
		algorithm:/= */,
		fromTo:/<sip:(.*)@(.*)>/,
		fromToG:/(.*)?<sip:(.*)@(.*)>/
	};

	var parsefromTo = function(type, value){
		var sp = value.split(";");
		this.message[type+"Tag"] = null;
		var res = sp.shift();
		var res2 = regHeaders.fromTo.exec(res);
		//console.log(regHeaders.fromToG.exec(res))
		//console.log(res2)
		this.message[type+"Name"] = (res2.length > 2)  ? res2[1].replace(/ |\n|\r/g,"").replace(/"/g,"") : "" ;
 	        this.message[type] =  res2[1].replace(" ","") +"@"+ res2[2].replace(/ |\n|\r/g,"") ;
		var ret = regHeaders.fromToG.exec(res) ;	
		if ( ret && ret[1] ){
			var displayName =  ret[1].replace(/"/g,"")  ;
			//this.message[type+"Name"] = displayName ;
			this.message[type+"NameDisplay"] = displayName ;
			//console.log(displayName)
		}

		for (var i = 0 ; i < sp.length ;i++){
			var res3 = sp[i].split("=");
			if(res3[0].replace(/ |\n|\r/g,"") === "tag")
				this.message[type+"Tag"] = res3[1] ;
			else
				this.message[res3[0]] = res3[1] ;
		}
		return value;
	};

	var headerSip = function(message, header){
		this.rawHeader = {} ;
		this.message = message; 
		this.method = null; 
		this.firstLine = null;
		this.branch = null ;
		this.Via = [];
		this.routes = [];
		this.recordRoutes = [];
		if (header && typeof header === "string"){
			try {
				this.parse(header);
			}catch(e){
				console.log(e);
				throw new Error("PARSE ERROR MESSAGE SIP", 500);
			}
		}
	};

	headerSip.prototype.parse = function(header){
		var tab = header.split(regHeaders.line);
		var type = tab.shift();
		this.firstLine = type.split(" ");
		$.each(tab, function(index, ele){
			var res = regHeaders.headName.exec(ele);
			var size = res[0].length;
			var headName = res.input.substr(0,res.index);
			var headValue = res.input.substr(res.index+size);
			this.rawHeader[headName] = headValue ;
			var func = "set"+headName;
			if (func === "setVia"){
				var index = this.Via.push(headValue);	
				this[headName][index-1] = this[func](headValue, ele);
			}else{
				this[headName] = headValue;
				if (this[func]){
					this[headName] = this[func](headValue);	
				}	
			}
		}.bind(this))
		if (!this["Content-Type"])
			this.message.contentType = null;
		else
			this.message.contentType = this["Content-Type"] ;
	};

	headerSip.prototype.setFrom = function(value){
		parsefromTo.call(this, "from", value)	
		return value;
	};

	headerSip.prototype.setTo = function(value){
		parsefromTo.call(this, "to", value)
		return value;
	};

	headerSip.prototype["setWWW-Authenticate"] = function(value){
		this.message.authenticate = parserAuthenticate(value);
		/*var ele ={};
		var res = value.split(",")
		for (var i=0 ; i < res.length ;i++){
			var ret = regHeaders.algorithm.exec(res[i]);
			var size = ret[0].length;
			var headName = ret.input.substr(0,ret.index).replace(" ","");
			var headValue = ret.input.substr(ret.index+size).replace(/"/g,"");
			ele[headName] = headValue.replace(/"/g,"");
		}
		this.message.authenticate = ele ;*/
		return value;
	};

	headerSip.prototype["setProxy-Authenticate"] = function(value){
		this.message.authenticate = parserAuthenticate(value);
		return value;
	}

	headerSip.prototype["setRecord-Route"] = function(value){
		this.recordRoutes.push(value);
		return value ;
	}

	headerSip.prototype["setRoute"] = function(value){
		this.routes.push(value);
		return value ;
	}


	headerSip.prototype.setDate = function(value){
		try{
			this.message.date = new Date(value)
		}
		catch(e){
			this.message.date = value;
		}
		return value
	};

	headerSip.prototype["setCall-ID"] = function(value){
		this.message.callId = value ;
		return value ;
		/*this.callIdRaw = value ;
		var res = regHeaders.CallId.exec(value);	
		if (res){
			this.message.callId =res[1]; 
			return res[1];
			
		}else{
			this.message.callId =value;	
			return value;
		}*/
	};

	headerSip.prototype.setCSeq = function(value){
		var res = value.split(" ");
		this.message.cseq = parseInt(res[0],10);
		this.message.method = res[1];
		return value;
	};

	//var regContact = /.*<(sip:.*)>(.*)|.*<(sips:.*)>(.*)/g;
	/*headerSip.prototype.setContact = function(value){
		var parseValue = value.replace(regContact,"$1");
		console.log(parseValue)
		var sp = parseValue.split(";");
		var contact = sp.shift();
 	        var tab = contact.split(":");	
		this.message.contact  = tab[0];
		this.message.rport = tab[1];
		for (var i = 0 ; i < sp.length ;i++){
			var res3 = sp[i].split("=");
			//console.log(res3[0] +" : "+  res3[1] );
			this["contact"+res3[0]] = res3[1]; 
		}
		return value; 
	};*/


	headerSip.prototype.setContact = function(value){
		var regContact = /.*<(sips?:.*)>.*/g;
		//console.log(value)
		var parseValue = regContact.exec(value) ;
		//console.log(parseValue)
		if ( parseValue  ){
			this.message.contact = parseValue[1] ;
		}
		/*if ( parseValue[2] ){
			console.log(parseValue[2])
			var clean = parseValue[2].replace("^;(.*)","$1")
			var sp = clean.split(";");
			
			for (var i = 0 ; i < sp.length ;i++){
				var res3 = sp[i].split("=");
				console.log(res3[0] +" : "+  res3[1] );
				//this["contact"+res3[0]] = res3[1]; 
			}

			

		}*/
		
		
		return value; 
	};


	headerSip.prototype.setAllow = function(value){
		if (value ){
			return this.Allow.split(regHeaders.Allow);
		}else{
			return this.Allow;
		}
	};
	headerSip.prototype.setSupported = function(value){
		if (value ){
			return this.Supported.split(regHeaders.Allow);
		}else{
			return this.Supported;
		}
	};

	headerSip.prototype.setVia = function(value,raw){
		if (value){
			var res = value.split(regHeaders.Via);
			var obj = {
				line :Array.prototype.shift.call(res),
				raw:raw
			};
			for (var i = 0 ; i< res.length ;i++){
				var tab = res[i].split('=');
				if ( tab ){
					if (tab[0] === "branch"){
						if ( ! this.branch ){
							this.branch = tab[1];
						}
					}
					obj[tab[0]] = tab[1];
				}
			}
			return obj
		}else{
			return value;
		}
	};
	
	/*
 	 *
 	 * CLASS PARSER BODY SIP
 	 *
 	 *
 	 *
 	 */
	var bodySip = function(message, body){
		this.message = message ;
		this.message.rawBody = body ;
		this.size = this.message.contentLength;
		if ( this.size !== body.length ){
			throw new Error("BAD SIZE SIP BODY ");
		}
		if (body){
			this.parse(this.message.contentType, body)
		}
	
	};

	bodySip.prototype.parse = function(type, body){
		switch (type){
			case "application/sdp":
				this.sdpParser(body);
			break;
			case "application/dtmf-relay":
				this.dtmfParser(body);
			break;
			default:
				this.body = body;
		}
	};
	
	bodySip.prototype.sdpParser = function(body){
		// Parser SDP
		this.body = body || "" ;
		if ( ! body ){
			this.sdp  = null ; 	
		}else{
			try {
				this.sdp = new parserSdp(body);
				//console.log(this.sdp)
			}catch(e){
				throw e ;
			}
		}
	};

	bodySip.prototype.dtmfParser = function(body){
		// Parser DTMF
		this.body = body || "" ;
		if ( ! body ){
			this.dtmf  = null ; 	
		}else{
			// Parser dtmf 
			var obj = {};
			var line = body.split("\n");
			for (var i = 0 ; i< line.length ; i++){
				var res = line[i].split("=");
				obj[res[0].replace(/ |\n|\r/g,"")] = res[1];
			}
			this.dtmf = obj ;
		}
	};

	/*
 	 *
 	 * CLASS REQUEST
 	 *
 	 *
 	 *
 	 */
	var sipRequest = function(transaction, bodyMessage, typeBody){
		this.transaction = transaction;
		this["request-port"] = this.transaction.dialog.sip.serverPort ; 
		
		this.type = "request";
		this.requestLine ={}; 
		this.buildRequestline();

		this.header = {};
		this.buildHeader();

		this.buildBody(bodyMessage || "", typeBody) ;
	};

	var endline = "\r\n";
	var endHeader = "\r\n\r\n";
	sipRequest.prototype.buildRequestline = function(){
		this.requestLine.method = this.transaction.method.toUpperCase();
		this.requestLine.version = this.transaction.dialog.sip.version ;
	};

	sipRequest.prototype.getRequestline = function(uri){
		switch (this.transaction.method){
			case "REGISTER":
				this["request-uri"] = "sip:"+this.transaction.dialog.sip.server ;
				return  this.transaction.method + " "+ this["request-uri"] + " " + this.requestLine.version + endline ;
			break;
			case "INVITE":
			case "BYE":
			case "NOTIFY":
			case "INFO":
			case "CANCEL":
			case "ACK":
				this["request-uri"] = this.transaction.dialog["request-uri"]  ;
				return this.transaction.method + " " + this["request-uri"] +" " + this.requestLine.version + endline ;
			break;
		}
	};
	
	sipRequest.prototype.buildHeader = function(){
		//FIXE ME RPORT IN VIA PARSER 
		//console.log(this.transaction.dialog.sip.rport)
		
		var rport = this.transaction.dialog.sip.rport ;
		var ip = this.transaction.dialog.sip.publicAddress;

		//if ( rport ){
			//this.header.via  = "Via: "+this.transaction.dialog.sip.version+"/"+this.transaction.dialog.sip.settings.transport+" " +ip+":"+rport+";"+"branch="+this.transaction.branch;
			this.header.via  = "Via: "+this.transaction.dialog.sip.via+";"+"branch="+this.transaction.branch;
		//}else{
			//this.header.via  = "Via: "+this.transaction.dialog.sip.version+"/"+this.transaction.dialog.sip.settings.transport+" " +ip+":"+this["request-port"]+";"+"branch="+this.transaction.branch;	
		//}	
		this.header.cseq = "CSeq: "+this.transaction.dialog.cseq + " " + this.transaction.method;

		this.header.from = "From: " +this.transaction.dialog.from + ";tag="+this.transaction.dialog.tagFrom ;

		var tagTo = this.transaction.dialog.tagTo ? ";tag="+this.transaction.dialog.tagTo : "" ;
		this.header.to = "To: "+ this.transaction.to  + tagTo;

		this.header.callId = "Call-ID: " + this.transaction.dialog.callId;
		this.header.expires = "Expires: " + this.transaction.dialog.expires;
		this.header.maxForward = "Max-Forwards: " + this.transaction.dialog.maxForward;
		this.header.userAgent = "User-Agent: " + this.transaction.dialog.sip.settings.userAgent;

		this.header.contact = "Contact: "+this.transaction.dialog.contact

		if (  this.transaction.dialog.routes && this.transaction.dialog.routes.length){
			this.header.routes = [];
			for (var i = this.transaction.dialog.routes.length - 1 ; i >= 0 ; i--){
				this.header.routes.push( "Route: "+ this.transaction.dialog.routes[i] ) ; 		
			}
		}
	};

	sipRequest.prototype.getHeader = function(){
		var head = "";
		for (var line in this.header ){
			switch ( stage.typeOf( this.header[line] ) ){
				case "string":
					head+=this.header[line]+endline;
				break;
				case "array":
					for (var i = 0 ; i <  this.header[line].length ; i++){
						head+=this.header[line][i] + endline ;
					}
				break;
			}
		}
		return head ;
	};

	sipRequest.prototype.buildBody = function(body, type){
		this.header.contentLength  = "Content-Length: " + body.length ;
		if (type)
			this.header.contentType  = "Content-Type: " + type ;
		this.body = body || "" ;
	};

	sipRequest.prototype.getBody = function(){
		return this.body ;
	};
	

	sipRequest.prototype.getMessage = function(){
		//console.log(this.getRequestline() + this.getHeader() + endline + this.getBody())
		//console.log(this.getRequestline() + this.getHeader() + endline + this.getBody())
		return this.rawResponse = this.getRequestline() + this.getHeader() + endline + this.getBody() ;
	};

	sipRequest.prototype.send = function(){
		return this.transaction.send( this.getMessage() );	
	}
		
	/*
 	 *
 	 * CLASS RESPONSE
 	 *
 	 *
 	 *
 	 */
	var sipResponse = function(message, code ,messageCode, bodyMessage, typeBody){
		this.message = message ;
		this.transaction = message.transaction;
		this.dialog = message.dialog;
		this.responseLine ={}; 
		this.buildResponseLine(code ,messageCode);
		this.header =[];// message.header.messageHeaders;
		this.buildHeader(message);
		this.buildBody(bodyMessage || "", typeBody) ;
	};

	var codeMessage = {
		200	:	"OK"
	};

	sipResponse.prototype.buildHeader = function(message){
		for ( var head in  message.rawHeader){
			switch (head){
				case "Allow":
				case "Supported":
					var ptr = ""
					for (var i = 0 ; i< message.header[head].length ; i++){
						if ( i < message.header[head].length - 1 )
							ptr += message.header[head][i] + ",";
						else
							ptr += message.header[head][i] ;
					}
					this.header.push( head + ": "+ptr);
				break;
				case "Via":
					if ( this.responseLine.code == "487"  ) {
						for (var i = 0 ; i < this.dialog[head].length ; i++){
							this.header.push(this.dialog[head][i].raw);	
						}	
					}else{
						for (var i = 0 ; i< message.header[head].length ; i++){
							this.header.push(message.header[head][i].raw);	
						}
					}
				break;
				case "User-Agent" :
					this.header.push( "User-Agent: " + this.transaction.dialog.sip.settings.userAgent);
				break;
				case "Contact":
					/*var rport = this.transaction.dialog.sip.rport ;
					var ip = this.transaction.dialog.sip.publicAddress;
					if ( rport ){
						this.header.push( "Contact: <sip:" +this.transaction.to+"@"+ip+":"+rport+";transport="+this.transaction.dialog.sip.settings.transport.toLowerCase()+">");
					}else{
						this.header.push( "Contact: <sip:" +this.transaction.to+"@"+ip+";transport="+this.transaction.dialog.sip.settings.transport.toLowerCase()+">");
					}*/
					this.header.push( "Contact: "+this.dialog.contact );
				break;
				case "To":
					//console.log(message.header[head] )
					//console.log(this.dialog.sip.displayName )
					var ret = regHeaders.fromToG.exec( message.header[head] ) ;	
					//console.log(ret)
					if ( ret &&  ( ! ret[1] ) ){
						//console.log("traff to")
						message.header[head] = '"'+this.dialog.sip.displayName+'"'+message.header[head] ;	
					}
					//console.log(message.header[head])
					if ( !  message.header[head].match(/;tag=/) ){
						this.header.push(head + ": "+message.header[head]+ ( this.transaction.dialog.tagFrom ? ";tag="+this.transaction.dialog.tagFrom : "" ) );
					}else{
						this.header.push( head + ": "+message.header[head]);	
					}	
				break;
				case "Record-Route":
					for (var i = this.message.dialog.routes.length - 1  ; i >= 0 ; i--){
						this.header.push(head + ": "+ this.message.header.recordRoutes[i]);	
					}
				break;
				case "CSeq":
					if ( this.responseLine.code == "487" && this.dialog.method === "CANCEL"){
						this.header.push( head + ": "+message.header[head].replace("CANCEL", "INVITE"));	
					}else{
						this.header.push( head + ": "+message.header[head]);
					}
				break;
				case "Content-Type": 
				case "Organization": 
				case "Server": 
				case "Content-Length":
				break;
				default :
					this.header.push( head + ": "+message.header[head]);
			}
		}
	};
	
	sipResponse.prototype.getHeader = function(){
		var head = "";
		for (var line in this.header ){
			head+=this.header[line]+endline;
		}
		return head ;
	};

	sipResponse.prototype.buildBody = sipRequest.prototype.buildBody ;

	sipResponse.prototype.getBody = sipRequest.prototype.getBody ;

	sipResponse.prototype.buildResponseLine = function(code, messageCode){
		this.responseLine.method = this.transaction.method.toUpperCase();
		this.responseLine.version = this.transaction.dialog.sip.version ;
		this.responseLine.code = code ;
		this.responseLine.message = messageCode || codeMessage[code] ;
	};

	sipResponse.prototype.getResponseline = function(){
		if (this.responseLine.method == "ACK")
			return 	this.responseLine.method +" "+ "sip:"+this.transaction.from+"@"+this.transaction.dialog.sip.server +" "+this.responseLine.version + endline ;		
		return  this.responseLine.version + " " + this.responseLine.code + " " + this.responseLine.message +  endline ;	
	};

	sipResponse.prototype.getMessage = function(){
		//console.log("RESPONSE : " +this.getResponseline() + this.getHeader() + endline + this.getBody())
		return this.rawResponse = this.getResponseline() + this.getHeader() + endline + this.getBody() ;
	};

	sipResponse.prototype.send = function(){
		return this.transaction.send( this.getMessage() );	
	}

	/*
 	 *
 	 * CLASS TRANSACTION
 	 *
 	 *
 	 */
	var Transaction = function(to, dialog){

		this.dialog = dialog ;	
		if ( to instanceof Message){
			this.hydrate(to);
		}else{
			this.to = to ;
			this.from = dialog.from ;
			this.method = dialog.method;
			this.branch = this.generateBranchId() ;
		}
		this.responses = {};
		this.requests = {};	
		this.interval = null;
	}

	Transaction.prototype.hydrate = function(message){
		this.message = message;
		if ( message.type === "REQUEST" ){
			this.to = this.dialog.to
			this.from = this.dialog.from
			this.method = this.dialog.method;
			this.branch = this.message.header.branch;	 
		}
		if ( message.type === "RESPONSE" ){
			this.to = this.dialog.to
			this.from = this.dialog.from
			this.method = this.dialog.method;
			this.branch = this.message.header.branch;
		}

	}

	var generateHex = function(){
		return Math.floor(Math.random()*167772150000000).toString(16) ;
	};

	Transaction.prototype.generateBranchId = function(){
		var hex = generateHex();
		if ( hex.length === 12 )
			return "z9hG4bK"+hex;
		else
			return arguments.callee();
	};

	Transaction.prototype.createRequest = function(body, typeBody){
		if (this.method != "ACK" && this.method != "CANCEL" ){
			this.dialog.incCseq();
		}
		this.request = new sipRequest(this, body || "", typeBody);
		this.message = null;
		return this.request ;
	};

	Transaction.prototype.createResponse = function(code ,message, body, typeBody){
		if (this.method === "INVITE" || this.method === "ACK" ){
			switch ( true ){
				case code < 200 : 
					this.dialog.status = this.dialog.statusCode.EARLY ; 
				break;
				case code < 300 :
					this.dialog.status = this.dialog.statusCode.ESTABLISHED ;
				break;
				default:
					this.dialog.status = this.dialog.statusCode.TERMINATED ;	
			}
		}
		this.response = new sipResponse(this.message, code, message, body , typeBody );
		return this.response ;
	};

	Transaction.prototype.send = function(message){
		return this.dialog.sip.send( message )
	};

	Transaction.prototype.cancel = function(){
		this.method = "CANCEL";
		this.dialog.routes = null ;
		this.dialog.tagTo = "" ;
		var request = this.createRequest();
		request.send();
		this.dialog.status = this.dialog.statusCode.CANCEL ;
		return request ;
	}

	Transaction.prototype.decline = function(){
		var ret = this.createResponse(
			603,
			"Declined"	
		);
		ret.send();
		return ret ;
	}

	Transaction.prototype.clear = function(){
		// CLEAR INTERVAL	
		if (this.interval){
			clearInterval(this.interval);
		}
	};

	/*
 	 *
 	 * CLASS DIALOG
 	 *
 	 */
	var Dialog = function(method, sip){

		this.sip = sip;
		this.transactions = {};
		this.status = this.statusCode.INITIAL ;
		this.routes = null ;
		this.from = this.sip.from;
		this.maxForward = this.sip.settings.maxForward;
 		this.expires = this.sip.settings.expires;
		this.tagFrom = this.generateTag() ;
		this.cseq = this.generateCseq();

		if (method instanceof Message ){
			this.hydrate( method );
		}else{
		
			this.method = method;
		
			this.callId = this.generateCallId(); 
			this.status = this.statusCode.INITIAL ;
			 
			this.to = null ;
			this.tagTo = null ; 
			
		}

		this.contact = this.sip.generateContact( null, null, true) ;
	}

	Dialog.prototype.statusCode = {
		INITIAL:	0,
		EARLY:		1,	// on 1xx
		ESTABLISHED:	2,	// on 200 ok
		TERMINATED:	3,	// on by	
		CANCEL:		4	// cancel
	}

	Dialog.prototype.hydrate = function(message){
		
		if ( message.type === "REQUEST" ){
			this.cseq = message.cseq; 
			this.method = message.method ;
			this.callId = message.callId;
			 
			// to
			if ( message.fromNameDisplay ){
				this.to = '"'+message.fromNameDisplay+'"' + "<sip:"+message.from+">" ;
			}else{
				this.to = "<sip:"+message.from+">" ;	
			}
			this.toName = message.fromName;
			this.tagTo = message.fromTag || this.generateTag() ; 
			//from
			this.tagFrom = message.toTag || this.tagFrom;
 		        if (message.toNameDisplay){
				this.from ='"'+message.toNameDisplay+'"' + '<sip:'+message.to+'>';
			}else{
				this.from = "<sip:"+message.to+">";
			}	
			this.fromName= message.toName; 
			
			
			// manage routes
			if ( message.header.recordRoutes.length ){
				this.routes = message.header.recordRoutes.reverse();  	
			}

			// FIXME if (  ! this["request-uri"] &&  message.contact ) 
			if (  message.contact ){
				//this["request-uri"] =  message.contact + ":" + message.rport
				this["request-uri"] =  message.contact ;
			}

		}
		if ( message.type === "RESPONSE" ){
			this.cseq = message.cseq;
			if ( !  this.callId )
				this.callId = message.callId;
			if ( !  this.to ){
				if ( message.toNameDisplay ){
					this.to =  '"'+message.toNameDisplay+'"' + "<sip:"+message.to+">" ;
				}else{
					this.to =  "<sip:"+message.to+">" ;
				}
			}else{
				if ( message.toNameDisplay ){
					this.to =  '"'+message.toNameDisplay+'"' + "<sip:"+message.to+">" ;
				}
			}

			if ( message.toTag ){
				this.tagTo = message.toTag ;	
			}
			if ( message.fromTag ){
				this.tagFrom = message.fromTag ;	
			}
			// FIXME if (  ! this["request-uri"] &&  message.contact ) 
			if (  message.contact ){
				//this["request-uri"] =  message.contact + ":" + message.rport
				this["request-uri"] =  message.contact ;
			}

			// manage routes
			if ( message.header.recordRoutes.length ){
				this.routes = message.header.recordRoutes ;	
			}
		}
	}

	Dialog.prototype.generateCallId = function(){
		return parseInt(Math.random()*1000000000,10);
	}

	Dialog.prototype.generateTag = function(){
		return "nodefony"+parseInt(Math.random()*1000000000,10);
	}

	Dialog.prototype.generateCseq = function(){
		return 1;
	}

	Dialog.prototype.incCseq = function(){
		this.cseq = this.cseq + 1 ;
		return this.cseq ;
	}

	Dialog.prototype.getTransaction = function(id){
		if ( id in this.transactions ){
			return this.transactions[id] ;
		}
		return null ;	
	}

	Dialog.prototype.createTransaction = function(to){
		this.currentTransaction = new Transaction( to || this.to , this);
		console.log("SIP NEW TRANSACTION :" + this.currentTransaction.branch);
		this.transactions[this.currentTransaction.branch] = this.currentTransaction;
		return this.currentTransaction;	
	}

	Dialog.prototype.register = function(){
		var trans = this.createTransaction(this.from);
		this.to = this.from ;
		var request = trans.createRequest();
		request.send();
		return trans;
				
	};

	Dialog.prototype.unregister = function(){
		this.expires = 0 ;
		this.contact = "*" ;
		var trans = this.createTransaction(this.from);
		this.to = this.from ;
		var request = trans.createRequest();
		request.send();
		return trans;		
	};

	
	Dialog.prototype.ack = function(message){
		if ( ! this["request-uri"] ){
			this["request-uri"] = this.sip["request-uri"] ;
		}
		//this.method = "ACK" ;
		var trans = this.createTransaction();	
		trans.method = "ACK" ;
		var request = trans.createRequest();
		request.send();
		return request ;
	};

	Dialog.prototype.invite = function(userTo, description, type){

		if ( this.status  === this.statusCode.CANCEL ){
			return null ;
		}
		console.log("SIP INVITE DIALOG")
		if ( userTo ){
			this.to = "<sip:"+userTo+">" ;
		}
		this.method = "INVITE" ;
		if ( ! this["request-uri"] ){
			this["request-uri"] = "sip:"+userTo ;
		}
		
		if ( description.sdp ){
			this.bodyType = "application/sdp" ;
			this.body = description.sdp ;
		}else{
			this.bodyType = type ;
			this.body = description ;
		}
		var trans = this.createTransaction(this.to);
		var request = trans.createRequest(this.body, this.bodyType);
		request.send();
		return trans;
	
	};

	Dialog.prototype.notify = function(userTo, notify, typeNotify){
		this.method = "NOTIFY" ;	
		if ( userTo )
			this.to = "<sip:"+userTo+">" ;
		
		if ( ! this["request-uri"] ){
			this["request-uri"] = "sip:"+userTo ;
		}
		if (typeNotify){
			this.bodyType = typeNotify ;
		}
		if ( notify ){
			this.body = notify ;
		}
		var trans = this.createTransaction(this.to);
		var request = trans.createRequest(this.body, this.bodyType);
		request.send();
		return this;

	};

	Dialog.prototype.info = function( info, typeInfo){
		this.method = "INFO" ;	
		
		if (typeInfo){
			this.bodyType = typeInfo ;
		}
		if ( info ){
			this.body = info ;
		}
		var trans = this.createTransaction(this.to);
		var request = trans.createRequest(this.body, this.bodyType);
		request.send();
		return this;

	};

	Dialog.prototype.bye = function(){
		this.method = "BYE" ;
		var trans = this.createTransaction();
		var request = trans.createRequest();
		request.send();
		return this;

	};

	Dialog.prototype.clear = function(id){
		if ( id ){
			if (this.transactions[id]){
				this.transactions[id].clear();
			}else{
				throw new Error("TRANSACTION not found :" + id);
			}
		}else{
			for ( var transac in this.transactions ){
				this.transactions[transac].clear();	
			}	
		}
	}

	/*
 	 *
 	 *	MESSAGE SIP 
 	 *
 	 *
 	 */ 
	var firstline = function(firstLine){
		var method = firstLine[0];	
		var code = firstLine[1];
		if ( method === "BYE" && ! code){
			code = 200 ;
		}
		var message = "";
		for (var i = 2 ;i<firstLine.length;i++){
			message+=firstLine[i]+" ";	
		}
		return {
			method : method,
			code : code,
			message : message
		}	
	};

	var regSIP = /\r\n\r\n/ ;
	var Message = function(message, sip){
		this.sip = sip ;
		if (message){
			this.rawMessage = message ;
			this.header = null;
			this.body = null;
			this.statusLine = null;
			this.contentLength = 0 ;
			this.code = null ;
			this.statusLine = "" ;	
			this.split = message.split( regSIP );
			if (this.split.length && this.split.length <= 2){ 
				try {
					this.parseHeader();
					this.contentLength = parseInt(this.header["Content-Length"], 10) ;
					this.parseBody();	
					this.statusLine =firstline(this.header.firstLine) 
					this.code = parseInt( this.statusLine.code, 10);
					this.getType(); 
				}catch(e){
					throw e
				}

				this.rawHeader = this.header.rawHeader ;
				//console.log(this.rawHeader)
			}
			this.getDialog();
			this.getTransaction();
			
		}else{
			throw new Error( "BAD FORMAT MESSAGE SIP no message" , 500);
		}
	}

	Message.prototype.getType = function( ){
		if ( this.code ){
			if ( ( typeof this.code ) === "number" &&  ! isNaN (this.code) ){
				this.type = "RESPONSE" ;
			}else{
				throw new Error("BAD FORMAT MESSAGE SIP message code   ") ;	
			}
		}else{
			if ( this.method ){
				this.type = "REQUEST" ;
			}else{
				this.type = null ;
				throw new Error("BAD FORMAT MESSAGE SIP message type not defined  ") ;
			}
		}
	}

	Message.prototype.parseBody = function( ){
		if ( this.split[1] ){
			this.body = new bodySip(this, this.split[1]);
		}else{
			this.body = new bodySip(this, ""); 
		}
	}

	Message.prototype.parseHeader = function( ){
		if ( this.split[0] ){
			this.header = new headerSip(this, this.split[0]);
		}else{
			throw ("BAD FORMAT MESSAGE SIP no header ", 500);
		}	
	}

	Message.prototype.getHeader = function(){
		return this.header;
	};

	Message.prototype.getBody = function(){
		return this.body;
	};

	Message.prototype.getStatusLine = function(){
		return this.statusLine;
	};

	Message.prototype.getCode = function(){
		return this.code ;
	}

	Message.prototype.getDialog = function(){
		if (  this.header["Call-ID"] ){
			this.dialog = this.sip.getDialog( this.header["Call-ID"] ) ;
			if ( ! this.dialog ){
				this.dialog = this.sip.createDialog(this)
			}else{
				console.log("SIP HYDRATE DIALOG :" + this.dialog.callId)
				this.dialog.hydrate(this);	
			}
			return this.dialog ;
		} else{
			throw new Error("BAD FORMAT SIP MESSAGE no Call-ID" , 500);
		}
	}

	Message.prototype.getTransaction = function(){
		if ( this.header["branch"] ){
			if ( ! this.dialog ){
				this.getDialog();
			}
			if ( this.dialog ){
				this.transaction = this.dialog.getTransaction( this.header["branch"] ) ;
				if ( ! this.transaction ){
					this.transaction = this.dialog.createTransaction(this);	
				}else{
					console.log("SIP HYDRATE TRANSACTION :" + this.transaction.branch)
					this.transaction.hydrate(this);	
				}
			}else{
				this.transaction = null ;
			}
			return this.transaction ;
		}else{
			// TODO CSEQ mandatory
			console.log( this.rawMessage )
			throw new Error("BAD FORMAT SIP MESSAGE no Branch" , 500);
		}	
	}

	/*
 	 *
 	 *
 	 *	CLASS SIP 
 	 *
 	 *
 	 */
	// entry point response transport
	var onMessage = function(response){
		
		console.log("RECIEVE SIP MESSAGE ");	
		console.log(response);	

		try {
			//console.log(this.fragment)
			if ( this.fragment ){
				this.lastResponse += response;
				//console.log(this.lastResponse);
			}else{
				this.lastResponse = response ;
			}
			var message = new Message(this.lastResponse, this);
			this.fragment = false ;
		}catch(e){
			console.log(e)
			// bad split 
			for ( var i = 0 ; i < e.length ; i++){
				if ( e[i] ){
					try {
						onMessage.call(this, e[i]);			
						continue;
					}catch(e){
						//console.log("FRAGMENTE")
						this.fragment = true ;	
						return ;		
					}
				}
			}	
			return ;
		}
		this.fire("onMessage", message.rawMessage);	
		//console.log( message.type + " : " + response);
		switch (message.method){
			case "REGISTER" :
				this.rport = message.header.Via[0].rport;
				if (this.rport ){
					this["request-uri"] =  "sip:"+this.userName+"@"+this.publicAddress+":"+ this.rport +";transport="+this.transportType;	
				}
				switch ( message.code ){
					case 401 :
					case 407 :
						if (this.registered === 200 ) {
							if ( this.registerInterval )
								clearInterval(this.registerInterval);
							this.registerInterval = null ;	
						}else{
							
							if ( this.registered === 401 || this.registered === 407){
								if ( this.registerInterval )
									clearInterval(this.registerInterval);
								this.registerInterval = null ;	
								this.registered = null;
								this.notificationsCenter.fire("onError", this, message);
								break; 
							}
							this.registered = message.code ;
						}

						delete this.authenticate ;
						this.authenticate = null;	
						this.authenticate = new authenticate(message.dialog, this.userName , this.settings.password) ;
						var transaction = this.authenticate.register(message, message.code === 407 ? "proxy" : null);
						
					break;	
					case 403 :
						this.registered = message.code ;
						//console.log("Forbidden (bad auth)")
						delete this.authenticate ;
						this.authenticate = null;
						this.notificationsCenter.fire("onError", this, message);
					break;	
					case 404 :
						this.registered = message.code ;
						delete this.authenticate ;
						this.authenticate = null;
						this.notificationsCenter.fire("onError", this, message);
					break;
					case 200 :
						if ( this.registerInterval ){
							clearInterval( this.registerInterval );	
						}
						if ( ! message.contact ){
							this.registered = "404" ;
							this.notificationsCenter.fire("onUnRegister",this, message);
							return ;
						}
						if (this.registered === 401 ) {
							this.notificationsCenter.fire("onRegister", this, message);
						}
						this.registered = message.code ;
						this.registerInterval = setInterval(function(){
							this.register(this.userName, this.settings.password);
						}.bind(this) ,  this.settings.expires * 900  );
					break;
					default:
						this.registered = message.code ;
						delete this.authenticate ;
						this.authenticate = null;
						//console.log(message);
						this.notificationsCenter.fire("on"+message.code, this, message);
					break;
				}
			break;
			case "INVITE" :
				//this.rport = message.rport || this.rport;

				switch ( message.type ){
					case "REQUEST":
						if ( message.dialog.status === message.dialog.statusCode.INITIAL ){
							this.fire("onInitCall", message.dialog.toName, message.dialog, message.transaction);
							if ( message.header.Via ){
								message.dialog.Via = message.header.Via ;	
							}
							this.notificationsCenter.fire("onInvite", message, message.dialog);
						}else{
							//console.log(message.dialog.statusCode[message.dialog.status])
							if ( message.dialog.status === message.dialog.statusCode.ESTABLISHED ){
								this.notificationsCenter.fire("onInvite", message, message.dialog);
							}else{
								var ret = message.transaction.createResponse(200, "OK");
								ret.send();
							}
						}
					break;
					case "RESPONSE":
						if ( message.code >= 200 ){
							message.dialog.ack(message);	
						}
						switch(message.code){
							case 407 :
							case 401 :
								delete this.authenticate ;
								this.authenticate = null;
								this.authenticate = new authenticate(message.dialog, this.userName , this.settings.password) ;
								var transaction = this.authenticate.register(message, message.code === 407 ? "proxy" : null);
								this.fire("onInitCall", message.dialog.toName, message.dialog, transaction);
							break;
							case 180 : 
								this.notificationsCenter.fire("onRinging",this, message);
								message.dialog.status = message.dialog.statusCode.EARLY ;
							break;
							case 100 : 
								this.notificationsCenter.fire("onTrying",this, message);
								message.dialog.status = message.dialog.statusCode.EARLY ;
							break;
							case 200 :
								this.notificationsCenter.fire("onCall",message);
								message.dialog.status = message.dialog.statusCode.ESTABLISHED ;
							break;
							case 486 : 
							case 603 : 
								this.notificationsCenter.fire("onDecline", message);
							break;
							case 403 :
								this.authenticate = false;
								this.notificationsCenter.fire("onError", this, message);
							break;
							case 487 :
								// ACK !!
							break;
							case 404 :
							case 477 :
							case 480 :
							case 484 :
							case 488 :
								this.notificationsCenter.fire("onError",this, message);
							break;
							case 408 :
								this.notificationsCenter.fire("onTimeout",this, message);
							break;
							case 500 :
								this.notificationsCenter.fire("onError",this, message);
							break;
							default:
								this.notificationsCenter.fire("on"+message.code, this, message);
							break;
						}
					break;
					default:
						// error BAD FORMAT
				}
			break;
			case "ACK" :
				//console.log("ACK");
				//TODO manage interval messages timer retransmission 
			break;
			case "BYE" :
				switch(message.code){
					case 200 :
						//console.log("200")
						this.notificationsCenter.fire("onBye",message);
					break;
					default :
						this.notificationsCenter.fire("onBye",message);
						var res = message.transaction.createResponse(200,"OK")
						res.send();
				}
			break;
			case "INFO" :
				switch ( message.type ){
					case "REQUEST":
						//console.log("SIP   :"+ message.method + " "+" type: "+message.contentType );
						this.notificationsCenter.fire("onInfo",message);	
						var res = message.transaction.createResponse(200, "OK")
						res.send();
					break;
					case "RESPONSE":
						//console.log("SIP   :"+ message.method + " "+" code:"+message.code );
						this.notificationsCenter.fire("onDrop",message);
					break;
				}
			break;

			case "CANCEL" :
				switch ( message.type ){
					case "REQUEST":
						this.notificationsCenter.fire("onCancel",message);
						var res = message.transaction.createResponse(200, "OK")
						res.send();
						message.dialog.status = message.dialog.statusCode.CANCEL ;
						var res = message.transaction.createResponse(487, "Request Terminated")
						res.send();
						message.dialog.status = message.dialog.statusCode.TERMINATED  ;

					break;
					case "RESPONSE":
						
						this.notificationsCenter.fire("onDrop",message);
					break;
				}
			break;
			case "REFER":
				console.log("SIP REFER NOT ALLOWED :"+ message.method );
				this.notificationsCenter.fire("onDrop",message);	
			break;
			default:
				console.log("SIP DROP :"+ message.method + " "+" code:"+message.code );
				this.notificationsCenter.fire("onDrop",message);
				// TODO RESPONSE WITH METHOD NOT ALLOWED 
		}

			
	}

	var onStart = function(){
		this.fire("onStart",this);
	};

	var onStop = function(){
		this.stop();	
	};

	var defaultSettings = {
		expires		: 200,		// en secondes
		maxForward	: 70,
		version		: "SIP/2.0",
		userAgent	: "nodefony",
	 	portServer	: "5060",
	 	userName	: "userName",		
		displayName	: "",
	 	pwd		: "password",
		transport	: "TCP"
	};

	var SIP = function(server, transport, settings){

		this.settings = stage.extend({}, defaultSettings, settings);
		//this.settings.url = stage.io.urlToOject(url)
		this.notificationsCenter = stage.notificationsCenter.create(this.settings, this);
		this.dialogs = {};
		this.version = this.settings.version;

		//
		this.server = server ;
		this.serverPort = this.settings.portServer;

		this.authenticate = false;

		// REGISTER
		this.registerInterval = null;
		this.registered = null ;

		// TRANSPORT
		this.transport = transport ;
		if ( this.transport ){
			this.initTransport();
		}
		this.transportType = this.settings.transport.toLowerCase() ;

		this.contact = null ;
		this.via = null ;
		// IDENTIFIANT
		//  USER
		//this.userName = this.settings.userName ;
		//this.from = "<sip:"+this.userName+"@"+this.publicAddress+">" ; 
		//this.contact = this.generateContact();
		//this["request-uri"] =  "sip:"+this.userName+"@"+this.publicAddress+";transport="+this.transportType ;

	};	

	SIP.prototype.generateInvalid = function(){
		return parseInt(Math.random()*1000000000,10)+".nodefony.invalid" ;
	}

	SIP.prototype.generateVia = function(addr){
		if ( this.rport ){
			return  this.version+"/"+this.settings.transport+" " +addr+";rport" ;
		}else{
			return  this.version+"/"+this.settings.transport+" " +addr ;
		}
	}

	SIP.prototype.generateContact = function( userName, password , force, settings){
		if ( userName ) {
			this.userName = userName  ;
			if ( settings && settings.displayName ){
				this.displayName = settings.displayName ; 
			}else{
				this.displayName = userName ;
			}
			this.from = '"'+this.displayName+'"'+'<sip:'+this.userName+'@'+this.publicAddress+'>' ;
			this["request-uri"] =  "sip:"+this.userName+"@"+this.publicAddress+";transport="+this.transportType ;
			if ( password ){
				this.settings.password = password ;
			}
		}
		
		if ( ! this.contact  || force ){
			switch ( this.transportType ){
				case "ws":
				case "wss":
					var invalid = this.generateInvalid() ;
					this.via = this.generateVia(invalid);
					if ( this.rport ){
						return  '"'+this.displayName+'"'+"<sip:"+this.userName+"@"+ invalid +":"+ this.rport +";transport="+this.transportType+">" ;
					}else{
						return  '"'+this.displayName+'"'+"<sip:"+this.userName+"@"+ invalid +";transport="+this.transportType+">" ; 
					}
				break;
				case "tcp" :
				case "udp" :
					var invalid = this.generateInvalid() ;
					this.via = this.generateVia(invalid);
					//this.via = this.generateVia(this.publicAddress);
					if ( this.rport ){
						return  '"'+this.displayName+'"'+"<sip:"+this.userName+"@"+invalid+":"+this.rport+";transport="+this.transportType+">" ;
					}else{
						return  '"'+this.displayName+'"'+"<sip:"+this.userName+"@"+invalid+";transport="+this.transportType+">" ;
					}
				break;
				default :
					throw new Error("SIP TRANSPORT TYPE NOT ALLOWED") ;
			}
		}
		return this.contact ;
	}

	SIP.prototype.getDialog = function(id){
		if ( id in this.dialogs ){
			return this.dialogs[id] ;
		}
		return null ;	
	}

	SIP.prototype.initTransport = function(transport){
		if ( transport ){
			this.transport = transport ; 
		}

		// GET REMOTE IP
		if (this.transport.publicAddress){
			this.publicAddress = this.transport.domain.hostname ;	
			this.publicAddress = this.server ;
		}else{
			this.publicAddress = this.server ;	
		}

		switch(this.settings.transport) {
			// realtime nodefony
			case "TCP" :
			case "UDP" :
				this.transport.listen(this, "onSubscribe", function(service, message){
					if (service === "SIP" || service === "OPENSIP")
						onStart.call(this, message);
				} );
				
				this.transport.listen(this, "onUnsubscribe", function(service, message){
					if (service === "SIP" || service === "OPENSIP")
						onStop.call(this, message);
				} );
				this.transport.listen(this, "onMessage", function(service, message){
					if (service === "SIP" || service === "OPENSIP")
						onMessage.call(this, message);
				} );

				this.transport.listen(this, "onClose", function( message){
					this.quit(message)
				} );
			break;
			case "WS":
			case "WSS":
				this.transport.listen(this, "onMessage",  function( message){
					//this.notificationsCenter.fire("onMessage",message.data);
					onMessage.call(this, message.data);
				});
				this.transport.listen(this, "onError",function( message ){
					this.notificationsCenter.fire("onError", this.transport, message);
				});
				this.transport.listen(this, "onConnect", function(message){
					this.connect(message);
				});
				this.transport.listen(this, "onClose", function( message){
					this.quit(message)
				} );
			break;
			default :
				this.fire("onError", new Error("TRANSPORT LAYER NOT DEFINED") ) ;
		}
	}

	SIP.prototype.clear = function(){
		if ( this.registerInterval  ){
			clearInterval(this.registerInterval);
		}
		//TODO
		//clean all setinterval	
		for (var dia in this.dialogs){
			this.dialogs[dia].clear();	
		}
	}

	SIP.prototype.quit = function(message){
		this.fire("onQuit",this, message);
		this.unregister();
		this.clear();
	}

	SIP.prototype.connect = function(message){
		this.fire("onConnect",this, message);
	}

	SIP.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};

	SIP.prototype.fire = function(){
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};

	SIP.prototype.createDialog = function(method){
		var dialog = new Dialog( method , this);
		console.log("SIP NEW DIALOG :" + dialog.callId);
		this.dialogs[dialog.callId] = dialog;
		return dialog ;
	};

	SIP.prototype.register = function(userName, password, settings){
		console.log("TRY TO REGISTER SIP : " + userName + password)
		this.contact = this.generateContact(userName, password, false, settings);
		this.diagRegister = this.createDialog("REGISTER");
		this.diagRegister.register();
		return this.diagRegister;
	};

	SIP.prototype.unregister = function(){
		var diagRegister = this.createDialog("REGISTER");
		diagRegister.unregister();
		return diagRegister;
	};

	SIP.prototype.invite = function(userTo, description){
		var diagInv = this.createDialog("INVITE");
		var transaction = diagInv.invite( userTo+"@"+this.publicAddress , description);
		diagInv.toName = userTo ;
		this.fire("onInitCall", userTo ,diagInv, transaction);
		return diagInv; 
	};

	SIP.prototype.notify = function(userTo, description, type){
		var diagNotify = this.createDialog("NOTIFY");
		diagNotify.notify( userTo+"@"+this.publicAddress , description, type);
		return diagNotify; 
	};

	
	SIP.prototype.send = function(data){
		console.log("SIP SEND : " +data)
		this.fire("onSend", data) ;
		this.transport.send( data );
	};

	SIP.prototype.bye = function(callId){
		for ( var dialog in this.dialogs ){
			if (   callId ){
				if ( this.dialogs[dialog].callId === callId && this.dialogs[dialog].method !== "REGISTER" && this.dialogs[dialog].status === this.dialogs[dialog].statusCode.ESTABLISHED   ){
					this.dialogs[dialog].bye();
					break ;
				}
			}else{
				this.dialogs[dialog].bye();
			}
		}
	};
	return SIP;
});
