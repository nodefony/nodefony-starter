/*
 *
 *
 *
 *
 *
 */
//var Promise = require('promise');

nodefony.register("controller", function(){

	var Controller = class Controller {
		constructor (container, context) {
			this.context = context;
			this.container = container;
			this.notificationsCenter = this.container.get("notificationsCenter");
			this.sessionService = this.container.get("sessions");
			this.query = context.request.query ;
			/*this.queryFile = context.request.queryFile;
			this.queryGet = context.request.queryGet;
			this.queryPost = context.request.queryPost;*/
			this.serviceTemplating = this.container.get('templating') ;
		}
	
		logger (pci, severity, msgid,  msg){
			var syslog = this.container.get("syslog");
			if (! msgid) { msgid = "CONTROLER "+this.name+" "; }
			return syslog.logger(pci, severity, msgid,  msg);
		}

		getName (){
			return this.name;
		}

		get (name){
			return this.container.get(name);
		}

		set (key, value){
			return this.container.set(key, value);
		}

		getParameters (name){
			return this.container.getParameters(name);
		}
		
		setParameters (name, str){
			return this.container.setParameters(name, str);
		}

		has (name){
			return this.container.has(name);
		}

		getRequest (){
			return this.context.request;
		}

		getResponse (content){
			if (content){
				this.context.response.setBody( content );
			}
			return this.context.response;
		}

		getContext (){
			return this.context ;
		}

		getMethod (){
			return this.context.getMethod() ;
		}

		startSession (sessionContext, callback){
			return  this.sessionService.start(this.context, sessionContext || "default", callback) ;
		}

		getSession (){
			return this.context.session || null ;
		}

		getFlashBag (key){
			var session = this.getSession() ;
			if (session){
				return session.getFlashBag(key) ;
			}else{
				this.logger("getFlashBag session not started !", "ERROR");
				return null ;
			}
		}

		setFlashBag (key, value){
			var session = this.getSession() ;
			if (session){
				return session.setFlashBag(key, value) ;
			}else{
				return null ;
			}
		}

		getORM (){
			var defaultOrm = this.container.get("kernel").settings.orm ;
			return this.container.get(defaultOrm);
		}

		renderRawView (path, param ){
			var res = null;
			var extendParam = nodefony.extend( {}, param, this.context.extendTwig);
			try{ 
				this.serviceTemplating.renderFile(path, extendParam, (error, result) => {
					if (error || result === undefined){
						if ( ! error ){
							error = new Error("ERROR PARSING TEMPLATE :" + path.path);
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
 				});
			}catch(e){
				throw e ;
			}
			return res;
		}

		renderView (view, param ){

			var res = null;
			var templ = null ;
			var View = null ;
			var extendParam = nodefony.extend( {}, param, this.context.extendTwig);

			if ( this.serviceTemplating.cache ){
				try {
					templ = this.container.get("httpKernel").getTemplate(view);
				}catch(e){
					throw e ;
				}
				try {
					res = templ.render(extendParam) ;
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
				View = this.container.get("httpKernel").getView(view);
			}catch(e){
				throw e ;
			}
			try{ 
				this.serviceTemplating.renderFile(View, extendParam, (error, result) => {
					if (error || result === undefined){
						if ( ! error ){
							error = new Error("ERROR PARSING TEMPLATE :" + view);
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
 				});
			}catch(e){
				throw e ;
			}
			return res;
		}

		renderResponse (data, status , headers ){
			var res = this.getResponse(data);
			if (! res ){
				this.logger("WARNING ASYNC !!  RESPONSE ALREADY SENT BY EXPCEPTION FRAMEWORK","WARNING");
				return ;
			}
			this.notificationsCenter.fire("onView", data, this.context );
			if (headers && typeof headers === "object" ){ res.setHeaders(headers);}
			if (status){ res.setStatusCode(status);}
			this.notificationsCenter.fire("onResponse", res , this.context);
		}

		renderJson ( obj , status , headers){
			var data = null ;
			try {
				data = JSON.stringify( obj ) ;
			}catch(e){
				this.logger(e,"ERROR");
				throw e	;	
			}
			return this.renderResponse( data, status || 200 , nodefony.extend( {}, {
				'Content-Type': "text/json ; charset="+ this.context.response.encoding	
			}, headers ));
		}

		renderJsonAsync (obj , status , headers){
			var response = this.renderJson(obj , status , headers);
			if ( response ){
				this.notificationsCenter.fire("onResponse", response,  this.context );
			}
		}

		renderAsync (view, param){
			var response = this.render(view, param);
			if ( response ){
				this.notificationsCenter.fire("onResponse", response,  this.context );
			}
		}

		render (view, param){
			var response = this.getResponse() ;
			var res = null ;
			if (! response ){
				this.logger("WARNING ASYNC !!  RESPONSE ALREADY SENT BY EXPCEPTION FRAMEWORK","WARNING");
				return ;
			}
			try {
				res = this.renderView(view, param);
				
			}catch(e){
			 	this.context.notificationsCenter.fire("onError", this.context.container, e);
			 	return ;
			}
			if (res !== null ){
				return response ;
			}
			return res ;
		}

		renderFileDownload (file, options, headers){
			//console.log("renderFileDownload :" + file.path)
			var File = null ;
			if (file instanceof nodefony.fileClass ){
				File = file;
			}else{
				if ( typeof file  === "string"){
					File  = new nodefony.fileClass(file);	
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
			//var request = this.getRequest().request;
			var fileStream = null ;

			try {
				fileStream = fs.createReadStream(File.path, options );
			}catch(e){
				this.logger(e, "ERROR");
				throw e ;
			}
			fileStream.on("open",() => {
				try {
					response.response.writeHead(200, head); 
					fileStream.pipe(response.response, {
						// auto end response 
						end:false
					});
				}catch(e){
					this.logger(e, "ERROR");
					throw e ;
				}
			});

			fileStream.on("end",() => {
				if (fileStream) {
					try {
						fileStream.unpipe(response.response);
						if (fileStream.fd) {
							//console.log("CLOSE")
							fs.close(fileStream.fd);
						}
					}catch(e){
						this.logger(e, "ERROR");
						throw e ;
					}
        			}
				response.end();
			});

			fileStream.on("close", () => {
				response.end();
			});

			response.response.on('close', () => {
				if (fileStream.fd){
					fileStream.unpipe(response.response);
					fs.close(fileStream.fd);
				}
				response.end();
			});
			
			fileStream.on("error", (error) =>{
				this.logger(error, "ERROR");
				response.end();
				throw error ;				
			});
		}
			
		renderMediaStream (file , options, headers){
			//console.log("renderMediaStream :" + file.path)
			var File = null ;
			if (file instanceof nodefony.fileClass ){
				File = file;
			}else{
				if ( typeof file  === "string"){
					File  = new nodefony.fileClass(file);	
				}else{
					throw new Error("File argument bad type for renderMediaStream :" + typeof file);
				}	
			}
			if (File.type !== "File"){
				throw new Error("renderMediaStreambad type for  :" +  file);
			}
			if ( ! options ) {options = {};}
			var request = this.getRequest();
			var requestHeaders = request.headers ;
			var range = requestHeaders.range;
			var length = File.stats.size ;
			var code = null ;
			var head = null ;
			var value = null ;
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
				value = nodefony.extend(options , {
					start:start,
					end:end
				});
				//console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);
				head = nodefony.extend({
					'Content-Range': 'bytes ' + start + '-' + end + '/' + length,
					'Accept-Ranges': 'bytes',
					'Content-Length': chunksize,
					'Content-Type': File.mimeType	
				}, headers);
				
				code = 206 ;
			}else{
				head = nodefony.extend({
					'Content-Type': File.mimeType,
					'Content-Length':length,	
					'Content-Disposition' : ' inline; filename="'+File.name+'"'
				},headers);
				code = 200 ;
			}
			// streamFile
			var response = this.getResponse();
			var fileStream = null ;
			try {
				fileStream = fs.createReadStream(File.path, value ? nodefony.extend( options, value) : options);	
			}catch(e){
				this.logger(e, "ERROR");
				throw e ;
			}
			
			//console.log(head);
			fileStream.on("open", () =>{
				try {
					response.response.writeHead(code, head); 
					fileStream.pipe(response.response, {
						// auto end response 
						end:false
					});
				}catch(e){
					this.logger(e, "ERROR");
					throw e ;
				}
			});

			fileStream.on("end", () => {
				if (fileStream) {
					try {
						fileStream.unpipe(response.response);
						if (fileStream.fd) {
							fs.close(fileStream.fd);
						}
					}catch(e){
						this.logger(e, "ERROR");
						throw e ;
					}
        			}
				response.end();
			});

			fileStream.on("close", () => {
				response.end();
			});

			response.response.on('close', () => {
				//console.log("close response")
				if (fileStream.fd){
					fileStream.unpipe(response.response);
					fs.close(fileStream.fd);
				}
				response.end();
		 	});

			fileStream.on("error", (error) =>{
				this.logger(error,"ERROR");
				response.end();
			});
		}

		createNotFoundException (message){
			var resolver = this.container.get("router").resolveName(this.container, "frameworkBundle:default:404");
			this.context.response.setStatusCode(404) ;
			return resolver.callController( {
				message:message || null 
			} );
		}  

		createUnauthorizedException (message){
			var resolver = this.container.get("router").resolveName(this.container, "frameworkBundle:default:401");
			this.context.response.setStatusCode(401) ;
			return resolver.callController( {
				message:message || null 
			} );
		}  

		createException (message){
			var resolver = this.container.get("router").resolveName(this.container, "frameworkBundle:default:500");
			this.context.response.setStatusCode(500) ;
			return resolver.callController( {
				message:message || null 
			} );
		} 

		redirect (url ,status, headers){
			if (! url ){
				throw new Error("Redirect error no url !!!");
			}
			try {
				this.context.redirect(url, status, headers);
			}catch(e){
				throw e ;
			}
		}

		redirectHttps (status){
			return this.context.redirectHttps( status || 301 ) ;
		}

		forward (name, param){
			var resolver = this.container.get("router").resolveName(this.container, name);
			return resolver.callController(param );
		}

		getUser (){
			return this.context.getUser();
		}
		
		isAjax (){
			return this.getRequest().isAjax();
		}

		hideDebugBar (){
			this.context.showDebugBar = false;
		}

		getRoute (){
			return this.context.resolver.getRoute();
		}
			
		generateUrl (name, variables, absolute){
			if (absolute){
				var context = this.getContext();
				var host = context.request.url.protocol+"//"+context.request.url.host;
				absolute = host;
			}
			var router = this.container.get("router");	
			try {
				return router.generatePath.call(router, name, variables, absolute);
			}catch(e){
				throw e ;
			}
		}

		htmlMdParser (content, options){
			var markdown  = require('markdown-it')(nodefony.extend({
				html: true
			},options));
			try {
				return markdown.render(content);
			}catch (e){
				throw e ;
			}
		}
	};

	return Controller;
});
