/*
 *
 *
 *
 *
 *
 */
//var Promise = require('promise');

nodefony.register("controller", function(){

	var Controller = class Controller extends nodefony.Service {
		constructor (container, context) {

			super(null , container, container.get("notificationsCenter") ) ;
			this.name= "CONTROLER "+this.name ;
			this.context = context;
			this.sessionService = this.get("sessions");
			this.query = context.request.query ;
			this.queryFile = context.request.queryFile;
			this.queryGet = context.request.queryGet;
			this.queryPost = context.request.queryPost;
			this.serviceTemplating = this.get('templating') ;
			this.httpKernel = this.get("httpKernel") ;
			this.response = this.context.response ; 
			this.request = this.context.request ; 
		}
	
		getRequest (){
			return this.request;
		}

		getResponse (content){
			if ( content){
				this.response.setBody( content );
			}
			return this.response;
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
			var defaultOrm = this.kernel.settings.orm ;
			return this.get(defaultOrm);
		}

		renderResponse (data, status , headers ){
			var res = this.getResponse(data);
			if (! res ){
				this.logger("WARNING ASYNC !!  RESPONSE ALREADY SENT BY EXPCEPTION FRAMEWORK","WARNING");
				return ;
			}
			this.fire("onView", data, this.context );
			if (headers && typeof headers === "object" ){ res.setHeaders(headers);}
			if (status){ res.setStatusCode(status);}
			this.fire("onResponse", res , this.context);
			return res ;
		}

		renderJson ( obj , status , headers){
			return new Promise ( (resolve, reject) =>{
				try {
					resolve( this.renderJsonSync(obj , status , headers) )
				}catch(e){
					reject(e);	
				}
			});
		}

		renderJsonAsync (obj , status , headers){
			return this.renderJson(obj , status , headers).then( (result) => {
				this.fire("onResponse", this.response,  this.context );
				return result ;
			}).catch((e)=>{
				if (this.response.response.headersSent || this.context.timeoutExpired ){
					return ;
				}
				this.context.promise = null ;
				this.fire("onError", this.context.container, e);
			});
		}

		renderJsonSync ( obj , status , headers){
			var data = null ;
			try {
				data = JSON.stringify( obj ) ;
			}catch(e){
				this.logger(e,"ERROR");
				throw e	;	
			}
			var response = this.getResponse(data);
			if (! response ){
				this.logger("WARNING ASYNC !!  RESPONSE ALREADY SENT BY EXPCEPTION FRAMEWORK","WARNING");
				return ;
			}
			this.fire("onView", data, this.context );
			response.setHeaders(nodefony.extend( {}, {
				'Content-Type': "text/json ; charset="+ this.response.encoding	
			}, headers ))
			if (status){ response.setStatusCode(status);}
			return response ;
		}

		render (view, param){
			if ( ! this.response ){
				this.logger("WARNING ASYNC !!  RESPONSE ALREADY SENT BY EXPCEPTION FRAMEWORK","ERROR");
				return ;
			}
			try {
				return this.renderViewAsync(view, param);
				
			}catch(e){
			 	this.fire("onError", this.context.container, e);
			}
		}

		// 
		/*render (view, param){
			if ( ! this.context.response ){
				this.logger("WARNING ASYNC !!  RESPONSE ALREADY SENT BY EXPCEPTION FRAMEWORK","ERROR");
				return ;
			}
			try {
				
				if ( this.context.promise ){
					this.context.promise.then( this.renderViewAsync(view, param) );
				}
				this.context.promise = this.renderViewAsync(view, param).then( (result) => {

					try {
						this.fire("onResponse", this.context.response, this.context);
					}catch(e){
						if (this.context.response.response.headersSent ||  this.context.timeoutExpired ){
							return ;
						}
						this.fire("onError", this.context.container, e);
					}
					return result ;
				
				} ).catch((e)=>{
					if (this.context.response.response.headersSent || this.context.timeoutExpired ){
						return ;
					}
					this.context.promise = null ;
					this.fire("onError", this.context.container, e);
				});
				
			}catch(e){
			 	this.fire("onError", this.context.container, e);
			}
		}*/
		
		renderSync (view, param){
			var response = this.getResponse() ;
			if (! response ){
				this.logger("WARNING ASYNC !!  RESPONSE ALREADY SENT BY EXPCEPTION FRAMEWORK","WARNING");
				return ;
			}
			try {
				this.renderView(view, param);
				
			}catch(e){
			 	this.fire("onError", this.context.container, e);
			 	return ;
			}
			return response ;
		}

		renderAsync (view, param){
			return this.render(view, param).then( (result) => {
				this.fire("onResponse", this.response,  this.context );
				return result ;
			}).catch((e)=>{
				if (this.response.response.headersSent || this.context.timeoutExpired ){
					return ;
				}
				this.context.promise = null ;
				this.fire("onError", this.context.container, e);
			});
		}

		renderViewAsync (view, param){
			try {
				var extendParam = this.context.extendTwig(param);

				if ( this.serviceTemplating.cache ){
					var templ = null ;
					var res = null ;
					return new Promise ( (resolve, reject) =>{
						var res = null ;	
						if ( this.serviceTemplating.cache ){
							try {
								templ = this.httpKernel.getTemplate(view);
							}catch(e){
								return reject( e );
							}
							try {
								res = templ.render(extendParam) ;
								try {
									this.fire("onView", res, this.context, templ.path , param);
									resolve( res );
								}catch(e){
									return reject( e );
								}
							}catch(e){
								return reject( e ) ;
							}
						}
					});
				}
				return new Promise ( (resolve, reject) =>{
					try {
						var View = this.httpKernel.getView(view);
					}catch(e){
						return reject( e );
					}
					try{ 
						this.serviceTemplating.renderFile(View, extendParam, (error, result) => {
							if (error || result === undefined){
								if ( ! error ){
									error = new Error("ERROR PARSING TEMPLATE :" + view);
								}
								return reject(error) ;
							}else{
								try {
									this.fire("onView", result, this.context, View , param);
									return resolve( result );
								}catch(e){
									return reject( error );
								}
							}
 						});
					}catch(e){
						return reject( e );
					}
				});
			}catch(e){
				throw e ;
			}
		}

		renderView (view, param ){
			var res = null;
			var templ = null ;
			var View = null ;
			var extendParam = this.context.extendTwig(param);
			if ( this.serviceTemplating.cache ){
				try {
					templ = this.httpKernel.getTemplate(view);
				}catch(e){
					throw e ;
				}
				try {
					res = templ.render(extendParam) ;
					try {
						this.fire("onView", res, this.context, null , param);
					}catch(e){
						throw e ;
					}
				}catch(e){
					throw e ;
				}
				return res ;
			}
			try {
				View = this.httpKernel.getView(view);
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
							this.fire("onView", result, this.context, View , param);
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

		renderRawView (path, param ){
			var res = null;
			var extendParam = this.context.extendTwig(param);
			try{ 
				this.serviceTemplating.renderFile(path, extendParam, (error, result) => {
					if (error || result === undefined){
						if ( ! error ){
							error = new Error("ERROR PARSING TEMPLATE :" + path.path);
						}
						throw error ;
					}else{
						try {
							this.fire("onView", result, this.context, path , param);
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
			this.response.setStatusCode(404) ;
			this.fire("onError", this.container, message );
			
		}  

		createUnauthorizedException (message){
			this.response.setStatusCode(401) ;
			this.fire("onError", this.container, message );
			
		}  

		createException (message){
			this.response.setStatusCode(500) ;
			this.fire("onError", this.container, message );
		} 

		redirect (url ,status, headers){
			if (! url ){
				throw new Error("Redirect error no url !!!");
			}
			this.context.isRedirect = true ;
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
			var resolver = this.get("router").resolveName(this.container, name);
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
			var router = this.get("router");	
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
