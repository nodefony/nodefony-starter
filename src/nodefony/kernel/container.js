/*
 *
 *
 *
 *
 *
 */

nodefony.register("Container", function(){


	/*
 	 *
 	 *	CONTAINER CLASS
 	 *
 	 */
	var ISDefined = function(ele){
		if (ele !== null && ele !== undefined )
			return true
		return false;
	}

	var parseParameterString = function(str, value){
		switch( nodefony.typeOf(str) ){
			case "string" :
				return arguments.callee.call(this,str.split(".") , value);
			break;
			case "array" :
				switch(str.length){
					case 1 :
						var ns = Array.prototype.shift.call(str);
						if ( ! this[ns] ){
							this[ns] = value;
						}else{
							if ( ISDefined(value) ){
								this[ns] = value ;
							}else{
								return this[ns];
							}
						}
						return value ;
					break;
					default :
						var ns = Array.prototype.shift.call(str);
						if ( ! this[ns] && ISDefined(value) ){
							this[ns] = {};
						}
						return arguments.callee.call(this[ns], str, value);	
				}
			break;
			default:
				return false;
		}
	};

	var Container = function(services, parameters){
		this.protoService = function(){};
		this.protoParameters = function(){};
		this.scope = {};
		this.services = new this.protoService();
		if (services && typeof services === "object"){
			for (var service in services)
				this.set(service, services[service]);
		}
		this.parameters = new this.protoParameters();
		if (parameters && typeof parameters === "object"){
			for (var parameter in parameters)
				this.set(parameter, parameters[parameter]);
		}

	};
	

	Container.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.get("syslog");
		if (! msgid) msgid = "CONTAINER SERVICES ";
		return syslog.logger(pci, severity, msgid,  msg);
	};

	Container.prototype.set = function(name, object){
		return this.protoService.prototype[name] = object;
	};

	Container.prototype.get = function(name){
		if (name in this.services){
			return this.services[name];
		}
		return null;
		//this.logger("GET : " + name+" don't exist", "WARNING");	
	};

	Container.prototype.has = function(name){
		return this.services[name];
	};

	Container.prototype.addScope = function(name){
		return  this.scope[name] = [];
	}

	Container.prototype.enterScope = function(name){
		var sc = new Scope(name, this)
		var index = this.scope[name].push( sc );
		sc.index = index;
		return sc;
	}

	Container.prototype.leaveScope = function(scope){
    		var sc = this.scope[scope.name].splice(scope.index-1, 1);
    		//delete scope;
		return sc[0].parent;
	};


	Container.prototype.setParameters = function(name, str){
		if (typeof name !== "string"){
			this.logger(new Error("setParameters : container parameter name must be a string"));
			return false;
		}
		if ( ! ISDefined(str) ){
			this.logger(new Error("setParameters : "+name+" container parameter value must be define"));
			return false;
		}
		if ( parseParameterString.call(this.protoParameters.prototype, name, str) === str ){
			return str;
		}else{
			this.logger(new Error("container parameter "+ name+" parse error"));
			return false;
		}
	};

	Container.prototype.getParameters = function(name){
		if (typeof name !== "string"){
			this.logger(new Error("container parameter name must be a string"));
			return false;
		}
		//return parseParameterString.call(this.protoParameters.prototype, name, null);  
		return parseParameterString.call(this.parameters, name, null);  
	};



	/*
 	 *
 	 *	SCOPE CLASS
 	 *
 	 */

	var Scope = function(name, parent){
    		this.name = name;
		this.parent = parent;
    		this.mother = this.$super;
    		this.mother.constructor();
    		this.services = new parent.protoService();
    		this.parameters = new parent.protoParameters();
    		this.scope = parent.scope;
	}.herite(Container);

	Scope.prototype.set = function(name, obj){
    		this.services[name] = obj ;
    		return this.mother.set(name, obj);
	};

	Scope.prototype.setParameters = function(name, str){
		if ( parseParameterString.call(this.parameters, name, str) === str ){
			return this.mother.setParameters(name, str);
		}else{
			this.logger(new Error("container parameter "+ name+" parse error"));
			return false;
		}
	};

	Scope.prototype.leaveScope = function(name){
    		this.mother.leaveScope(this)
	};


	return Container;
});
