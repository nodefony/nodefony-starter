/*
 *
 *
 *
 *
 *
 */
var sync = require('async');

nodefony.registerService("less", function(){

	//var regexCss =/^(.+)\.css$/;
	var regexLess =/^(.+)\.less$/;
	//var regexCssComp =/^(.+)(\.|-)min\.css$|^(.+)\.css$/


	//less.logger.addListener(

	var Less = function(kernel, container){
		this.engine = require("less");	
		this.kernel = kernel ;
		this.syslog = this.container.get("syslog") ;
		this.environment = this.kernel.environment ;
		this.filesLess = [];
		this.hasLess = false ;

		this.kernel.listen(this, "onBoot", function(){
			this.settings = container.getParameters("bundles.assetic").less;
			for (var bundle in this.kernel.bundles ){
				try {
					var result = new nodefony.finder({
						path:this.kernel.bundles[bundle].path+"/Resources/public/",
						match:regexLess,
						onFile:function(file){
							var parent = path.basename(file.dirName);
							if (parent === "less"){
								try{
									var txt = "public";
									var aj = txt.length + 1;
									//var ext = this.settings.compress ? ".min.css" :".css" ;
									var ext = ".css" ;

									var cssDir = new nodefony.fileClass(path.dirname(file.dirName)+"/css");
									var dest = cssDir.path + "/"+file.match[1] + ext ;
									var indexof = dest.lastIndexOf(txt) ;
									var pfile = dest.slice(indexof+aj);
									var url = "/"+bundle+"Bundle"+"/"+pfile;

									var index = this.filesLess.push(file); 	
									this.filesLess[url] = {
										file:this.filesLess[index-1],
										source:file.path, 
										dest : dest,
										checkSum:crypto.createHash('md5').update(file.content()).digest("hex")
									}
								}catch(e){
									this.logger(e, "ERROR");
									return;
								}
								this.parse(file, this.filesLess[url].dest);
							}
						}.bind(this),
						onFinish:function(){
							if (this.filesLess.length )
								this.hasLess = true
						}.bind(this)
					});
				}catch(e){
					this.logger("LESS SERVICE "+e,"ERROR")
				}
				
			}
			//console.log(this.filesLess)
		}.bind(this));
	};

	Less.prototype.logger= function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "SERVICE LESS";
		return this.syslog.logger(pci, severity || "DEBUG", msgid,  msg);
	};
	
	Less.prototype.parse = function(file, dest, callback){
		var vendors = process.cwd()+"/web/vendors" ;
		var settings = nodefony.extend({}, this.settings,{
			paths: [".", file.dirName, vendors , process.cwd() ],  // Specify search paths for @import directives
			filename: file.name ,   //'style.less', // Specify a filename, for better error messages
			async: false,
			//logLevel: 2,
			fileAsync: false
		})
		this.engine.render(file.content(),settings,
			function (e, css) {
				if (e){
					var str = "IN FILE : " + e.filename +"\n Line : " + e.line + "\n column : " + e.column + "\n message :" +e.message 
					this.logger(str, "ERROR")
					if (callback) callback(e, null);
				}else{
					try {
						var res = fs.writeFileSync(dest, css.css);
						this.logger("CREATE LESS FILE: " + dest);
						if (callback) callback(null, dest);
					}catch(err){
						this.logger( err,"ERROR");
						if (callback) callback(err, null);
					}
				}
			}.bind(this)
		);
	};

	Less.prototype.handle = function(request, response, type, callback){
			//console.log(type + " :  " + request.url)
			//console.log(file)
		if (request.url in this.filesLess){
			var obj = this.filesLess[request.url];
			//cache
			if (this.settings.cache){
				var checkSum = crypto.createHash('md5').update(obj.file.content()).digest("hex") ;
				if ( checkSum === obj.checkSum ) return false;
				obj.checkSum =  checkSum ;	
			}
			this.parse(obj.file, obj.dest, callback);
			return true;
		}
		return false;
	};



	Less.prototype.filter = function(file){
		try {
			//var file = new nodefony.fileClass( file.path );
			var content = file.content() ;
			//console.log(this.engine.parse);

			var result = this.engine.render(content, {
				async: false,
				fileAsync: false,
				paths: ['.', file.dirName, process.cwd() ],	// Specify search paths for @import directives
				filename: file.name ,		// Specify a filename, for better error messages
			}, function(e, data){
				result = data.css

			});
			console.log(result)
			return result ;


			

			/*var render =  sync(this.engine.render.bind(this.engine));

			var result = null ;
			sync.fiber(function() {
				result = render( content, {
					async: false,
					fileAsync: false,
					paths: ['.', file.dirName, process.cwd() ],	// Specify search paths for @import directives
					filename: file.name ,		// Specify a filename, for better error messages
				})
				console.log(result)
			})
			return result ;

			this.engine.render(file.content(), {
				async: false,
				fileAsync: false,
				paths: ['.', file.dirName, process.cwd() ],	// Specify search paths for @import directives
				filename: file.name ,		// Specify a filename, for better error messages
			})
			.catch(function(){
				reject(e);
			})
    			.then(function(output) {
				resolve( output.css , file.name);
			})*/

		}catch(e){
			console.log(e)
			throw e ;
		}

	}


	return Less ;
});
