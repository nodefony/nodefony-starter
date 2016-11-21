/*
 *
 *
 *
 *
 *
 */
var Promise = require('promise');

nodefony.register("controller", function(){

	var Controller = function(container, context){
		this.context = context;
		this.container = container;
		this.notificationsCenter = this.container.get("notificationsCenter");
		this.sessionService = this.container.get("sessions");
		this.query = context.request.query ;
		/*this.queryFile = context.request.queryFile;
		this.queryGet = context.request.queryGet;
		this.queryPost = context.request.queryPost;*/
		this.serviceTemplating = this.container.get('templating') ;
	};
	
	Controller.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = "CONTROLER "+this.name+" ";
		return syslog.logger(pci, severity, msgid,  msg);
	};

	Controller.prototype.getName = function(){
		return this.name;
	};

	Controller.prototype.get = function(name){
		return this.container.get(name);
	};

	Controller.prototype.set = function(key, value){
		return this.container.set(key, value);
	};

	Controller.prototype.getParameters = function(name){
		return this.container.getParameters(name);
	};
	
	Controller.prototype.setParameters = function(name, str){
		return this.container.setParameters(name, str);
	};

	Controller.prototype.has = function(name){
		return this.container.has(name);
	};

	Controller.prototype.getRequest = function(){
		return this.context.request;
	};

	Controller.prototype.getResponse = function(content){
		if (content)
			this.context.response.setBody( content );
		return this.context.response;
	};

	Controller.prototype.getContext = function(){
		return this.context ;
	};

	Controller.prototype.getMethod = function(){
		return this.context.getMethod() ;
	};

	Controller.prototype.startSession = function(sessionContext, callback){
		return  this.sessionService.start(this.context, sessionContext || "default", callback) ;
	};

	Controller.prototype.getSession = function(){
		return this.context.session || null ;
	};

	Controller.prototype.getFlashBag = function(key){
		var session = this.getSession() ;
		if (session){
			return session.getFlashBag() ;
		}else{
			return null ;
		}
	};

	Controller.prototype.setFlashBag = function(key, value){
		var session = this.getSession() ;
		if (session){
			return session.setFlashBag(key, value) ;
		}else{
			return null ;
		}
	};

	Controller.prototype.getORM = function(){
		var defaultOrm = this.container.get("kernel").settings.orm ;
		return this.container.get(defaultOrm);
	};

	Controller.prototype.renderRawView = function(path, param ){
		var res = null;
		var extendParam = nodefony.extend( {}, param, this.context.extendTwig);

		try{ 
			this.serviceTemplating.renderFile(path, extendParam, function(error, result){
				if (error || result === undefined){
					if ( ! error ){
						error = new Error("ERROR PARSING TEMPLATE :" + path.path)
					}
					throw error ;
				}else{
					try {
						this.notificationsCenter.fire("onView", result, this.context, path , param);
						res = result;
					}catch(e){
						throw e ;
					}
				}
 			}.bind(this));
		}catch(e){
			throw e ;
		}
		return res;
	};

	Controller.prototype.renderView = function(view, param ){

		var res = null;
		var extendParam = nodefony.extend( {}, param, this.context.extendTwig);

		if ( this.serviceTemplating.cache ){
			try {
				var templ = this.container.get("httpKernel").getTemplate(view);
			}catch(e){
				throw e ;
			}
			try {
				var res = templ.render(extendParam) ;
				try {
					this.notificationsCenter.fire("onView", res, this.context, null , param);
				}catch(e){
					throw e ;
				}
			}catch(e){
				throw e ;
			}
			return res ;
		}

		try {
			var View = this.container.get("httpKernel").getView(view);
		}catch(e){
			throw e ;
		}
		try{ 
			this.serviceTemplating.renderFile(View, extendParam, function(error, result){
				if (error || result === undefined){
					if ( ! error ){
						error = new Error("ERROR PARSING TEMPLATE :" + view)
					}
					throw error ;
				}else{
					try {
						this.notificationsCenter.fire("onView", result, this.context, View , param);
						res = result;
					}catch(e){
						throw e ;
					}
				}
 			}.bind(this));
		}catch(e){
			throw e ;
		}
		return res;
	};

	Controller.prototype.renderResponse = function(data, status , headers ){
		var res = this.getResponse(data);
		if (! res ){
			this.logger("WARNING ASYNC !!  RESPONSE ALREADY SENT BY EXPCEPTION FRAMEWORK","WARNING");
			return ;
		}
		this.notificationsCenter.fire("onView", data, this.context );
		if (headers && typeof headers === "object" ) res.setHeaders(headers);
		if (status) res.setStatusCode(status);
		this.notificationsCenter.fire("onResponse", res , this.context);
	};

	Controller.prototype.renderJson = function( obj , status , headers){
		try {
			var data = JSON.stringify( obj ) ;
		}catch(e){
			throw e		
		}
		return this.renderResponse( data, status || 200 , nodefony.extend( {}, {
			'Content-Type': "text/json ; charset="+ this.context.response.encoding	
		}, headers ));
	}

	Controller.prototype.renderJsonAsync = function(obj , status , headers){
		var response = this.renderJson(obj , status , headers);
		if ( response )
			this.notificationsCenter.fire("onResponse", response,  this.context );
	};

	Controller.prototype.renderAsync = function(view, param){
		var response = this.render(view, param);
		if ( response )
			this.notificationsCenter.fire("onResponse", response,  this.context );
	};

	Controller.prototype.render = function(view, param){
		var response = this.getResponse() ;
		if (! response ){
			this.logger("WARNING ASYNC !!  RESPONSE ALREADY SENT BY EXPCEPTION FRAMEWORK","WARNING");
			return ;
		}
		try {
			var res = this.renderView(view, param);
			
		}catch(e){
			 this.context.notificationsCenter.fire("onError", this.context.container, e);
			 return ;
		}
		if (res !== null ){
			return response ;
		}
		return res ;
	};

	Controller.prototype.renderFileDownload = function(file, options, headers){
		//console.log("renderFileDownload :" + file.path)
		if (file instanceof nodefony.fileClass ){
			var File = file;
		}else{
			if ( typeof file  === "string"){
				var File  = new nodefony.fileClass(file);	
			}else{
				throw new Error("File argument bad type for renderFileDownload :" + typeof file);
			}	
		}
		if (File.type !== "File"){
			throw new Error("renderMediaStream bad type for  :" +  file);
		}
		var length = File.stats.size ;
		var head = nodefony.extend({
			'Content-Disposition': 'attachment; filename="'+File.name+'"',
			'Content-Length':length,
			"Expires": "0",
			'Content-Description': 'File Transfer',
			'Content-Type': File.mimeType
		}, headers || {});

		var response = this.getResponse();
		var request = this.getRequest().request;

		try {
			var fileStream = fs.createReadStream(File.path, options );
		}catch(e){
			throw e ;
		}
		fileStream.on("open",function(){
			try {
				response.response.writeHead(200, head); 
				fileStream.pipe(response.response, {
					// auto end response 
					end:false
				});
			}catch(e){
				throw e ;
			}
		});

		fileStream.on("end",function(){
			if (fileStream) {
				try {
					fileStream.unpipe(response.response);
					if (fileStream.fd) {
						//console.log("CLOSE")
						fs.close(fileStream.fd);
					}
				}catch(e){
					throw e ;
				}
        		}
			response.end();
		});

		fileStream.on("close",function(){
			response.end();
		});

		response.response.on('close', function() {
			if (fileStream.fd){
				fileStream.unpipe(response.response);
				fs.close(fileStream.fd);
			}
			response.end();
		})
		
		fileStream.on("error",function(error){
			response.end();
			throw error ;				
		});
	};
		
	Controller.prototype.renderMediaStream = function(file , options, headers){
		//console.log("renderMediaStream :" + file.path)
		if (file instanceof nodefony.fileClass ){
			var File = file;
		}else{
			if ( typeof file  === "string"){
				var File  = new nodefony.fileClass(file);	
			}else{
				throw new Error("File argument bad type for renderMediaStream :" + typeof file);
			}	
		}
		if (File.type !== "File"){
			throw new Error("renderMediaStreambad type for  :" +  file);
		}
		if ( ! options ) options = {};
		var request = this.getRequest();
		var requestHeaders = request.headers ;
		var range = requestHeaders.range;
		var length = File.stats.size ;
		if ( range ) {
			//console.log("HEADER = " + range);
			var parts = range.replace(/bytes=/, "").split("-");
			//console.log(parts)
			var partialstart = parts[0];
			var partialend = parts[1];
			var start = parseInt(partialstart, 10);
			var end = partialend ? parseInt(partialend, 10) : length - 1;
			var chunksize = (end - start) + 1;
			//console.log("start :" + start) ;
			//console.log("end :" + end) ;
			var value = nodefony.extend(options , {
				start:start,
				end:end
			});
			//console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);
			var head = nodefony.extend({
				'Content-Range': 'bytes ' + start + '-' + end + '/' + length,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunksize,
				'Content-Type': File.mimeType	
			}, headers);
			
			var code = 206 ;
		}else{
			var head = nodefony.extend({
				'Content-Type': File.mimeType,
				'Content-Length':length,	
				'Content-Disposition' : ' inline; filename="'+File.name+'"'
			},headers);
			var code = 200 ;
		}
		// streamFile
		var response = this.getResponse();
		try {
			var fileStream = fs.createReadStream(File.path, value ? nodefony.extend( options, value) : options);	
		}catch(e){
			throw e ;
		}
		
		//console.log(head);
		fileStream.on("open",function(){
			try {
				response.response.writeHead(code, head); 
				fileStream.pipe(response.response, {
					// auto end response 
					end:false
				});
			}catch(e){
				throw e ;
			}
		});

		fileStream.on("end",function(){
			if (fileStream) {
				try {
					fileStream.unpipe(response.response);
					if (fileStream.fd) {
						fs.close(fileStream.fd);
					}
				}catch(e){
					throw e ;
				}
        		}
			//console.log("END")
			response.end();
		});

		fileStream.on("close",function(){
			response.end();
		});

		response.response.on('close', function(){
			//console.log("close response")
			if (fileStream.fd){
				fileStream.unpipe(response.response);
				fs.close(fileStream.fd);
			}
			response.end();
		 });

		fileStream.on("error",function(error){
			//console.log("pass error callback")
			response.end();
			//throw error ;				
		})
	};

	Controller.prototype.createNotFoundException = function(message){
		var resolver = this.container.get("router").resolveName(this.container, "frameworkBundle:default:404");
		this.context.response.setStatusCode(404) ;
		return resolver.callController( {
			message:message || null 
		} );
	};  

	Controller.prototype.createUnauthorizedException = function(message){
		var resolver = this.container.get("router").resolveName(this.container, "frameworkBundle:default:401");
		this.context.response.setStatusCode(401) ;
		return resolver.callController( {
			message:message || null 
		} );
	};  

	Controller.prototype.createException = function(message){
		var resolver = this.container.get("router").resolveName(this.container, "frameworkBundle:default:500");
		this.context.response.setStatusCode(500) ;
		return resolver.callController( {
			message:message || null 
		} );
	}; 

	Controller.prototype.redirect = function(url ,status){
		if (! url )
			throw new Error("Redirect error no url !!!")
		var result = this.getResponse().redirect(url, status)
		this.notificationsCenter.fire("onResponse", result , this.context);
	};

	Controller.prototype.redirectHttps = function(status){
		return this.context.redirectHttps(301 || status) ;
	};


	Controller.prototype.forward = function(name, param){
		var resolver = this.container.get("router").resolveName(this.container, name);
		return resolver.callController(param );
	};

	Controller.prototype.getUser = function(){
		return this.context.getUser();
	};
	
	Controller.prototype.isAjax = function(){
		return this.getRequest().isAjax();
	};

	Controller.prototype.hideDebugBar = function(){
		this.context.showDebugBar = false;
	};

	Controller.prototype.getRoute = function(){
		return this.context.resolver.getRoute();
	}

		
	Controller.prototype.generateUrl = function(name, variables, absolute){
		if (absolute){
			var context = this.getContext();
			var host = context.request.url.protocol+"//"+context.request.url.host;
			absolute = host;
		}
		var router = this.container.get("router");	
		try {
			return router.generatePath.apply(router, arguments);
		}catch(e){
			throw e ;
		}
	};

	Controller.prototype.htmlMdParser = function(content, options){
		var markdown  = require('markdown-it')(nodefony.extend({
			html: true
		},options))
		try {
			return markdown.render(content)
		}catch (e){
			throw e
		}
	};

	return Controller;
});
