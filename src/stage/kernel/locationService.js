stage.register("location",function(){


	var nativeHistory = !!(window.history && window.history.pushState );
	var PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/;
	var DEFAULT_PORTS = {'http': 80, 'https': 443};



	var changeUrl = function(event){
		var cache = null ;
		var location = this.kernel.locationService ;
		var url = this.url();

		if ( ( url === this.lastUrl && url === this.location.href ) && this.lastUrl !== location.initialUrl){ 
			//console.log(" changeUrl PASS SAME")
			return;
		}

		if ( ! event ){
			this.kernel.logger(" FORCE URL CHANGE BROWER EVENT NOT FIRE" , "WARNING" );
			//console.log(location.url())
			var newUrl = location.url() ;
			this.kernel.notificationsCenter.fire("onUrlChange", newUrl , this.lastHash, url ,cache)
			this.lastUrlr= url;
			this.lastHash = newUrl ;
			return ;
		}
		//console.log("change URL :" + url +" IINIT "+location.initialUrl)
		//console.log("change LAST URL :" + this.lastUrl)
		var parse = location.parse(url);
		//console.log(location)
		if ( ! parse ){
			this.kernel.notificationsCenter.fire("onUrlChange", "", this.lastHash, url,  cache)
			this.lastUrl = "";
			this.lastHash = "";
			return ;
		}

		var newUrl = location.url() ;
		
		this.kernel.notificationsCenter.fire("onUrlChange", newUrl, this.lastHash , url ,cache)
		this.lastUrl = url;
		this.lastHash = newUrl ;
	};

	var browser = function(kernel, settings){
		this.location = window.location;
		this.history = window.History;
		this.lastUrl = this.url();
		this.kernel = 	kernel ;
		$(window).bind('hashchange', changeUrl.bind(this)); 
		//if (nativeHistory){
		//	$(window).bind('popstate', changeUrl.bind(this))
		//}
	};

	browser.prototype.url = function(options){
		if (nativeHistory && options.html5Mode){
			return function(url, replace, state){
				//TODO
				/*if (this.location !== window.location) this.location = window.location;
				if (this.history !== window.History) this.history = window.History;

				if (url){
					this.kernel.logger(replace ? "REPLACE URL : " + url : "CHANGE URL : " + url,"WARNING")
						this.history[replace ? 'replaceState' : 'pushState'](state, '', url);
				}else{
					return this.location.href.replace(/%27/g,"'");	
				}*/
			}
		}else{
			return function(url, replace, state){
				
				if (url){
				if (this.kernel && this.kernel.get("location") )

					if (this.location !== window.location) this.location = window.location;
					var same = ( url === this.lastUrl && url === this.location.href ? true : false );
					if (this.history !== window.history) this.history = window.history;
					this.kernel.logger(replace ? "REPLACE URL : " + url : "CHANGE URL : " + url,"WARNING");
					if ( same ){
						if  (  url === this.kernel.locationService.initialUrl ){
								//FORCE changeUrl 
								changeUrl.call(this)
						}
						return url ;
					}
					if ( replace ){
						this.location.replace(url);	
						return url ;
					}
					return this.location.href = url;				
				}else{
					return this.location.href.replace(/%27/g,"'");	
				}			
			}
		}
	};


	/*
 	 *	CLASS LOCATION
 	 *
 	 */


	var serverBase = function (url) {
		return url.substring(0, url.indexOf('/', url.indexOf('//') + 2));
	};

	var beginsWith = function(begin, whole) {
  		if (whole.indexOf(begin) === 0) {
    			return whole.substr(begin.length);
  		}
	}

	var Location = function(browser, base, kernel, settings){
		this.settings = settings
		this.kernel = kernel;
		this.browser = browser ;
		this.container = this.kernel.container ;
		this.replace = false ;
		
		this.initialUrl = this.browser.url();
		this.base = base
		this.hashPrefix = "#"+this.settings.hashPrefix ;
		this.proto = this.stripFile(this.base);
		this.parseAbsoluteUrl(this.initialUrl);
		this.parse(this.initialUrl);


		// rewrite hashbang url <> html5 url
		//var abs = this.absUrl();
		//if ( abs != this.initialUrl) {
		//	this.browser.url(abs, true);
		//}
	};
	
	Location.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "SERVICE LOCATION "
		return this.kernel.syslog.logger(pci, severity, msgid,  msg);
	};

	Location.prototype.listen = function(){
		return this.kernel.notificationsCenter.listen.apply(this.kernel.notificationsCenter, arguments);
	};

	Location.prototype.fire = function(){
		return this.kernel.notificationsCenter.fire.apply(this.kernel.notificationsCenter, arguments);
	
	};

	Location.prototype.set = function(name, value){
		return this.container.set(name, value);	
	};

	Location.prototype.get = function(name, value){
		return this.container.get(name, value);	
	};

	Location.prototype.absUrl = function(){
		return this._absUrl ;
	};

	Location.prototype.url = function(url){
		if (typeof url === "undefined")
			return this._url;
		var match = PATH_MATCH.exec(url);
		if (match[1]) this.path(decodeURIComponent(match[1]));
		if (match[2] || match[1]) this.search(match[3] || '');
		this.hash(match[5] || '');
	};

	Location.prototype.protocol = function(){
		return this._protocol;	
	};


	Location.prototype.host = function(){
		return this._host;	
	};

	Location.prototype.port = function(){
		return this._port ;	
	};

	Location.prototype.path = function(path){
		if (typeof path === "undefined"){
			return this._path ;
		}
		this._path = path ;
		try {
			this.change();
		}catch(e){
			this.logger(e,"ERROR");
			throw e
		}
		return this._path;
	};

	Location.prototype.search = function(search){
		if (typeof search === "undefined"){
			return this._search ;
		}
		this._search = search ;
		try {
			this.change();
		}catch(e){
			this.logger(e,"ERROR");
			throw e
		}
		return this._search;

		
	};
	
	Location.prototype.hash = function(hash){
		if (typeof hash === "undefined"){
			return this._hash ;
		}
		this._hash = hash ;
		try {
			this.change();
		}catch(e){
			this.logger(e,"ERROR");
			throw e
		}
		return this._hash;
	};	

	Location.prototype.state = function(){
	
	};

	Location.prototype.replace = function(value){
		if (value)
			return  this.replace = value ;	
		return this.replace ;
	};

	Location.prototype.encodePath = function(path) {
  		var segments = path.split('/');
      		var i = segments.length;

  		while (i--) {
    			segments[i] = stage.io.encodeUriSegment(segments[i]);
  		}

  		return segments.join('/');
	};


	Location.prototype.stripFile = function(url){
		return url.substr(0, stripHash(url).lastIndexOf('/') + 1);
	};


	var stripHash = function(url){
		var index = url.indexOf('#');
  		return index == -1 ? url : url.substr(0, index);
	};

	// parsing end URL ex : http://domain.com:port(/path)(?search)(#hash)
	Location.prototype.parseRelativeUrl = function(relativeUrl){
		//console.log("relative :" + relativeUrl)
		var prefixed = (relativeUrl.charAt(0) !== '/');
		if (prefixed) {
			relativeUrl = '/' + relativeUrl;
		}
		var resolve = stage.io.urlToOject(relativeUrl);
		//console.log(resolve)
		this._path = decodeURIComponent(prefixed && resolve.pathname.charAt(0) === '/' ?
			resolve.pathname.substring(1) : resolve.pathname);
		this._search = stage.io.parseKeyValue(resolve.search);
		this._hash = decodeURIComponent(resolve.hash);

		// make sure path starts with '/';
		if (typeof this._path !== "undefined" && this._path.charAt(0) != '/') {
			this._path = '/' + this._path;
		}
		//console.log("PATH:" + this._path)
	};

	// parsing begin URL ex : (http)://(domain.com):(port)
	Location.prototype.parseAbsoluteUrl = function(absoluteUrl){
		var resolve = stage.io.urlToOject(absoluteUrl);
  		this._protocol = resolve.protocol.replace(":", "");
  		this._host = resolve.hostname;
  		this._port = parseInt(resolve.port, 10) || DEFAULT_PORTS[this._protocol] ||null;
	};

	/**
 	 * LocationHashbangUrl represents url
 	 * This object is exposed as $location service when developer doesn't opt into html5 mode.
 	 * It also serves as the base class for html5 mode fallback on legacy browsers.
 	 *
 	 * @constructor
 	 * @param {string} appBase application base URL
 	 * @param {string} hashPrefix hashbang prefix
 	*/
	var LocationHashbangUrl= function(browser, base, kernel, settings) {
		this.mother = this.$super
		this.mother.constructor(browser, base, kernel, settings);
	}.herite(Location);

	LocationHashbangUrl.prototype.parse = function(url){
		//console.log("URL to parse LocationHashbangUrl  :" + url)
		//console.log("base : " + this.base)
		//console.log("beginsWith BASE : "+beginsWith(this.base, url))
		//console.log("beginsWith PROTO  :"+beginsWith(this.proto, url))
		var withoutBaseUrl = beginsWith(this.base, url) || beginsWith(this.proto, url);
		//console.log("withoutBaseUrl : " +withoutBaseUrl)
		var withoutHashUrl = withoutBaseUrl.charAt(0) == '#'
			? beginsWith(this.hashPrefix, withoutBaseUrl)
			: "";

    		if (typeof withoutHashUrl !== "string") {
			this.logger('Invalid url '+url+', missing hash prefix ' +this.hashPrefix , "ERROR");
      			return null; 
    		}
		//console.log("withoutHashUrl : " +withoutHashUrl)
    		this.parseRelativeUrl(withoutHashUrl);
		return this.change();
	};
	
	LocationHashbangUrl.prototype.change = function(){
		var search = stage.io.toKeyValue(this._search);
		//console.log(search)
		//var hash = this._hash ? '#' + stage.io.encodeUriSegment(this._hash) : '';

		var hash = this._hash ? '#' + this._hash : '';

		//console.log(this._path)
		this._url = this.encodePath(this._path) + (search ? '?' + search : '') + hash		
		//var temp = (this._url ? this.hashPrefix + this._url : '').replace("//","/");
		//this._absUrl = this.base + temp;	
		//console.log( this.hashPrefix)
		//console.log( this._url)
		this._absUrl = this.base + (this._url ? "#" + this._url : '');	
		//console.log("URL :"+ this._url)
		//console.log("HASH :"+ this._hash)
		//console.log("ABSURL :"+ this._absUrl)
		//console.log("PATH :"+ this._path)
		return this;
	};


	/**
 	 * LocationHashbangInHtml5Url represents url
 	 * This object is exposed as location service when html5 history api is enabled but the browser
 	 * does not support it.
 	 *
 	 * @constructor
 	 * @param {string} appBase application base URL
 	 * @param {string} hashPrefix hashbang prefix
 	*/
	var LocationHashbangInHtml5Url = function(browser, base, kernel, settings){
	
		this.mother = this.$super
		this.mother.constructor(browser, base, kernel, settings);
	}.herite(LocationHashbangUrl);


	LocationHashbangInHtml5Url.prototype.parse = function(url){
		return this.change();
	};
	
	LocationHashbangInHtml5Url.prototype.change = function(){
		return this;
	};

	/**
 	 * LocationHtml5Url represents an url
 	 * This object is exposed as location service when HTML5 mode is enabled and supported
 	 *
 	 * @constructor
 	 * @param {string} appBase application base URL
 	 * @param {string} basePrefix url path prefix
 	*/
	var LocationHtml5Url= function(browser, base, kernel, settings) {
		this.mother = this.$super
		this.mother.constructor(browser, base, kernel, settings);
	}.herite(Location);


	LocationHtml5Url.prototype.parse = function(url){
		var pathUrl = beginsWith(this.proto, url);
		if (pathUrl){
			this.parseRelativeUrl(pathUrl);
		}
		if (! this._path)
			this._path = "/"
		return this.change();
	};
	
	LocationHtml5Url.prototype.change = function(){
		var search = stage.io.toKeyValue(this._search);
		var hash = this._hash ? '#' + stage.io.encodeUriSegment(this._hash) : '';
		this._url = this.encodePath(this._path) + (search ? '?' + search : '') + hash;
		this._absUrl = this.proto + this._url.substr(1);
		return this
	};

	/*
 	 *	SERVICE LOCATION
 	 */

	var defaultSettings = {
		html5Mode:true,
		hashPrefix:"/"
	};

	var service = function(kernel, settings){
	
		var options = $.extend(defaultSettings, settings)
			
		browser.prototype.url = browser.prototype.url(options);
		var browserService = new browser(kernel, options);
		kernel.set("browser", browserService);
		var initialUrl = browserService.url();
		var baseHref = options.base || "" ;

		if (options.html5Mode) {
			var mode = nativeHistory ? LocationHtml5Url : LocationHashbangInHtml5Url;
			var base = serverBase(initialUrl) + (baseHref || '/');
		}else{
			var mode = LocationHashbangUrl ;
			var base = stripHash(initialUrl);
		}
		
		return new mode(browserService, base, kernel, options);
	}; 
	
	return service;

});





