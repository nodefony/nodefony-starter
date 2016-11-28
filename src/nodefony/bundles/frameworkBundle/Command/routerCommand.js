/*
 *
 *
 *
 *
 *
 *
 */

//var asciitable = require("asciitable");

var AsciiTable = require('ascii-table');

nodefony.registerCommand("router",function(){


	var router = class router {

		constructor(container, command, options ){
		
			this.router = this.container.get("router");

			//console.log(arguments);
			var arg = command[0].split(":");
			//Array.prototype.shift.call(arg)
			switch ( arg[1] ){
				case "generate" : 
					switch ( arg[2] ){
						case "routes":
							this.getRoutes(null, true);
						break;
						case "route":
							if (command[1]){
								var ret = this.getRoutes(command[1], true);
							}else{
								this.logger(new Error(command[0] + " must have route name"),"ERROR")
							}
						break;
						default:
							this.showHelp()
					}
				break;
				case "match":
					if ( arg[2] === "url" ){
						if (command[1])
							this.matchRoutes(command[1]);
						else
							this.logger(new Error(command[0] + " must have url  to match"),"ERROR")
					}
				break;
				default:
					this.showHelp()
			}
			this.terminate();
		}

		getRoutes (name, display){
			var ele = this.router.getRoutes(name);
			if (ele && display){
				if (nodefony.typeOf(ele) === "object")
					ele = [ele];
				try {
					this.displayTable("ROUTES",ele);	
				}catch(e){
					console.log(e)
				}
			}
			return ele;
		};

		/*router.prototype.displayTable = function(title, ele){
			if (! ele) return this.logger("route not exist","ERROR");
			var options = {
				skinny: true,
				//intersectionCharacter: "+",
				columns: [
					{field: "nb",  name: "NB"},
					{field: "name", name: "\033[34mROUTE\033[0m"},
					{field: "path",  name: "PATH"},
					{field: "variables", name: "VARIABLES"},
					{field: "host",  name: "HOST"},
					{field: "bundle",  name: "BUNDLE"},
					{field: "controller",  name: "CONTROLLER"},
					{field: "action",  name: "ACTION"},
					{field: "options", name: "OPTIONS"},
					{field: "schemes", name: "SCHEMES"},
					{field: "pattern", name: "PATTERN"},
					{field: "firstMatch", name: "FIRST MATCH"}
				],
			};
			var tab = [];
			for (var i=0 ; i < ele.length ;i++){
				var detail =  ele[i].defaults.controller.split(":")
				
				tab.push( {
					nb:i+1,
					name: "\033[34m"+ele[i].name+"\033[0m",
					path:ele[i].path,
					variables:ele[i].variables,
					host:ele[i].host|| "",
					bundle:detail[0],
					controller:detail[1],
					action:detail[2],
					options:util.inspect( ele[i].options),
					schemes:ele[i].schemes|| "",
					pattern:ele[i].pattern,
					firstMatch:ele[i].firstMatch || ""
				});
			}
			var table = asciitable(options, tab);
			this.logger(table)
		};*/


		displayTable (titre, ele){
			var table = new AsciiTable(titre);
			table.setHeading(
				"NB", 
				"ROUTE",
				"PATH",
				"VARIABLES",
				"HOST",
				"BUNDLE",
				"CONTROLLER",
				"ACTION",
				"OPTIONS",
				//"SCHEMES",
				"PATTERN",
				"FIRST MATCH"		
			);
			table.setAlignCenter(3);
			table.setAlignCenter(11);
			for (var i=0 ; i < ele.length ;i++){
				var detail =  ele[i].defaults.controller.split(":");
				table.addRow(
					i+1,
					ele[i].name,
					ele[i].path,
					ele[i].variables,
					ele[i].host|| "",
					detail[0],
					detail[1],
					detail[2],
					util.inspect( ele[i].options),
					//ele[i].schemes|| "",
					ele[i].pattern,
					ele[i].firstMatch || ""
				);
			}
			//table.removeBorder()
			console.log(table.render());	
		};


		matchRoutes (Url){

			var myUrl = url.parse(Url)
			this.logger("URL TO CHECK : "+Url)
			var routes = this.getRoutes();
			var tab = [];
			for (var i = 0 ; i < routes.length ; i++){
				var pattern = routes[i].pattern ;
				var res = myUrl.pathname.match(pattern);
				if (res){
					tab.push(routes[i])	
				}	
			}
			if (tab.length){
				tab[0]["firstMatch"] = "*";
				this.displayTable("MATCH URL : "+ Url, tab);
			}else{
				this.logger("no routes match ","ERROR")
				this.displayTable("no routes match GENARATE ALL ROUTE", routes);
			}
		};
	};


	return {
		name:"router",
		commands:{
			routes:["router:generate:routes" ,"Generate all routes"],
			route:["router:generate:route routeName" ,"Generate one route Example : ./console router:generate:route home "],
			url:["router:match:url url", "Get route who match url Example : ./console router:match:url /nodefony"]
		},
		worker:router
	}

});
