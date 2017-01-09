/*
 *
 *
 *
 */



nodefony.registerCommand("generate",function(){

	/*
 	 *	Bundle generator
 	 *
 	 */
	var regBundle = /^(.*)Bundle$/;
	var bundle = function(path , name, type, location){

		var realName = null ;
		var res = regBundle.exec(name);
		if ( res ){
			realName = res[1] ;
		}else{
			throw new Error("Bad bundle name");
		}
		var param = {
			bundleName: name,
			name: realName,
			module:this.config.App.projectName,
			projectName:this.config.App.projectName,
			authorName:this.config.App.authorName,
			authorEmail:this.config.App.authorMail,
			projectYear:this.config.App.projectYear,
			projectYearNow:	new Date().getFullYear()
		};

		return this.build( {
				name:name,
				type:"directory",
				childs:[
					Command,
					controller.call(this, name, "controller" ,"defaultController",null,location),
					manager,
					tests.call(this, param),
					Resources.call(this, name, type, location),
					documentation.call(this, param, location),
					core,
					entity,
					{
						name:name+".js",
						type:"file",
						skeleton:"vendors/nodefony/bundles/frameworkBundle/Command/skeletons/bundleClass.skeleton",
						params:param
					},{
						name:"readme.md",
						type:"symlink",
						params: {
							source:"doc/1.0/readme.md",
							dest:"readme.md"
						}
					},{
						name:"package.json",
						type:"file",
						skeleton:"vendors/nodefony/bundles/frameworkBundle/Command/skeletons/package.skeleton",
						params:param
					}
				]
			}, path );
	};


	var documentation = function(param, location){
		
		return {
			name:"doc",
			type:"directory",
			childs:[
				{
					name:"1.0",
					type:"directory",
					childs:[{
						name:"readme.md",
						type:"file",
						skeleton:"vendors/nodefony/bundles/frameworkBundle/Command/skeletons/readme.skeleton",
						params:nodefony.extend(param, {
							path:location 
						})
					}]	
				},
				{
					name:"Default",
					type:"symlink",
					params:{
						source:"1.0",
						dest:"Default"
					}
				}
			]
		};
	};

	
	var Resources = function(name, type, location){
		var Name = /(.*)Bundle/.exec(name)[1];
		var param = {
			name:Name,
			title:Name,
			bundleName: name,
			local:this.config.App.locale,
			projectName:this.config.App.projectName,
			authorName:this.config.App.name,
			authorEmail:this.config.App.email,
			projectYear:this.config.App.projectYear,
			projectYearNow:	new Date().getFullYear(),
			domain:this.configKernel.system.domain,
			location:location
		};
		
		return {
			name:"Resources",
			type:"directory",
			childs:[{
				name:"config",
				type:"directory",
				childs:[{
						name:"config."+type,
						type:"file",
						skeleton:"vendors/nodefony/bundles/frameworkBundle/Command/skeletons/config."+type+".skeleton",
						params:param
							
						
					},
					routing.call(this, param, type)
				]
			},
			public.call(this),
			translations,
			views.call(this, "views", "index.html.twig", param)
			]
		};
	};

	var Command = {
		name:"Command",
		type:"directory",
		childs:[{
			name:".gitignore",
			type:"file"
		}]
	};

		
	var views = function(directory, name, params){
		var obj = {
			name:directory,
			type:"directory"
		};
		var file = [{
			name:name,
			type:"file",
			parse:false,
			skeleton:"vendors/nodefony/bundles/frameworkBundle/Command/skeletons/bundleView.skeleton",
			params:	params || {}
		}]; 
		obj.childs = file;
		return obj;
	};

	var routing = function(obj, type){
		var file = {
			name:"routing."+type,
			type:"file",
			skeleton:"vendors/nodefony/bundles/frameworkBundle/Command/skeletons/routing."+type+".skeleton",
			params:obj	
		};
		return file;
	};
	routing.addConfigRoute = function(file, route, nameController, bundleName){
		var routingFile = new nodefony.fileClass(file);
		this.buildSkeleton("vendors/nodefony/bundles/frameworkBundle/Command/skeletons/route.yml.skeleton", true , {controller:nameController,name:route.name,bundleName:bundleName} , function(error, data){
			if (error ){
				throw error ;
			}
			try {
				fs.writeFileSync(routingFile.path, routingFile.content() + data ,{
					mode:"777"
				});
			}catch(e){
				throw e;	
			}
		});
	};

	var service = function(obj, type){
		var file = [{
			name:"service."+type,
			type:"file",
			skeleton:"vendors/nodefony/bundles/frameworkBundle/Command/skeletons/service."+type+".skeleton",
			params:obj	
		}];
		return file;
	};

	service.addConfigService = function(){
	
	};

	var manager = {
		name:"services",
		type:"directory",
		childs:[{
			name:".gitignore",
			type:"file"
		}]
	};

	var tests = function(param){
		
		return {
			name:"tests",
			type:"directory",
			childs:[{
				name:param.bundleName+"Test.js",
				type:"file",
				skeleton:"vendors/nodefony/bundles/frameworkBundle/Command/skeletons/testFile.skeleton",
				params:param
			}]
		};
	};

	var core = {
		name:"core",
		type:"directory",
		childs:[{
			name:".gitignore",
			type:"file"
		}]
	};
	var translations = {
		name:"translations",
		type:"directory",
		childs:[{
			name:".gitignore",
			type:"file"
		}]
	};
	var entity = {
		name:"Entity",
		type:"directory",
		childs:[{
			name:".gitignore",
			type:"file"
		}]
	};

	var public = function(){
		return {
			name:"public",
			type:"directory",
			childs:[{
				name:"js",
				type:"directory",
				childs:[{
					name:".gitignore",
					type:"file"
				}]
			},{
				name:"css",
				type:"directory",
				childs:[{
					name:".gitignore",
					type:"file"
				}]
			},{
				name:"images",
				type:"directory",
				childs:[{
					name:".gitignore",
					type:"file"
				}]
			},{
				name:"assets",
				type:"directory",
				childs:[{
					name:"js",
					type:"directory",
					childs:[{
						name:".gitignore",
						type:"file"
					}]
				},{
					name:"css",
					type:"directory",
					childs:[{
						name:".gitignore",
						type:"file"
					}]
				},{
					name:"images",
					type:"directory",
					childs:[{
						name:".gitignore",
						type:"file"
					}]
				}]
			}]
		};
	};

	/*
	 *	commands generator
	 *
	 *
	 */
	//TODO
	var commands = function(bundlePath, name){
		bundlePath.matchName(regBundle);
		if ( bundlePath.match ){
			var bundleName = bundlePath.match[0] ;
		}else{
			throw new Error("Bad bundle name");
		}
		name = name.replace("Command","");

		var file  = {
			name:name+"Command.js",
			type:"file",
			skeleton:"vendors/nodefony/bundles/frameworkBundle/Command/skeletons/commandClass.skeleton",
			params:{
				name:name
			}
		};
		this.build(file, new nodefony.fileClass(bundlePath.path+"/Command") );
	};

	/*
	 *	controller generator
	 *
	 */
	
	var controller = function(bundleName, directory, controllerName, viewDir, location){
		var res = regController.exec(controllerName);
		var realName = null ;
		if ( res ){
			realName = res[1] ;
		}else{
			throw new Error("Bad controller name");
		}
	
		var obj = {
			name:directory,
			type:"directory"
		};
		var nameBundle = /^(.*)Bundle$/.exec(bundleName)[1];
		var file  = [{
			name:controllerName+".js",
			type:"file",
			skeleton:"vendors/nodefony/bundles/frameworkBundle/Command/skeletons/controllerClass.skeleton",
			params:{
				bundleName: bundleName,
				smallName:nameBundle,
				controllerName:controllerName,
				name:realName,
				directory:viewDir||"",
				module:viewDir || this.config.App.projectName,
				authorName:this.config.App.name,
				authorEmail:this.config.App.email,
				projectName:this.config.App.projectName,
				projectYear:this.config.App.projectYear,
				projectYearNow:	new Date().getFullYear(),
				location:location
			}
		}];
		obj.childs = file;

		return obj;
	};

	var controllers = function(bundlePath, controllerName, type ){
		var res = regController.exec(controllerName);
		var realName = null ;
		var directory = null ;
		var bundleName = null ;
		if ( res ){
			realName = res[1] ;
		}else{
			throw new Error("Bad controller name");
		}

		bundlePath.matchName(regBundle);
		if ( bundlePath.match ){
			bundleName = bundlePath.match[0] ;
		}else{
			throw new Error("Bad bundle name");
		}
		res = regController.exec(controllerName);
		if ( res ){
			directory = res[1] ;
		}else{
			throw new Error("Bad Controller name");
		}
		var bundleDirectoryController = new nodefony.fileClass(bundlePath.path+"/controller");
		var bundleDirectoryview = new nodefony.fileClass(bundlePath.path+"/Resources/views");
		//var bundleDirectoryConfig = new nodefony.fileClass(bundlePath.path+"/Resources/config");
		try {
			this.build(controller.call(this, bundlePath.name, directory, controllerName, directory), bundleDirectoryController );
			this.build(views.call(this, directory, "index.html.twig") ,bundleDirectoryview );
			var route = new nodefony.Route(realName) ;
			route.addDefault("controller", bundleName+":"+realName+":index");
			//console.log(route)
			routing.addConfigRoute.call(this, bundlePath.path+"/Resources/config/routing."+type, route, controllerName, bundleName);
		}catch(e){
			this.logger(e, "ERROR");
		}
	};

	var regController = /^(.*)Controller$/;

	/*
 	 *
 	 */
	var generate = class generate extends nodefony.Worker {

		constructor(container, command/*, options*/){
			
			super( "generate", container, container.get("notificationsCenter") );

			this.config = this.container.getParameters("bundles.App");
			this.configKernel = this.container.getParameters("kernel");
			var arg = command[0].split(":");
			switch ( arg[1] ){
				case "bundle" : 
					if ( command[1] ){
						try {
							this.generateBundle(command[1], command[2]);
						}catch(e){
							this.terminate(1);
							return ;
						}
					}else{
						this.showHelp();
					}
				break;
				case "controller" : 
					switch (command.length){
						case 1:
							this.showHelp();
						break;
						case 2:
							this.showHelp();
						break;
						case 3:
							try {
								this.generateController( command[1], command[2]);
							}catch(e){
								this.terminate(1);
								return ;
							}
						break;
					}
				break;
				case "command" : 
					console.log("GENERATE command");
					try{
						this.generateCommand(command[1], command[2]);	
					}catch(e){
						this.terminate(1);
						return ;
					}
				break;
				case "service" : 
					console.log("GENERATE service");
					try { 
						this.generateService();	
					}catch(e){
						this.terminate(1);
						return ;
					}
				break;
				default:
					this.showHelp();
			}
			this.terminate(0);

		}

		generateBundle (name, path){	
			this.logger("GENERATE bundle : " + name +" LOCATION : " + path);
			try {
				var file = new nodefony.fileClass(path);
				return bundle.call(this, file, name, "yml", path);
			}catch (e){
				this.logger(e, "ERROR");
				throw e ;
			}
		}

		generateController ( name, path){
			this.logger("GENERATE controller : " + name +" BUNDLE LOCATION : " + path);
			try {
				var file = new nodefony.fileClass(path);
				return controllers.call(this, file, name, "yml");
			}catch (e){
				this.logger(e, "ERROR");
				throw e ;
			}

		
		}

		
		generateCommand (name, path){
			
			this.logger("GENERATE Command : " + name +" LOCATION : " + path+"Command");
			try {
				var file = new nodefony.fileClass( path);
				return commands.call(this, file, name);
			}catch (e){
				this.logger(e, "ERROR");
				throw e ;
			}
		
		}

		generateService (){
		
		}
	};


	return {
		name:"generate",
		commands:{
			bundle:["generate:bundle nameBundle path" ,"Generate a Bundle directory in path directory Example : ./console generate:bundle myprojectBundle ./src/bundles"],
			controller:["generate:controller  nameController path" ,"Generate a controller js file in bundle path"],
			command:["generate:command nameCommand path" ,"Generate a command js file in bundle path"],
			service:["generate:service nameService path" ,"Generate a service js file in bundle path"]
		},
		worker:generate
	};
});


