/*
 *
 *	EJS WRAPPER
 *
 *
 */
var ejs = require("ejs")


nodefony.registerTemplate("ejs" ,function(){



	var Ejs = function(container, options){

		this.mother = this.$super;
		this.mother.constructor(container, ejs, options);

	}
	Ejs.prototype.extention = "ejs"



	Ejs.prototype.renderFile = function(){
		return this.engine.renderFile.apply(this.engine, arguments);
	};


	Ejs.prototype.render = function(view, param){
		var Render = this.compile(view)
		try {
			return Render(param);
		}catch(e){
			console.log(e)
			//this.logger(e);
		}
	};

	Ejs.prototype.renderResponse = function(view, param, response){
		//console.log(arguments);	
	
	};

	Ejs.prototype.compile = function(str){
		return 	this.engine.compile(str, this.settings);
	}

			
	return 	Ejs.herite(nodefony.templates)
		
});

