/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

stage.register("autoload", function(){

	var genarateId = function(){
		return new Date().getTime();
	};


	var loader = function(){
		
		var AJAX = {
			css : {
				mineType :	"text/css",
				tag:		"style",
				media:		"screen",
				type:		"stylesheet",
				position:	"HEAD"
			},
			js:{
				mineType :	"text/javascript",
				tag:		"script",
				position:	"BODY"
			}
		};

		var SCRIPT = {
			css : {
				mineType :	"text/css",
				tag:		"link",
				media:		"screen",
				type:		"stylesheet",
				position:	"HEAD"
			},
			js:{
				mineType :	"text/javascript",
				tag:		"script",
				position:	"BODY"
			}
		};

		var insert = function(position, script){
			switch(position){
				case "HEAD" :
					var head = document.getElementsByTagName('head')[0];
					head.appendChild(script);
				break;
				case "BODY" :
					var body = document.getElementsByTagName('body')[0]
					body.appendChild(script);
				break;
			}
		};


		return function(src, tag , id, transport, callback){
			//if (tag == "js") transport = "ajax";
			//if (tag == "css") transport = "ajax";
			switch (tag){
				case "js":
					/*var def = AJAX[tag];
					var script = document.createElement(def.tag);
					script.setAttribute('type', def.mineType);
					script.setAttribute('id', id + '_'+tag);
					if ( tag === "css" ){
						script.setAttribute('media', def.media);
					}
					$.ajax(src, {
						async:false,
						//cache:true,
						dataType:"text",
						success:function(data, status, xhr){
							this.cache[id] = script ;
							insert(def.position, script);
							$(script).text(data);
							this.logger("LOAD FILE :" + src,"DEBUG");
							callback(null, xhr);
						}.bind(this),
						error:function(xhr, status, message){
							this.logger(src+" :" +message,"ERROR");
							callback(message, xhr);
						}.bind(this)
					});*/
					 
					return $.ajax({
						url: src,
					        async:false,
						dataType: "script",
						success: function(data, status, xhr){
							//this.logger("LOAD FILE :" + src,"DEBUG");
							callback(null, xhr);	
						}.bind(this),
						error:function(xhr, status, message){
							this.logger(src+" :" +message,"ERROR");
							callback(message, xhr);
						}.bind(this)
					});
					



				break;
				case "css":
					var def = SCRIPT[tag];
					var script = document.createElement(def.tag);
					script.setAttribute('type', def.mineType);
					script.setAttribute('id', id + '_'+tag);
					if ( tag === "css" ){
						script.setAttribute('media', def.media);
						script.href = src;/*+ '?time=' + id;*/
						script.rel = def.type;
						script.async = false;
					}
					if (tag === "js"){
						script.src = src;/*+ '?time=' + id;*/
						script.async = false;
					}
					script.onload = function(){
						this.cache[id] = script;
						this.logger("LOAD FILE :" + src,"DEBUG");
						callback(null, script);
					}.bind(this);
					script.onerror = function(error){
						this.logger(src ,"ERROR");
						callback(error, script);
					}.bind(this);
					insert(def.position, script);
				break;
				default:
					this.logger( new Error ("autoload  type transport error "), "ERROR" );
					return null;
			}
			return script ;
		}
	}();
	

	var defaultSetting = {
		transport:"script",
		prefix:null
	};

	var autoload = function(kernel, settings){
		this.settings = jQuery.extend({}, defaultSetting, settings)
		this.cache = {};
		this.prefix = this.settings.prefix  ;
		this.syslog = kernel.syslog || null ;
		this.transport = this.settings.transport ;
	};

	var regType = /(.*)\.(js)$|(.*)\.(css)$/;
	autoload.prototype.load = function(file, callback){
		var id = genarateId();
		var res = regType.exec(file);
		if ( ! res) {
			this.logger("autoload error type file  ","ERROR")
			return null;
		}
		var script = loader.call(this, file, res[2] || res[4] , id, this.transport, callback)
		return id 
	};

	autoload.prototype.logger = function(pci, severity, msgid,  msg){
		if (this.syslog){
			if (! msgid) msgid = "AUTOLOADER  ";
			return this.syslog.logger(pci, severity , msgid,  msg);
		}else{
			console.log(pci);
		}
	};

	autoload.prototype.unLoad = function(id, callback){
		if (id in this.cache){
			var tag = this.cache[id]
			tag.parentNode.removeChild(tag);
			delete tag;
			delete 	this.cache[id] ;	
			return callback(id);
		}else{
			this.logger("Autoload unLoad no tag find :" +id ,"ERROR")
		}
	};

	return autoload ; 

});
