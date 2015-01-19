/*
 *
 *
 *
 *
 *
 */

nodefony.register("controller", function(){

	var Controller = function(container, context){
		this.context = context;
		this.container = container;
		this.notificationsCenter = this.container.get("notificationsCenter");
	};
	
	Controller.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog")
		if (! msgid) msgid = "CONTROLER "+this.name+" ";
		return syslog.logger(pci, severity, msgid,  msg)
	};

	Controller.prototype.getName = function(){
		return this.name
	};

	Controller.prototype.get = function(name){
		return this.container.get(name);
	};

	Controller.prototype.getParameters = function(name){
		return this.container.getParameters(name);
	};

	Controller.prototype.has = function(name){
		return this.container.has(name);
	};

	Controller.prototype.getRequest = function(){
		return this.context.request;
	};

	Controller.prototype.getContext = function(){
		return this.context ;
	};

	Controller.prototype.getResponse = function(content){
		if (content)
			this.context.response.setBody( content );
		return this.context.response;
	};

	Controller.prototype.getORM = function(){
		return this.container.get('ORM');
	};

	Controller.prototype.renderView = function(view, param ){
		var View = this.container.get("httpKernel").getView(view);
		var res = null;
		try{ 
			this.container.get('templating').renderFile(View, param, function(error, result){
				if (error || result === undefined){
					this.logger(error);	
					this.notificationsCenter.fire("onError", this.container, error );
				}else{
					try {
						this.notificationsCenter.fire("onView", result, this.context )
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
		if (headers && typeof headers === "object" ) res.setHeaders(headers);
		if (status) res.setStatusCode(status);
		this.notificationsCenter.fire("onResponse", res , this.context);
	};

	Controller.prototype.renderAsync = function(view, param){
		var response = this.render(view, param);
		if ( response )
			this.notificationsCenter.fire("onResponse", response,  this.context );
	};

	Controller.prototype.render = function(view, param){
		var res = this.renderView(view, param);
		if (res !== null ){
			return this.getResponse() ;
		}
		return res ;
	};

	Controller.prototype.renderFileDownload = function(file, options, headers){
		
		if (file instanceof nodefony.fileClass ){
			var File = file;
		}else{
			if ( typeof file  === "string"){
				var File  = new nodefony.fileClass(file);	
			}else{
				throw new Error("File argument bad type for renderFileDownload :" + typeof file);
			}	
		}
		var head = nodefony.extend({
			'Content-Disposition': 'attachment; filename="'+File.name+'"',
			"Expires": "0",
			'Content-Description': 'File Transfer',
			'Content-Type': File.mimeType
		}, headers);

		var response = this.getResponse().response;
		var fileStream = fs.createReadStream(File.path, options );
		fileStream.on("open",function(){
			if ( !  response.headersSent ){
				response.writeHead(200, head); 
				fileStream.pipe(response, {
					// auto end response 
					end:true
				});
			}
		});
		response.on('close', function() {
			if (fileStream) {
            			fileStream.unpipe(response);
            			if (fileStream.fd) {
					//console.log("CLOSE")
                			fs.close(fileStream.fd);
            			}
        		}
		});
		fileStream.on("error",function(error){
			throw error ;				
		});
		
	};
		
	Controller.prototype.renderMediaStream = function(file , options, headers){
		if (file instanceof nodefony.fileClass ){
			var File = file;
		}else{
			if ( typeof file  === "string"){
				var File  = new nodefony.fileClass(file);	
			}else{
				throw new Error("File argument bad type for renderMediaStream :" + typeof file);
			}	
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
				'Content-Disposition:' : ' inline; filename="'+File.name+'"'
			},headers);
			var code = 200 ;
		}
		// streamFile
		var response = this.getResponse().response;
		var fileStream = fs.createReadStream(File.path, value || options);	
		response.on('close', function() {
			if (fileStream) {
            			fileStream.unpipe(response);
            			if (fileStream.fd) {
					//console.log("CLOSE")
                			fs.close(fileStream.fd);
            			}
        		}
		});
		
		fileStream.on("open",function(){
			if ( !  response.headersSent ){
				response.writeHead(code, head); 
				fileStream.pipe(response, {
					// auto end response 
					end:true
				});
			}
		});
		fileStream.on("error",function(error){
			throw error ;				
		})
	};

	Controller.prototype.redirect = function(url ,status){
		if (! url )
			throw new Error("Redirect error no url !!!")
		var result = this.getResponse().redirect(url, status)
		this.notificationsCenter.fire("onResponse", result , this.context);
	};

	Controller.prototype.forward = function(name, param){
		var resolver = this.container.get("router").resolveName(this.container, name);
		resolver.callController(param );
	};

	Controller.prototype.getUser = function(){
		return this.container.get('security').getUser();
	};
	
	Controller.prototype.isAjax = function(){
		return this.getRequest().isAjax();
	};
		
	Controller.prototype.generateUrl = function(name, variables, absolute){
		if (absolute){
			var context = this.getContext();
			var host = context.request.url.protocol+"//"+context.request.url.host;
			absolute = host;
		}
		var router = this.container.get("router");	
		return router.generatePath.apply(router, arguments);
	};

	return Controller;
});
