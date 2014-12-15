/*
 *
 *
 *
 *
 *
 *
 *
 */



stage.register("Model",function(){


	var Result = function(res){
		if (res && stage.typeOf(res) === "array")
			this.datas = res;
		else
			this.datas = [];	
	};
	Result.prototype.push = function(file){
		this.datas.push(file)
	};

	Result.prototype.length = function(){
		return this.datas.length;
	};

	Result.prototype.sort = function(){
	
	};

	Result.prototype.find = function(){
	
	};


	var defaultModelSettings = {
		name:		"stageModel",		// name of model
		design:		null,			// struct of design 
		transport:	null,			// struct transport
		storage:	null,			// struct storage
		ormType:	null,			// ORM type REST , CRUD
		ormKey:		null,			// key to map with ORM
		ormMapper:	null			// class to map with ORM 
	};

	var Model = function(resource, settings){
		this.$super.constructor();
		this.settings = $.extend({}, defaultModelSettings, settings);
		this.transport = new stage.rest(resource); 
	
	}.herite(Result);
	
	
	return Model ;

});
