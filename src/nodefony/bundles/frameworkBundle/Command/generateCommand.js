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

		var res = regBundle.exec(name);
		if ( res ){
			var realName = res[1] ;
		}else{
			throw new Error("Bad bundle name")
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
		}

		return this.build( {
				name:name,
				type:"directory",
				childs:[
					Command,
					controller.call(this, name, "controller" ,"defaultController",null,location),
					manager,
					tests,
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
		}
	};

	
	var Resources = function(name, type, location){
		var Name = /(.*)Bundle/.exec(name)[1]
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
		}
	};

	var Command = {
		name:"Command",
		type:"directory"
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
		obj["childs"] = file;
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
			if (error )
				throw error ;
			try {
				var res = fs.writeFileSync(routingFile.path, routingFile.content() + data ,{
					mode:"777"
				});
			}catch(e){
				throw e	
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
	
	}




	var manager = {
		name:"services",
		type:"directory"
	};
	var tests = {
		name:"tests",
		type:"directory"
	};
	var core = {
		name:"core",
		type:"directory"
	};
	var translations = {
		name:"translations",
		type:"directory"
	};
	var entity = {
		name:"Entity",
		type:"directory"
	};

	var public = function(){
		return {
			name:"public",
			type:"directory",
			childs:[{
				name:"js",
				type:"directory"
			},{
				name:"css",
				type:"directory"
			},{
				name:"images",
				type:"directory"
			},{
				name:"assets",
				type:"directory",
				childs:[{
					name:"js",
					type:"directory"
				},{
					name:"css",
					type:"directory"
				},{
					name:"images",
					type:"directory"
				}]
			}]
		}
	}

	var generate = function(container, command, options){
		this.kernel = this.container.get("kernel") ;
		//this.twig = this.container.get("templating");
		this.config = this.container.getParameters("bundles.App");
		this.configKernel = this.container.getParameters("kernel");
		var arg = command[0].split(":");
		switch ( arg[1] ){
			case "bundle" : 
				if ( command[1] ){
					this.generateBundle(command[1], command[2]);
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
						this.generateController( command[1], command[2]);
					break;
				}
			break;
			case "command" : 
				console.log("GENERATE command");
				this.generateCommand(command[1], command[2]);	
			break;
			case "service" : 
				console.log("GENERATE service");
				this.generateService();	
			break;
			default:
				this.showHelp()
		}
		this.terminate();

	};

	generate.prototype.generateBundle = function(name, path){	
		this.logger("GENERATE bundle : " + name +" LOCATION : " + path)
		try {
			var file = new nodefony.fileClass(path);
			return bundle.call(this, file, name, "yml", path);
		}catch (e){
			this.logger(e, "ERROR");
		}
	};



	/*
	 *	controller generator
	 *
	 */
	var regController = /^(.*)Controller$/;
	var controller = function(bundleName, directory, controllerName, viewDir, location){
		var res = regController.exec(controllerName);
		if ( res ){
			var realName = res[1] ;
		}else{
			throw new Error("Bad controller name")
		}
	
		var obj = {
			name:directory,
			type:"directory"
		}
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
		obj["childs"] = file;

		return obj;
	};

	var controllers = function(bundlePath, controllerName, type ){
		var res = regController.exec(controllerName);
		if ( res ){
			var realName = res[1] ;
		}else{
			throw new Error("Bad controller name")
		}

		bundlePath.matchName(regBundle);
		if ( bundlePath.match ){
			var bundleName = bundlePath.match[0] ;
		}else{
			throw new Error("Bad bundle name")
		}
		res = regController.exec(controllerName);
		if ( res ){
			var directory = res[1] ;
		}else{
			throw new Error("Bad Controller name")
		}
		var bundleDirectoryController = new nodefony.fileClass(bundlePath.path+"/controller");
		var bundleDirectoryview = new nodefony.fileClass(bundlePath.path+"/Resources/views");
		var bundleDirectoryConfig = new nodefony.fileClass(bundlePath.path+"/Resources/config");
		try {
			this.build(controller.call(this, bundlePath.name, directory, controllerName, directory), bundleDirectoryController );
			this.build(views.call(this, directory, "index.html.twig") ,bundleDirectoryview );
			var route = new nodefony.Route(realName) ;
			route.addDefault("controller", bundleName+":"+realName+":index");
			//console.log(route)
			routing.addConfigRoute.call(this, bundlePath.path+"/Resources/config/routing."+type, route, controllerName, bundleName)
		}catch(e){
			this.logger(e, "ERROR")
		}
	};
	generate.prototype.generateController = function( name, path){
		this.logger("GENERATE controller : " + name +" BUNDLE LOCATION : " + path)
		try {
			var file = new nodefony.fileClass(path);
			return controllers.call(this, file, name, "yml");
		}catch (e){
			this.logger(e, "ERROR");
		}

	
	};

	/*
	 *	commands generator
	 *
	 */
	var commands = function(bundlePath, name){
		bundlePath.matchName(regBundle);
		if ( bundlePath.match ){
			var bundleName = bundlePath.match[0] ;
		}else{
			throw new Error("Bad bundle name")
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

	generate.prototype.generateCommand = function(name, path){
		var command = function(file, name ){
			console.log(file)
		};
		this.logger("GENERATE Command : " + name +" LOCATION : " + path+"Command")
		try {
			var file = new nodefony.fileClass( path);
			return commands.call(this, file, name);
		}catch (e){
			this.logger(e, "ERROR");
		}
	
	};

	generate.prototype.generateService = function(){
	
	};


	return {
		name:"generate",
		commands:{
			bundle:["generate:bundle nameBundle path" ,"Generate a Bundle directory in path directory"],
			controller:["generate:controller  nameController path" ,"Generate a controller js file in bundle path"],
			command:["generate:command nameCommand path" ,"Generate a command js file in bundle path"],
			service:["generate:service nameService path" ,"Generate a service js file in bundle path"]
		},
		worker:generate
	}
});


