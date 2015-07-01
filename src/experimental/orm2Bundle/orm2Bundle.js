/*
 *
 *
 *
 */
nodefony.registerBundle ("ORM2", function(){

	var Orm = function(kernel, container){
		// load bundle library 
		this.autoLoader.loadDirectory(this.path+"/core");

		this.mother = this.$super;
		this.mother.constructor(kernel, container);

		this.waitBundleReady = true ; 

		var service =  this.get("ORM2");
		service.listen(this, "onOrmReady",function(){
			this.fire("onReady", this, service);	
		});
	}
	return Orm;
});

