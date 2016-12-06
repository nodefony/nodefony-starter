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
	
	var Twig = class Twig extends nodefony.templates {

		constructor (container, options){

			super(container, twig, options);

			this.kernelSettings = this.container.getParameters("kernel");
			this.cache = ( this.kernelSettings.environment === "dev"  ) ?  false : true ; 
			twig.cache( this.cache );
			this.rootDir = container.get("kernel").rootDir ;
			container.set("Twig" , this);
			this.version = twig.VERSION ;
			this.name = "Twig" ;
		}

		renderFile (file, option, callback){
			if (! option) var option = {};
			option.settings = nodefony.extend(true, {}, twigOptions, {
				views :this.rootDir,
				'twig options':{
					cache: this.cache 
				}
			});
			try {
				return this.engine.renderFile(file.path, option, callback)
			}catch(e){
				callback(e, null);
			}
		}

		render (view, param){
			var Render = this.compile(view)
			try {
				//var options = nodefony.extend( {nodefony:this.kernelSettings}, param);
				return Render(param);
			}catch(e){
				throw e ;
			}
		}
		
		compile ( file , callback){
			return this.engine.twig({
				path: file.path,	
		        	async:false,
				base:this.rootDir,
				//precompiled:false,
		        	name:file.name,
				load:(template) => {
					callback(null, template)
				},
		        	error:(error) => {
					callback(error, null)
				}
			})
		}

		extendFunction (){
			return twig.extendFunction.apply(twig, arguments)
		}

		extendFilter (){
			return twig.extendFilter.apply(twig, arguments)
		}

	};

	Twig.prototype.extention = "twig";

	return 	Twig ;
		
});



