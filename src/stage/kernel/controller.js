/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

stage.register("Controller",function(){


	var Controller = function(container, module){

		this.notificationsCenter = this.get("notificationsCenter");
		this.kernel = this.get("kernel");	
		this.i18n = this.kernel.i18n;
		this.router = this.kernel.router;
	};

	Controller.prototype.redirect = function(url){
		return this.router.redirect.apply(this.router, arguments)
	};

	/*
	 *
	 *
	 */
	Controller.prototype.forward = function(pattern, args){
		return this.router.forward(pattern, args)
	};

	/*
	 *
	 *
	 */
	Controller.prototype.generateUrl = function(name, variables, absolute){
		if (absolute === true){
			var url = this.router.url().split("#");
			absolute = this.router.url[0];
		}
		return this.router.generateUrl.apply(this.router, arguments);
	};

	Controller.prototype.evalInContext = function(js, context){
		var func = function(context) { 
			var $controller = context;
			return function(js){
				"use strict";
				return eval(js);
			}
		}(this);
		try {
			return func.call( context || this , jQuery.trim( js ));
		}catch(e){
			this.logger("DOM PARSER TWIG ERROR " + e, "ERROR");	
		}
	};


	var tabFxEvent = ["fx-click", "fx-dblclick", "fx-focus", "fx-blur", "fx-mouseover", "fx-mouseout", "fx-mouseenter", "fx-mouseleave", "fx-change"];
	Controller.prototype.domParser = function(domElement){
		var controller = this ;
		domElement.find('[' + tabFxEvent.join('],[') + ']').each(function(index, ele){
			
			var attributes = ele.attributes;
			var jElement = $(ele);
			var ctrl = jElement.closest('[fx-ctrl]');
			if(ctrl.length){
				var pattern = $(ctrl).attr("fx-ctrl") ;
				try {
					var scope = controller.router.resolvePattern(pattern).controller;
				}catch (e){
					controller.logger("DOM PARSER ERROR : " + e , "ERROR")
					return ;
				}
			} else {
				var scope = controller;
			}
			for(var i = 0; i < attributes.length; i++){
				var attribute = attributes[i];
				if(tabFxEvent.indexOf(attribute.name) > -1){
					var ff = function(){
						var content = attribute.value;
						jElement.on(attribute.name.replace('fx-', ''), function(){
							scope.evalInContext(content, this);
						});
					}();
				}
			}
		});
		
	};



	/*
	 *
	 *
	 */
	Controller.prototype.render = function(element, partial, type){
		var ele = $(element);
		try {
			switch (type){
				case "append":
					ele.append(partial) ;
				break;
				case "prepend":
					ele.prepend(partial) ;
				break;
				default:
					ele.empty();
					ele.html(partial);

			}
			return this.domParser(ele);
		}catch(e){
			this.logger("DOM PARSER TWIG ERROR : "+e, "ERROR") ;
		}

	};


	Controller.prototype.renderPartial = function(pattern, obj){
		try {
			var template = this.module.getTemplatePattern(pattern);
			return template.render(obj);
		}catch(e){
			this.logger(e, "ERROR")
		}
	};

	Controller.prototype.set = function(name, value){
		return this.container.set(name, value);	
	};

	Controller.prototype.get = function(name, value){
		return this.container.get(name, value);	
	};

		
	Controller.prototype.setParameters =function(name, value){
		return this.container.setParameters(name, value);	
	};

	Controller.prototype.getParameters = function(name){
		return this.container.getParameters(name);	
	};


	Controller.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.get("syslog");
		if (! msgid) msgid = "MODULE: " +this.module.name +" CONTROLLER: "+this.name ;
		return syslog.logger(pci, severity, msgid,  msg);
	};


	Controller.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	}

	Controller.prototype.fire = function(event){
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};



	return Controller

});



