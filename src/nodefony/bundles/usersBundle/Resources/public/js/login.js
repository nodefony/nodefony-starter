
var login = function(){


	//UI nodal rapide tres rapide with bootstrap !!!!! 
	var log = function(options){
		
		var html = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
  <div class="modal-dialog">\
    <div class="modal-content">\
      <div class="modal-header">\
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
        <h4 class="modal-title" id="myModalLabel">Login '+options.type+'</h4>\
      </div>\
      <div class="modal-body">'+options.data+'\
      </div>\
    </div><!-- /.modal-content -->\
  </div><!-- /.modal-dialog -->\
</div><!-- /.modal -->';
		$(html).appendTo("body");
		$('#myModal').modal({
			keyboard: false,
			show:true

		})
		$('#myModal').on('hidden.bs.modal', function () {
			$('#myModal').remove()	
		})
	}



	var authenticate = null;

	var statusCode =  function(path){
		return {
                	401: function(request, type, message) {
				var auth = request.getResponseHeader("WWW-Authenticate");
				var res = request.responseText;
				var obj =  {
					"WWW-Authenticate":request.getResponseHeader("WWW-Authenticate"),
					body:request.responseText
				}
				delete authenticate ;
				authenticate = new stage.io.authentication.authenticate(path, obj, {
					ajax:false,
					onRegister:function(authenticate, Authorization){

						var form = $("#login");
						var ele = $(document.createElement("input")) ;
						ele.attr("type","hidden");
						ele.attr("name","authorization");
						ele.attr("id","Authorization");
						ele.val(Authorization);
						form.append(ele);
					},
					onSuccess:function(data, status, obj){
						//console.log("onSuccess");
						//var location = obj.getResponseHeader("Location");
						//console.log( obj );
						//console.log(obj.getAllResponseHeaders())
						//if ( location );
							//window.location.href = location;
						//console.log(obj.getAllResponseHeaders())
						if (data){
							//console.log($(document))
							//$(document).html(data);
							$('html').parent().html(data);
						}
					},
					onError:function(obj, type, message){
						var res = stage.io.getHeaderJSON(obj);
						if (res){
							//console.log(res);
							log({
								type:"ERROR",
								data:res.message || res
							});
						}else{
							//console.log( type +" : "+ message);
							log({
								type:"ERROR",
								data:message
							});
						}
					}
				});
                	}
		};
	};

	var auth = function(path){
		this.path = path ;
		$.ajax({
			url:path,
			method:"GET",		
			cache:false,
			statusCode:statusCode.call(this, path),
			error:function(obj, type, message){
				if (obj.status in statusCode.call(this, path) )
					return ;
			
				if ( ! message){
					if (obj.status === 404 )
						message = "server not found" ;
				}
				log({
					type:"ERROR",
					data:message 
				});
			
			}
		});
	};

	/*$("#valid").bind("click",function(){
		/*var username = $("#email").val();
		var password = $("#password").val();
		if (! username || ! password) 
			return false;
		if (authenticate)
			authenticate.register(username, password);
		return false;

	});*/


	$(document).ready(function(){
		
		var error = $("#error");
		if (error.length) {
			var message = error.html();
			$("#error").remove();
			log({
				type:"ERROR",
				data:message	
			});
		}
		var add = $("#adduser");
		if (add.length) {
			var message = add.html();
			$("#adduser").remove();
			log({
				type:"INFO",
				data:message	
			});
		}

		var path = $("#login").attr("action");
		$("#password").bind("focus", function(){
			new auth( path) ;
		});
		new auth( path) ;


		$("#login").bind("submit",function(e){
			
			var username = $("#email").val();
			var password = $("#password").val();
			if (! username || ! password) 
				return false;
			if (authenticate)
				authenticate.register(username, password);
			//e.preventDefault();
			//return false;
		})

		$("#langs").bind("change",function(){
			window.location.href = "?lang="+$(this).val();
		})



	})


	return auth;

}()






