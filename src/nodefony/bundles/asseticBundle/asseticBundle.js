/*
 *
 *
 *
 */
nodefony.registerBundle ("assetic", function(){

	var assetic = function(kernel, container){

		// load bundle library 
		this.autoLoader.loadDirectory(this.path+"/core");
		this.container = container ;
		this.webDir =  kernel.rootDir + "/web";

		this.mother = this.$super;
		this.mother.constructor(kernel, container);

		this.kernel.listen(this,"onBoot",function(){
			this.engineTwig =  this.kernel.get("templating").engine ;
			//console.log(this.engineTwig);
			this.createExtendJavascript();

		});
	};
	

	assetic.prototype.generateFileName = function(files){
		var ino ="";
		var tab = [];
		for ( var i=0 ; i < files.length ; i++ ){
			if ( files[i].slice(-1) === '*'  ){
				files[i] = files[i].slice(0, -1);
			}
			var file = new nodefony.fileClass( this.webDir + files[i] ) ;
			tab.push(file) ;
			ino+=file.stats.ino ; 
		}
		return 	{
			hash : ino,
			files : tab
		}
	}

	assetic.prototype.createOutputFile = function(files, output){
		var ret = this.generateFileName( files ) ;
		if ( output  === ""){
			var name = "/js/"+ret.hash+"_assetic.js" ;
			fs.openSync(this.webDir + name, 'w');
			return  {
				name:name,	
				output : new nodefony.fileClass( this.webDir + name ), 
				files:ret.files
			}
		}
		//create file if not exist
		fs.openSync(this.webDir + output, 'w');

		try {
			return  {
				name:output,	
				output : new nodefony.fileClass( this.webDir + output ) ,
				files:ret.files
			}
		}catch(e){
			throw e ;
		}
	}

	assetic.prototype.concatFiles = function(files, outputFile){
		data = "";
		for ( var i=0 ; i < files.length ; i++ ){
			try {
				data+="\n/***** NODEFONY  CONCAT : "+ files[i].name +"  *******/\n" ;
				data += files[i].read()  ;
			}catch(err){
				throw err ;
			}
		}
		outputFile.write( data );
	}

	assetic.prototype.genetateJsFile = function(files, output){

		try {
			var nodeOutput = this.createOutputFile(files, output);
			var res = [] ;
			for ( var i=0 ; i < nodeOutput.files.length ; i++ ){
				switch( nodeOutput.files[i].checkType() ){
					case "File":
						res.push( nodeOutput.files[i] );
					break;
					case "Directory":
						try {
							var finder = new nodefony.finder( {
								path:nodeOutput.files[i].path,
								recurse:true,
								match:/.*\.js$/,
								onFinish:function(error, result){
									if(error){
										throw error ;
									}
									result.getFiles().forEach(function(file){
										res.push(file)	
									});
								}.bind(this)
							});
						}catch(e){
							throw e ;
						}
					break;
					default:
						throw new Error("Asset File must be an file or directory !!");
				}
			}
			
			this.concatFiles( res, nodeOutput.output );
		}catch(error){
			throw error ;
		}
		return nodeOutput ;
	}

	assetic.prototype.createExtendJavascript = function(){
		//TODO
		this.engineTwig.extendFunction("javascripts", function(value, times) {
			console.log(arguments)
			//return new Array(times+1).join(value);
		});


		this.engineTwig.extend(function(Twig) {
    			// example of extending a tag type that would
    			// restrict content to the specified "level"
			
    			Twig.exports.extendTag({
        			// unique name for tag type
        			type: "javascripts",
        			// regex for matching tag
        			regex: /^javascripts\s+(.*)\s*$/m,

        			// what type of tags can follow this one.
        			next: ["endjavascripts"], // match the type of the end tag
        			open: true,
        			compile: function (token) {
            				var expression = token.match["input"];
					var files = [];  
					var filters = [];
					var output = "";
					
					var res = expression.replace(/javascripts/, "");
					res = res.replace(/\s/g, "\n");
					res = res.split("\n" );
					res = res.filter(function(e){ return e === 0 || e });
					//console.log(res);

					for (var i=0 ; i < res.length ; i++){
						var line = res[i].replace(/\s*/g, "");
						//console.log(line)
						if ( line.match(/.*=.*/) ){
							var ret	 = line.split("=");
							//console.log(ret);
							switch ( ret[0]  ){
								case "output" :
								case "OUTPUT" :
									var rep = ret[1].replace(/'|\"|\s*/g, "");
									//console.log(rep)
									output =  rep ;
								break;
								case "filter" :
								case "FILTER" :
									var rep = ret[1].replace(/'|\"|\s*/g, "");
									filters.push( rep );
								break;
								default :
									continue ;
							}
						}else{
							var rep = res[i].replace(/'|\"| /g, "");
							files.push(rep);
						}
					}
					var res = this.genetateJsFile( files , output );
            				// turn the string expression into tokens.
            				token.assetic = {
						output:res.name
            				};

            				delete token.match; // cleanup
            				return token;
        			}.bind(this),
        			parse: function (token, context, chain) {
					context["asset_url"] = token.assetic.output ;
                			output = Twig.parse.apply(this, [token.output, context]);
            				return {
                				chain: chain,
                				output: output
            				};
        			}
    			});

    			// a matching end tag type
    			Twig.exports.extendTag({
        			type: "endjavascripts",
        			regex: /^endjavascripts$/,
        			next: [ ],
        			open: false
    			});
		}.bind(this));


	}

	return assetic;
});


