var fs = require('fs');
var url = require('url');


var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('lodash');
var https = require('https');



nodefony.registerService("webCrawler", function(){


	var webCrawler = function(container, kernel){
		this.container = container ;
		this.kernel = kernel ;
		this.syslog = this.container.get("syslog");
		this.crawled = {};
		this.elastic = null ;
		
	
		this.kernel.listen(this, "onReady", function(){
			this.elastic = this.kernel.getBundle("documentation").elastic;
		})	
	}

	webCrawler.prototype.logger = function(pci, severity, msgid,  msg){
		//var syslog = this.container.get("syslog");
		if (! msgid) msgid = "SERVICE WEB CRAWLER";
		return this.syslog.logger(pci, severity, msgid,  msg);
	};



	webCrawler.prototype.siteAll = function(urlBase, search ,context, callback ){

		var recurse = 0 ;
		var Link = url.parse(urlBase);

		this.base = Link.host;

		this.protocol = Link.protocol ? Link.protocol+"//" : 'http://' ;

		if ( this.elastic ){
			myLoop.call(this, urlBase, context, function(error, crawled){
				console.log("PASSS")
			});
		}else{
			myLoop.call(this, urlBase, context, function(error, crawled){
				//console.log(crawled)
				var obj = {} ;
				try {
					for ( var page in crawled){
						
						if ( crawled &&   crawled[page] && crawled[page].page && crawled[page].page.selector ){
							var text = crawled[page].page.selector("body").text() ;
							if ( ! text ){
								continue ;
							}
							//var index = text.indexOf(search) ;
							var reg = new RegExp(search, 'gi')
							var index = text.search(reg);
							if ( index !== -1 ){
								obj[ crawled[page].page.url ] = {
									text : "..." + text.substring( index - 100 , index + 100 ) + "..." ,
									title: crawled[page].page.title
								}
							}	
						}	
					}
				}catch(e){
					this.logger(e, "ERROR");	
				}
				callback(obj)
			}.bind(this),recurse);
		}
	}

	var makeRequestHttp = function(link, context ,callback){

		this.logger("REQUEST : " + link, "INFO");
		var myurl = url.parse( link ) 
		if (  ! this.settingsHttps ) {
			this.settingsHttps =  this.get("httpsServer").settings ;
		}
		// cookie session 
		var headers = {}
		if ( context.session ){
			headers["Cookie"] = context.session.name+"="+context.session.id ;
		}
		var options = {
  			hostname: myurl.hostname,
  			port: myurl.port,
			path:myurl.path,
  			method: 'GET',
			headers:headers
		}	
		var wrapper = http.request ;
		//console.log(options)

		// https 
		if (myurl.protocol === "https:"){
			// keepalive if multiple request in same socket
			var keepAliveAgent = new https.Agent({ keepAlive: true });

			// certificat
			nodefony.extend(options,{
				key: fs.readFileSync( this.kernel.rootDir + "/" +this.settingsHttps.certificats.key ),
				cert:fs.readFileSync( this.kernel.rootDir + "/" +this.settingsHttps.certificats.cert ),
				rejectUnauthorized: false,
				requestCert: true,
				agent: keepAliveAgent
			});
			var wrapper = https.request ;
		}else{
			// keepalive
			var keepAliveAgent = new http.Agent({ keepAlive: true });
			options.agent = keepAliveAgent;	
		}
	
		var req = wrapper(options, function(res) {
			var bodyRaw = "";
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				//this.logger( chunk, "DEBUG");
				bodyRaw += chunk ;
			}.bind(this));

			res.on('end', function(){
				parseLink.call(this, link, bodyRaw ,  callback ) ;
			}.bind(this))

		}.bind(this));

		req.on('error', function(e) {
			this.logger('Problem with request: ' + e.message, "ERROR");
			
		}.bind(this));

		req.end();
	}

	var parseLink = function(crawlUrl, body, callback){

		var pageObject = {};
		pageObject.links = [];

		if ( /^\//.test( crawlUrl ) ){
			pageObject.url = this.protocol + this.base + crawlUrl ;	
		}else{
			pageObject.url = crawlUrl;	
		}

		var $ = cheerio.load(body,{
			ignoreWhitespace: true
		});
		pageObject.title = $('title').text();
		pageObject.selector = $;

		// find link
		$('a').each(function(i, elem){
			//console.log(elem.attribs.href)
			if ( elem.attribs.href === "#" || elem.attribs.href === "/") {
				return ;
			}
			if ( /^\//.test( elem.attribs.href ) ){
				var href = url.parse( this.protocol + this.base + elem.attribs.href )	
			}else{
				if ( elem.attribs.href ){
					var href = url.parse( elem.attribs.href	)
				}else{
					var href = null ;	
				}
			}
			if ( href ){
				pageObject.links.push({linkText: $(elem).text(), linkUrl: href  })
			}
		}.bind(this));
		callback(null, pageObject);
	}


	var myLoop = function(link, context, finish, recurse){
		
		if (  this.crawled[ link ] ){
			if ( this.crawled[ link ].page ){
				finish(null, this.crawled)
				return ;
			}
		}
		makeRequestHttp.call(this, link , context, function(error, pageObject){
			
			if ( error  ){ return }
			
			this.crawled[ pageObject.url ] = [];
			this.crawled[ pageObject.url ]["page"] = pageObject ;
			
			async.eachSeries(pageObject.links, function(item, cb){
				if (item.linkUrl){
					// test if the url actually points to the same domain
					if( item.linkUrl.host == this.base ){
						if ( ! item.linkUrl.hash ){
							this.crawled[ pageObject.url ].push(item.linkUrl.href)   ;
						}
					}
				}
				cb(null);
			}.bind(this),
			function(error){
				if ( ! error ){
					
					for( var i= 0 ; i < this.crawled[pageObject.url].length ; i++  ){
						//console.log( this.crawled[pageObject.url] )
						if (this.crawled[pageObject.url][i] in this.crawled){
							continue ;
						}else{
							recurse++ ;
							this.crawled[ this.crawled[pageObject.url][i] ]  = [];
							myLoop.call(this, this.crawled[pageObject.url][i], context, function(){
								recurse-- ;	
								if ( recurse === 0 ){
									//console.log("FINISH")
									finish(error, this.crawled)
								}
							}.bind(this), 0);

						}
					}
				}
				if ( recurse === 0 ){
					//console.log( "FINISH 2" )
					finish(error, this.crawled)
				}
				
			}.bind(this));	
		}.bind(this))
		
	}

	return webCrawler


});

