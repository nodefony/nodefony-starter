require('../css/doc.css');

module.exports = function (){ 

	/*
 	 *
 	 *	Class Bundle App client side  
 	 *
 	 *
 	 */
	var Documentation = class Documentation {
		
		constructor() {
		
			$("#version").change(function(ele){
				window.location = this.value ;	
			});
			$("#langs").change(function(ele){
				window.location.href = "?lang="+this.value
			});

			$.get("/api/git/getCurrentBranch",function(data){
				var ele = $(".branch");
				ele.text(data.branch)  ;

			}).fail(function(error) {
				throw error ;
			});


			var search = $("#inputSearh") ;
			search.bind( "keypress", function( event ) {
					if ( event.keyCode == 13 ){
						event.stopPropagation()
						event.preventDefault()
						$("#buttonSearh").trigger( "click" );
						return false ;
					}
			});
			$("#buttonSearh").click(function(){
				var ele = $("#search");
				var mysearch = search.val() ;
				var spinner = $("#spinner");
				if ( mysearch ){
					$.ajax({
						url: "/documentation/search",
						data:{
							search:mysearch	
						},
						beforeSend:function(){
							console.log("before")
							ele.empty();
							spinner.show();
						},
						success:function(data){
							var text = null ;
							for ( var link in data){
								var reg = new RegExp(mysearch, 'gi');
								var res  = reg.exec( data[link].text ) ;
								if ( res ){
									text = data[link].text.replace(res[0], "<span style='background-color:yellow' >"+res[0]+"</span>" );
								}else{
									continue ;	
								}
								var li = "<li class='list-group-item'>";
								li += "<a href='"+link+"'><span style=''>" + data[link].title +"</span></a>";
								li += "<div>  "+text+" </div>"	
								li += "</li>";
								ele.append(li);
							}
							if (! text ){
								var li = "<li class='list-group-item'>";
								li += "<div>  No result </div>"	
								li += "</li>";
								ele.append(li);
		
							}
						},
						complete:function(){
							spinner.hide();
							console.log("complete")

						}
					}).fail(function() {
						spinner.hide();
						console.log( "ERROR" );
					});

				}else{
					event.stopPropagation()
					event.preventDefault()
					return false ;
				}
			});	
		}
	

		index (bundle, section){
			if (bundle === "nodefony" && section === null ){
				$.get("/api/git/getMostRecentCommit",function(data){
					var ele = $("#commits");
					for (var i = 0 ; i < data.length ; i++){
						//var dt = new Date( data[i].date ) ;
						//var date = dt.toLocaleDateString() + " " + dt.toLocaleTimeString() ;
						var sha= data[i].sha.substr(0,7);
						var shaLink = "https://github.com/nodefony/nodefony/commit/"+sha;

						var date = new Date(data[i].date).toDateString();
						var li = "<li class='list-group-item'>";
						li += "<span style='background-color:blue' class='badge'>"+data[i].author+"</span>" ;
						li += "<a href='"+shaLink+"'><span style=''>" + data[i].msg +"</span></a>";
						li += "<div> commit on "+date+" by "+data[i].author+" </div>"	
						li += "</li>";
						ele.append(li);

					}
				}).fail(function() {
					console.log( "ERROR" );
				})

				/*$.get("/api/git/getStatus",function(data){
					var ele = $("#status");
					for (var i = 0 ; i < data.length ; i++){
						var type = data[i].type[0].replace("WT_","") ;
						var li = "<li class='list-group-item'>";
						switch(type){
							case "INDEX_NEW":
								li += "<span style='background-color:blue' class='badge'>"+type+"</span>" ;
								li += "<span style='cursor:context-menu' title="+data[i].path+"> " + stage.basename( data[i].path ) +"</span>" ;
							break;
							case "NEW":
								li += "<span style='background-color:red' class='badge'>"+type+"</span>" ;
								li += "<span style='cursor:context-menu' title="+data[i].path+"> " + stage.basename ( data[i].path ) +"</span>";
							break;
							default:
								li += "<span  class='badge'>"+type+"</span>" ;
								li += "<span style='cursor:context-menu' title="+ data[i].path +"> " + stage.basename ( data[i].path ) +"</span>";
						}
						li += "</li>";
						ele.append(li);	
					}
				}).fail(function() {
					console.log( "ERROR" );
				});*/

				$.get("https://api.github.com/repos/nodefony/nodefony/issues?state=open",function(data){
					var ele = $("#issues");
					for (var i = 0 ; i < data.length ; i++){
						var date = new Date(data[i].created_at).toDateString();
						var li = "<li class='list-group-item'>";
						li += "<span style='background-color:blue' class='badge'>#"+data[i].number+"</span>" ;
						li += "<a href='https://github.com/nodefony/nodefony/issues/"+data[i].number+"'><span style=''>" + data[i].title +"</span></a>";
						li += "<div> opened on "+date+" by "+data[i].user.login+" </div>"	
						li += "</li>";
						ele.append(li);
					}
				}).fail(function() {
					console.log( "ERROR" );
				})
			}
		}
	};


	return new Documentation();
}();
