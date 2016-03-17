
var yaml = require("js-yaml");
var fs = require("fs");
var vm = require("vm");
var util = require('util')

module.exports = function(){

	var self = this;
	// copy require not present see load runInThisContext
	self.require = require;


	/**
	 *  Nodefony autoloader
	 *
	 * @class autoload
	 * @constructor
	 * @module NODEFONY
	 *
	 */
	var autoload = function(){
		//this.prefixes = new Array();
		this.load("vendors/nodefony/core/core.js");
		this.load("vendors/nodefony/core/function.js");
		this.load("vendors/nodefony/core/notificationsCenter.js");
		this.load("vendors/nodefony/syslog/syslog.js");
		this.load("vendors/nodefony/core/fileClass.js");
		this.load("vendors/nodefony/core/finder.js");
		this.load("vendors/nodefony/core/reader.js");
		this.load("vendors/nodefony/core/log.js");
		this.load("vendors/nodefony/core/protocol.js");
		this.load("vendors/nodefony/core/watcher.js");
		this.loadDirectory("vendors/nodefony/kernel");
	};

	var cache = {};

	/**
 	 * @method load
	 *
	 * @param {String} file Path to file
	 *
 	 */
	autoload.prototype.load = function(file, force){
		//console.log(file)
		if (file in cache &&  force !== true){
			this.logger( new Error("AUTOLOADER File : "+file + " already  loaded"),"DEBUG");
			return cache[file];
		}
		if(fs.existsSync(file)){
			var txt = fs.readFileSync(file, {encoding: 'utf8'});
			//console.log('autoaod :' + txt ) ;
			try {
				var script = vm.createScript(txt, file, true);
				cache[file] = script.runInThisContext();
			}catch(e){
				//console.log(util.inspect(e, { showHidden: true, depth: null }));
				console.log(file);
				throw e;
			}
			return cache[file];
		}else{
			throw new Error("AUTOLOADER file :"+file+" not exist !!!!");
		}
	};

	/**
 	 * @method logger
	 *
	 * @param {void} payload payload for log. protocole controle information
 	 * @param {Number || String} severity severity syslog like.
 	 * @param {String} msgid informations for message. example(Name of function for debug)
 	 * @param {String} msg  message to add in log. example (I18N)
 	 */
	autoload.prototype.logger = function(pci, severity, msgid,  msg){
		if (this.syslog){
			if (! msgid) msgid = "AUTOLOADER  ";
			return this.syslog.logger(pci, severity , msgid,  msg);
		}
	};


	var regJs = /.*\.js$/;
	var autoloadEach = function(ele, index, array){
		if ( regJs.exec(ele.path) ){
			var res = this.load.call(self, ele.path)
			this.logger("AUTOLOAD : "+ele.name, "DEBUG");
		}
	};

	/**
 	 * @method loadDirectory
	 *
	 * @param {String} path Path to directory to autoload
	 *
 	 */
	autoload.prototype.loadDirectory = function(path){
		if ( nodefony.finder ){
			var finder = new nodefony.finder({
				path:path,
				onFinish:function(error, res){
					if (error)
						throw error;
					res.forEach(autoloadEach.bind(this))
				}.bind(this)
			});
			return finder.result
		}
		throw new Error("AUTOLOADER finder not found  Load nodefony finder ")
	};

	autoload.prototype.addPrefix = function(prefix){
		//TODO check if prefix exist
		this.prefixes.push(prefix);
	};

	return new autoload();
}();
