stage.register("login",function(){


	var login = function(kernel, form){
	
		this.settings = stage.extend({});

		this.kernel = kernel
		
		this.form = form ;

		this.authenticate = null ;
	}


	login.prototype.logger = function(){
		return this.kernel.logger.apply(this.kernel, arguments)
	}


	login.prototype.request = function request(path, success, error){
		this.path = path ;
		$.ajax({
			url:this.path,
			method:"GET",		
			cache:false,
			statusCode:statusCode.call(this),
			error:function(obj, type, message){
				if (obj.status in statusCode.call(this) )
					return ;
			
				if ( ! message){
					if (obj.status === 404 )
						message = " server not found" ;
				}
				this.logger(message, "ERROR");
			}.bind(this)
		});	
	};

	var statusCode =  function(){
		return {
                	401: function(request, type, message) {
				var auth = request.getResponseHeader("WWW-Authenticate");
				var res = request.responseText;
				var obj =  {
					"WWW-Authenticate":request.getResponseHeader("WWW-Authenticate"),
					body:request.responseText
				}
				delete this.authenticate ;
				this.authenticate = new stage.io.authentication.authenticate(this.path, obj, {
					ajax:false,
					onRegister:function(authenticate, Authorization){
						var ele = $(document.createElement("input")) ;
						ele.attr("type","hidden");
						ele.attr("name","Authorization");
						ele.attr("id","Authorization");
						ele.val(Authorization);
						this.form.append(ele);
					}.bind(this),
					onSuccess:function(data, status, obj){
						if (data){
							$('html').parent().html(data);
						}
					},
					onError:function(obj, type, message){
						var res = stage.io.getHeaderJSON(obj);
						if (res){
							this.logger(this.path+ " :  "+res.message || res, "ERROR" ) ; 
						}else{
							this.logger(this.path+ " :  " + message, "ERROR" ) ; 
						}
					}.bind(this)
				});
                	}.bind(this)
		};
	};

	return login;

})
