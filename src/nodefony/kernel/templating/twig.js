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
	};

	Twig.prototype.extention = "twig";

	Twig.prototype.renderFile = function(file, option, callback){
		if (! option) option = {};
		var env = this.kernelSettings.environment ;
		option.settings = nodefony.extend(true, {}, twigOptions, {
			views :this.rootDir,
			'twig options':{
				cache: ( env === "dev" ) ? false : true 
			}
		});
		var param = nodefony.extend( {nodefony:this.kernelSettings}, option);
		//try {
			return this.engine.renderFile(file.path, param, callback)
		//}catch(e){
		//	throw e ;
		//}
	};

	Twig.prototype.render = function(view, param){
		var Render = this.compile(view)
		try {
			var options = nodefony.extend( {nodefony:this.kernelSettings}, param);
			return Render(options);
		}catch(e){
			throw e ;
		}
	};
	
	Twig.prototype.compile = function(markup, options){
		/*option.settings = nodefony.extend(true, {}, twigOptions, {
			filename :options.path,
			views :this.rootDir,
			'twig options':{
				cache: ( env === "dev" ) ? false : true 
			}
		});*/

		option.settings = nodefony.extend({}, twigOptions, {
			filename :options.path
		});	
		return this.engine.compile(markup, option)
	};

	Twig.prototype.extendFunction = function(){
		return twig.extendFunction.apply(twig, arguments)
	};

	Twig.prototype.extendFilter = function(){
		return twig.extendFilter.apply(twig, arguments)
	
	};

	return 	Twig.herite(nodefony.templates)
		
});



