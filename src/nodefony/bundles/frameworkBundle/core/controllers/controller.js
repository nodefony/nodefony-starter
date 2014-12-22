/*
 *
 *
 *
 *
 *
 */

nodefony.register("controller", function(){

	var Controller = function(container, context){
		this.context = context;
		this.container = container;
		this.notificationsCenter = this.container.get("notificationsCenter");
	}
	
	Controller.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog")
		if (! msgid) msgid = "CONTROLER "+this.name+" ";
		return syslog.logger(pci, severity, msgid,  msg)
	};

	Controller.prototype.getName = function(){
		return this.name
	};

	Controller.prototype.get = function(name){
		return this.container.get(name);
	};

	Controller.prototype.getParameters = function(name){
		return this.container.getParameters(name);
	};

	Controller.prototype.has = function(name){
		return this.container.has(name);
	};

	Controller.prototype.getRequest = function(){
		return this.context.request;
	};

	Controller.prototype.getContext = function(){
		return this.context ;
	};


	Controller.prototype.getResponse = function(content){
		if (content)
			this.context.response.setBody( content );
		return this.context.response;
	};

	Controller.prototype.getORM = function(){
		return this.container.get('ORM');
	};

	Controller.prototype.renderView = function(view, param ){
		var View = this.container.get("httpKernel").getView(view);
		var res = null;
		var content = this.container.get('templating').renderFile(View, param, function(error, result){
			if (error){
				this.logger(error);	
			}else{
				res = result;
			}
 		}.bind(this));
		return res;
	};


	Controller.prototype.renderAsync = function(view, param){
		var response = this.render(view, param);
		this.notificationsCenter.fire("onResponse", response,  this.context );
	};

	Controller.prototype.render = function(view, param){
		var response = null ;
		try {	
			var View = this.container.get("httpKernel").getView(view);
			this.container.get('templating').renderFile(View, param, function(error, result){
				if (error){
					this.notificationsCenter.fire("onError", this.container, error )
				}else{
					this.notificationsCenter.fire("onView", result, this.context )
					response = this.getResponse();
				}
 			}.bind(this));
		}catch(e){
			this.notificationsCenter.fire("onError", this.container, e );
		}
		return response ;
	};

	Controller.prototype.renderResponse = function(data, status , headers ){
		var res = this.getResponse(data);
		if (headers && typeof headers === "object" ) res.setHeaders(headers);
		if (status) res.setStatusCode(status);
		this.notificationsCenter.fire("onResponse", res , this.context);
		//return res;	
	}
	
	Controller.prototype.getUser = function(){
		return this.container.get('security').getUser();
	};

	
	Controller.prototype.redirect = function(url ,status){
		if (! url )
			throw new Error("Redirect error no url !!!")
		var result = this.getResponse().redirect(url, status)
		this.notificationsCenter.fire("onResponse", result , this.context);
	};

	Controller.prototype.isAjax = function(){
		return this.getRequest().isAjax();
	};

	
	Controller.prototype.forward = function(name, param){
		var resolver = this.container.get("router").resolveName(this.container, name);
		resolver.callController(param );
	};
	
	Controller.prototype.generateUrl = function(name, variables, absolute){
		if (absolute){
			var context = this.getContext();
			var host = context.request.url.protocol+"//"+context.request.url.host;
			absolute = host;
		}
		var router = this.container.get("router");	
		return router.generatePath.apply(router, arguments);
	};

	return Controller;
});
