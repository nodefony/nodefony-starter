var elasticsearch = require('elasticsearch');

nodefony.registerBundle ("documentation", function(){

	var classElasticLog = function(config){
		//console.log(config)
		this.logger("INIT SYSLOG ELASTIC ", "INFO")
	};

	classElasticLog.prototype.error = function(data, ele){
		try{
			if ( ele && ele !== "undefined" ){
				try {
					var str = JSON.stringify(ele) ;
					var res = data + " : "  + str ? str : "" ;
				}catch(e){
					var res = data ;
				}
			}else{
				var res =  data + " : "  + JSON.stringify(ele) ;
			}
			return this.logger(res,"ERROR");
		}catch(e){
			console.log(e)
		}
	};

	classElasticLog.prototype.warning = function(data, ele){
		try{
			if ( ele && ele !== "undefined" ){
				try {
					var str = JSON.stringify(ele) ;
					var res = data + " : "  + str ? str : "" ;
				}catch(e){
					var res = data ;
				}
			}else{
				var res =  data + " : "  + JSON.stringify(ele) ;
			}
			return this.logger(res,"WARNING");
		}catch(e){
			console.log(e)
		}
	};

	classElasticLog.prototype.info = function(data, ele){
		try{
			if ( ele && ele !== "undefined" ){
				try {
					var str = JSON.stringify(ele) ;
					var res = data + " : "  + str ? str : "" ;
				}catch(e){
					var res = data ;
				}
			}else{
				var res =  data + " : "  + JSON.stringify(ele) ;
			}
			return this.logger(res, "INFO");
		}catch(e){
			console.log(e)
		}
	};

	classElasticLog.prototype.debug = function(data, ele){
		try{
			if ( ele && ele !== "undefined" ){
				try {
					var str = JSON.stringify(ele) ;
					var res = data + " : "  + str ? str : "" ;	
				}catch(e){
					var res = data ;
				}
			}else{
				var res =  data + " : "  + JSON.stringify(ele) ;
			}
			return this.logger(res ,"DEBUG");
		}catch(e){
			console.log(e)
		}
	};

	classElasticLog.prototype.trace = function(method, requestUrl, body, responseBody, responseStatus){
		try{
			var ele = {
				method: method,
				url:requestUrl,
				body:body
			}
			if ( ele  ){
				try {
					var str = JSON.stringify(ele) ;
					var res = data + " : "  + str ? str : "" ;
				}catch(e){
					var res = data ;
				}
			}else{
				var res =  method + " : "  + requestUrl ;
			}
			return this.logger(res ,"NOTICE");
		}catch(e){
			console.log(e)
		}
	};
	
	/**
	 *	The class is a **`documentation` BUNDLE** .
	 *	@module App
	 *	@main App
	 *	@class documentation
	 *	@constructor
	 *	@param {class} kernel
	 *	@param {class} container
	 *	
	 */
	var documentation = function(kernel, container){

		// load bundle library 
		this.autoLoader.loadDirectory(this.path+"/core");

		this.mother = this.$super;
		this.mother.constructor(kernel, container);
		this.elasticReady = false ; 
		this.elastic = null ;

		/*
		 *	If you want kernel wait documentationBundle event <<onReady>> 
		 *
		 *      this.waitBundleReady = true ; 
		 */	
		

		if ( this.settings.elasticSearch && this.settings.elasticSearch.host ){

			this.waitBundleReady = true ;
			classElasticLog.prototype.logger = function(pci, severity, msgid,  msg){
				var syslog = this.container.get("syslog");
				if (! msgid) msgid = "ELASTIC SEARCH ";
				return syslog.logger(pci, severity, msgid,  msg)	
			}.bind(this) ;

			this.elastic = new elasticsearch.Client({
				host: this.settings.elasticSearch.host,
				log: classElasticLog.bind(this) 
			});
			this.pingElastic(function(error){
				if (error) {
					this.logger(" elasticsearch cluster is down!", "ERROR") ;
					this.elasticReady = false ; 
					this.fire("onReady", this, this.elastic);
				} else {
					this.logger(" elasticsearch cluster is UP!", "DEBUG") ;
					this.elasticReady = true ;  
					this.fire("onReady", this, this.elastic);

					
					this.createIndexElastic(function(error, response){
						if (error){
							return this.log(error);
						}
						this.elastic.transport.log.debug("INDEX DOCUMENTATION NODEFONY OK " ) ;	
						//this.elastic.transport.log("CREATE")
					}.bind(this))
				}
			}.bind(this));
		}else{
			this.logger("ELASTIC SEARCH DISABLED : webcrawler search in memory !!  try to install elastic server  ", "WARNING")
		}
	};

	documentation.prototype.pingElastic = function(callback){
		this.elastic.ping({
  			requestTimeout: 3000,
		}, function (error) {
			callback(error)
		}.bind(this));
	}

	documentation.prototype.createIndexElastic = function(callback){
		this.elastic.exists({
  			index: 'nodefony',
  			type: 'documentation',
  			id: 1
		}, function (error, exists) {
  			if (exists === true) {
				callback(null, exists)
  			} else {
				this.elastic.create({
  					index: 'nodefony',
					type: 'documentation',
  					id: '1',
					body: {
						title: 'Documentation',
					}
				}, function (error, response) {
  					callback(error, response)
				});
  			}
		}.bind(this));
	};

	documentation.prototype.deleteIndexElastic = function(callback){
		this.elastic.delete({
  			index: 'nodefony',
  			type: 'documentation',
  			id: '1'
		}, function (error, response) {
  			callback(error, response);
		});
	}

	return documentation;
});
