/*
 *
 *	TWIG WRAPPER
 *
 */
var twig = require("twig");

nodefony.registerTemplate("twig", function(){

	var twigOptions = {
		'twig options':{
			async: false,	
			cache:true
		},
		views:null
	}
	
	var Twig = function(container, options){
		this.mother = this.$super;
		this.mother.constructor(container, twig, options);
		twig.cache(false);
		this.rootDir = container.get("kernel").rootDir ;
		this.kernelSettings = this.container.getParameters("kernel");
		container.set("Twig" , this);
	};

	
	Twig.prototype.extention = "twig";

	Twig.prototype.renderFile = function(file, option, callback){
		if (! option) var option = {};
		var env = this.kernelSettings.environment ;
		option.settings = nodefony.extend(true, {}, twigOptions, {
			views :this.rootDir,
			'twig options':{
				cache: ( env === "dev" ) ? false : true 
			}
		});
		try {
			return this.engine.renderFile(file.path, option, callback)
		}catch(e){
			callback(e, null);
		}
	};

	Twig.prototype.render = function(view, param){
		var Render = this.compile(view)
		try {
			//var options = nodefony.extend( {nodefony:this.kernelSettings}, param);
			return Render(param);
		}catch(e){
			throw e ;
		}
	};
	
	Twig.prototype.compile = function( file , callback){
		//console.log(file)
		//console.trace(this.engine.compile)
		//if (! options) var options = {};
		//var env = this.kernelSettings.environment ;
		/*option.settings = nodefony.extend(true, {}, twigOptions, {
			views :this.rootDir,
			'twig options':{
				cache: ( env === "dev" ) ? false : true  ,
			}
		});*/	
		//return this.engine.compile( markup, option);

		return this.engine.twig({
			path: file.path,	
		        async:false,
			base:this.rootDir,
			//precompiled:false,
		        name:file.name,
			load:function(template){
				callback(null, template)
			},
		        error:function(error){
				callback(error, null)
			}
			
		})


	};

	Twig.prototype.extendFunction = function(){
		return twig.extendFunction.apply(twig, arguments)
	};

	Twig.prototype.extendFilter = function(){
		return twig.extendFilter.apply(twig, arguments)
	
	};

	return 	Twig.herite(nodefony.templates)
		
});



