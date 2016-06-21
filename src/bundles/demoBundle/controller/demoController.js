/*
 *
 *
 *
 *	CONTROLLER default
 *
 *
 *
 *
 */

var spawn = require('child_process').spawn;
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;

var https = require('https');


nodefony.registerController("demo", function(){

	var demoController = function(container, context){
		this.mother = this.$super;
		this.mother.constructor(container, context);
	};

	/**
 	 *
 	 *	DEMO login 
 	 *
 	 */
	demoController.prototype.loginAction= function(){
		if ( this.context.session )
			return this.redirect("home");
		return this.redirect(this.generateUrl("login"));	
	};


	/**
 	 *
 	 *	DEMO index 
 	 *
 	 */
	demoController.prototype.indexAction= function(){
		var kernel = this.get("kernel") ;
		return this.render("demoBundle:Default:index.html.twig",{
			user: this.context.user,
			nodefony:kernel.settings.name + " " + kernel.settings.system.version
		});
	};
	
	/**
 	 *
 	 *	DEMO navbar 
 	 *
 	 */
	demoController.prototype.navAction = function(login){
		//console.trace("PASS NAV") ;
		var webrtcBundle = this.get("kernel").getBundles("webRtc"); 
		return this.render('demoBundle:layouts:navBar.html.twig',{
			user: this.context.user,
			webrtc:webrtcBundle,
			login:login
		});	
	}

	/**
 	 *
 	 *	DEMO navbar 
 	 *
 	 */
	demoController.prototype.docAction = function(){
		var docBundle = this.get("kernel").getBundles("documentation"); 
		if (  docBundle ){
			return this.forward("documentationBundle:default:navDoc");
		}
		return this.render('demoBundle:Default:navDoc.html.twig');	
	}


	/**
 	 *
 	 *	DEMO footer
	 *
 	 *
 	 */
	demoController.prototype.footerAction = function(){
		var kernel = this.get("kernel");
		var translateService = this.get("translation");
		var version =  kernel.settings.system.version ;
		var path = this.generateUrl("home");
		var year = new Date().getFullYear();
		var langs = translateService.getLangs();
		var locale = translateService.getLocale();
		var langOptions = "";
		for (var ele in langs ){
			if (locale === langs[ele].value){
				langOptions += '<option value="'+langs[ele].value+'" selected >'+langs[ele].name+'</option>' ;	
			}else{
				langOptions += '<option value="'+langs[ele].value+'" >'+langs[ele].name+'</option>';	
			}
		}
		var html = '<nav class="navbar navbar-default navbar-fixed-bottom" role="navigation">\
			<div class"container-fluid">\
			<div class="navbar-header">\
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#footer-collapse">\
					<span class="sr-only">Toggle navigation</span>\
					<span class="icon-bar"></span>\
					<span class="icon-bar"></span>\
					<span class="icon-bar"></span>\
				</button>\
				<a class=" text-primary navbar-text" href="'+path+'" style="margin-left:20px" >\
				'+year+'\
				<strong class="text-primary"> NODEFONY '+version+'  ©</strong> \
				</a>\
			</div>\
			<div class="collapse navbar-collapse" id="footer-collapse">\
				<ul class="nav navbar-nav navbar-left">\
				</ul>\
				<ul class="nav navbar-nav navbar-right">\
					<li  class="navbar-btn pull-right" style="margin-right:40px">\
						<select id="langs" name="hl" class="form-control">\
						'+langOptions+'\
						</select>\
					</li>\
				</div>\
			</div>\
			</div>\
		</div>'
		return this.getResponse(html);	
	}



	/**
 	 *
 	 *	DEMO RENDER RAW RESPONSE  SYNC  
 	 *
 	 */
	demoController.prototype.rawResponseSyncAction= function(){
		// override timeout response 
		//this.getResponse().setTimeout(10000);
		//return ;
		
		var kernel = this.get("kernel") ;
		var settings = kernel.settings ;
		var content = '<xml><nodefony>\
			<kernel name="'+settings.name+'" version="'+settings.system.version+'">\
				<server type="HTTP" port="'+settings.system.httpPort+'"></server>\
				<server type="HTTPS" port="'+settings.system.httpsPort+'"></server>\
			</kernel>\
		</nodefony></xml>';
		return this.renderResponse(content, 200 , {
			"content-type" :"Application/xml"
		})
	};

	/**
 	 *
 	 *	DEMO RENDER RAW RESPONSE ASYNC  
 	 *
 	 */
	demoController.prototype.rawResponseAsyncAction= function(){
		var kernel = this.get("kernel") ;
		var settings = kernel.settings ;

		// async CALL
		var childHost =  exec('hostname', function(error, stdout, stderr){
			var hostname = stdout ;	

			var content = '<xml><nodefony>\
			<kernel name="'+settings.name+'" version="'+settings.system.version+'">\
				<server type="HTTP" port="'+settings.system.httpPort+'"></server>\
				<server type="HTTPS" port="'+settings.system.httpsPort+'"></server>\
				<hostname>'+hostname+'</hostname>\
			</kernel>\
			</nodefony></xml>';
			return this.renderResponse(content, 200 , {
				"content-type" :"Application/xml"
			})
		}.bind(this));
	};

	
	/**
 	 *
 	 *	DEMO ORM ASYNC CALL WITH ENTITIES 
 	 *
 	 */
	demoController.prototype.sequelizeAction = function(){
		var orm = this.getORM() ;
		
		
		this.sessionEntity = orm.getEntity("session");
		this.userEntity = orm.getEntity("user");


		var sessions = null ; 
		var users = null ; 

		// SIMPLE ORM CALL RENDER WITH SEQUELIZE PROMISE
		/*this.sessionEntity.findAll()
		.then( function(results){
			sessions = results
		})
		.catch(function(error){
			throw error ;
		})
		.done(function(){
			return this.renderAsync('demoBundle:orm:orm.html.twig', {
				sessions:sessions,
			});
		}.bind(this))*/

		// MULTIPLE ORM CALL ASYNC RENDER WITH PROMISE 
		Promise.all([this.sessionEntity.findAll(), this.userEntity.findAll()] )
		.then(function(result){
			sessions = result[0];
			users = result[1];
		}).catch(function(error){
			throw error ;
		}).done(function(){
			this.renderAsync('demoBundle:orm:orm.html.twig', {
				sessions:sessions,
				users:users,
			});
		}.bind(this))
	}

	/**
 	 *
 	 *	DEMO ORM INSERT ENTITIES 
 	 *
 	 */
	demoController.prototype.addUserAction = function(){

		// here start session for flashbag because action is not on secure area and not autostart session 
		this.startSession("default", function(error, session){
			if (error){
				this.setFlashBag("error",error );
				return this.redirect(this.generateUrl("login"));
			}

			var orm = this.getORM() ;
			this.userEntity = orm.getEntity("user");

			// FORM DATA
			var query = this.getParameters("query");

			// GET FACTORY SECURE TO ENCRYPTE PASSWORD 
			var firewall = this.get("security");
			var area = firewall.getSecuredArea("demo_area") ; 
			var factory = area.getFactory();
			var realm = factory.settings.realm ;
			var cryptpwd = factory.generatePasswd(realm, query.post.usernameCreate, query.post.passwordCreate);
				
			var users = null ; 
			var error = null ;
			this.userEntity.create({ 
				username:	query.post.usernameCreate, 
				email:		query.post.emailCreate, 
				password:	cryptpwd,
				name:		query.post.nameCreate  ,
				surname:	query.post.surnameCreate,  
			})
			.then( function(results){
				users = results
			})
			.catch(function(error){
				this.logger(error.errors);
				this.setFlashBag("error",error.message );
				this.redirect(this.generateUrl("login"));
			}.bind(this))
			.done(function(){
				if (error ){
					return ; 
				}
				this.setFlashBag("adduser"," Add user  : "+ query.post.usernameCreate + " OK" );
				return this.redirect(this.generateUrl("login"));
			}.bind(this))
			
		}.bind(this));

	}

	/**
 	 *
 	 *	DEMO ORM ASYNC CALL WITHOUT ENTITIES 
 	 *	SQL SELECT
 	 *
 	 */
	demoController.prototype.querySqlAction = function(){

		var orm = this.getORM() ;

		var nodefonyDb = orm.getConnection("nodefony") ;

		var users = null ;
		nodefonyDb.query('SELECT * FROM users')
		.then(function(result){
			users = result[0];
		}.bind(this))
		.done(function(){
			this.renderAsync('demoBundle:orm:orm.html.twig', {
				users:users,
			});
		}.bind(this))
	}

	/**
 	 *
 	 *	DEMO ORM ASYNC CALL WITHOUT ENTITIES 
 	 *	SQL WITH JOIN 
 	 *
 	 *
 	 */
	demoController.prototype.querySqlJoinAction = function(){

		var orm = this.getORM() ;

		var nodefonyDb = orm.getConnection("nodefony") ;

		var joins = null ;
		nodefonyDb.query('SELECT * FROM sessions S LEFT JOIN users U on U.id = S.user_id ')
		.then(function(result){
			joins = result[0];
			for (var i = 0 ; i < joins.length ; i++){
				joins[i].metaBag = JSON.parse( joins[i].metaBag )
			}
		}.bind(this))
		.done(function(){
			this.renderAsync('demoBundle:orm:orm.html.twig', {
				joins:joins,
			});
		}.bind(this))
	}

	/*
 	 *
 	 *	SYSTEM CALL NODEJS WITH PROMISE
 	 */
	demoController.prototype.syscallAction = function(){

		var tab =[];

		// system call  exec synchrone hostname
		tab.push (new Promise( function(resolve, reject){
			try {
				var childHost =  execSync('hostname');
				var res = childHost.toString() ;
				resolve(res);	
				return 	res ;	
			}catch(e){
				reject(e) ;	
			}
		}));
			
		// exec PWD
		tab.push (new Promise( function(resolve, reject){
			return exec("pwd", function(error, stdout, stderr){
				if ( error ){
					return reject(error);
				}
				if ( stderr ){
					this.logger(stderr, "ERROR");
				}
				return resolve(stdout) ;	
			}.bind(this))
		
		}.bind(this)));

		
		// system call  spawn ping  
		tab.push (new Promise( function(resolve, reject){
			var du = spawn('ping', ['-c', "3", "google.com"]);
			var str = "" ;
			var err = "" ;
			var code = "" ;

			du.stdout.on('data',function(data){
				str+= data ;
			});

			du.stderr.on('data',function(data){
				err+= data ;
				this.logger("ERROR : " +  err,"ERROR");
			}.bind(this));

			du.on('close',function(code){
				code = code ;
				this.logger("child process exited with code : " + code, "INFO");
				resolve({
					ping:str,
					code:code,
					error:err
				});
			}.bind(this));
		}.bind(this)));

		var ping = "" ;
		var err = "" ;
		var code = "" ;
		var hostname = "";
		var pwd = "" ;

		// CALL PROMISE 
		Promise.all(tab)
		.catch(function(e){
			this.logger(e,"ERROR");
			throw e ;
		}.bind(this))
		.then(function(result){
			// format result for pass in renderAsync view   
			hostname = result[0];
			pwd = result[1] ;
			ping = result[2].ping ;
			code = result[2].code ;
			err = result[2].err ;
		}.bind(this))
		.done(function(ele){
			this.logger( "PROMISE SYSCALL DONE" , "DEBUG");
			try {
				this.renderAsync("demoBundle:Default:exec.html.twig", {
					hostname:hostname,
					ping:ping,
					pwd:pwd,
					code:code,
					error:err,
					date:new Date()
				});
			}catch(e){
				throw e ;
			}
		}.bind(this))
	}

	/*
 	 *
 	 *	HTTP REQUEST FOR PROXY  
 	 */
	demoController.prototype.httpRequestAction = function(){
		//this.getResponse().setTimeout(5000)
		//return 

		var path = this.generateUrl("xmlAsyncResponse");
		var host =  this.context.request.url.protocol+"//"+this.context.request.url.host+path ;
		var type = this.context.type ;
		// cookie session 
		var headers = {}
		headers["Cookie"] = this.context.session.name+"="+this.context.session.id ;
		var options = {
  			hostname: this.context.request.url.hostname,
  			port: this.context.request.url.port,
			path:path,
  			method: 'GET',
			headers:headers
		}	
		var wrapper = http.request ;

		// https 
		if (this.context.request.url.protocol === "https:"){
			// keepalive if multiple request in same socket
			var keepAliveAgent = new https.Agent({ keepAlive: true });
			// certificat
			var kernel = this.get("kernel");
			var settings =  this.get("httpsServer").settings ;

			nodefony.extend(options,{
				key: fs.readFileSync(kernel.rootDir+settings.certificats.key),
				cert:fs.readFileSync(kernel.rootDir+settings.certificats.cert),
				rejectUnauthorized: false,
				requestCert: true,
				agent: keepAliveAgent
			});
			var wrapper = https.request ;
		}else{
			// keepalive
			var keepAliveAgent = new http.Agent({ keepAlive: true });
			options.agent = keepAliveAgent;	
		}
		
		var req = wrapper(options, function(res) {
			var bodyRaw = "";
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				this.logger( chunk, "DEBUG");
				bodyRaw += chunk ;
			}.bind(this));

			res.on('end', function(){
				this.renderAsync("demoBundle:Default:httpRequest.html.twig", {
					host: host,
					type: type,
					bodyRaw:bodyRaw,
				});
			}.bind(this))

		}.bind(this));

		req.on('error', function(e) {
			this.logger('Problem with request: ' + e.message, "ERROR");
			this.renderAsync("demoBundle:Default:httpRequest.html.twig", {
				host: host,
				type: type,
				bodyRaw:e,
			});
		}.bind(this));

		req.end();
	}


	/**
	 *
	 *	@method indexRealTimeAction
	 *
	 */
	demoController.prototype.indexRealTimeAction = function(){
		return this.render("demoBundle:realTime:index.html.twig",{title:"realTime"});			
	};

	/*
 	 *
 	 *	UPLOAD
 	 *
 	 */
	demoController.prototype.indexUploadAction= function(){
		return this.render('demoBundle:demo:upload2.html.twig');
	};

	demoController.prototype.uploadAction = function(){
	
		var files = this.getParameters("query.files");
		var path =  this.get("kernel").rootDir+"/src/bundles/demoBundle/Resources/images" ;	
		for (var file in files){
			if( files[file].error ){
				throw files[file].error ;
			}
			//files[file].move("/tmp/");
			files[file].move(path);
			//console.log( files[file].getExtention() )
			//console.log( files[file].getMimeType() )
			//console.log( files[file].realName() )
		}
		if ( ! this.isAjax() ){
			//return this.forward("demoBundle:finder:index");
			return this.redirect ( this.generateUrl("finder") );
		}else{
			var res = {
				"files": [],
				"metas": []
			}
			for (var file in files){
				var name = files[file].realName();
				res.files.push(path+"/"+name);
				var meta = {
					date : new Date(),
					extention:files[file].getExtention(),
					file:path+"/"+name,
					name:name,
					old_name:files[file].name,
					size:files[file].stats.size,
					size2:files[file].stats.size,
					type:files[file].getMimeType().split("/")
				}
				res.metas.push(meta);
			}

			return this.renderResponse(
				JSON.stringify(res), 
				200, 
				{'Content-Type': 'application/json; charset=utf-8'}
			);
		}
	};


	/**
 	 *	 renderView 
 	 *		
 	 */
	demoController.prototype.renderviewAction= function(name){
		var content = this.renderView('demoBundle:Default:index.html.twig',{name:"render"});
		return this.renderResponse(content);
	};
	
	/**
 	 *	@see renderResponse() with content html
 	 *
 	 */
	demoController.prototype.htmlAction= function(name){
		var name = "nodefony";
		return this.renderResponse('<html><script>alert("'+name+'")</script></html>');
	};

	/**
 	 *
 	 *	@see forward
 	 */
	demoController.prototype.forwardAction= function(){
		return this.forward("frameworkBundle:default:index")
	};
	
	/**
 	 *
 	 *	@see redirect
 	 */
	demoController.prototype.redirectGoogleAction= function(){
		// status 301 or 302
		return this.redirect("http://google.com"/*, status*/);
	};

	/**
 	 *
 	 *	@see redirect with variables 
 	 *	@see generateUrl 
 	 */
	demoController.prototype.generateUrlAction = function(){
		// absolute
		return this.redirect ( this.generateUrl("user", {name:"cci"},true) );	

		// relative
		//return this.redirect ( this.generateUrl("user", {name:"cci"} );
	};


	/**
 	 *
 	 *	DEMO WEBSOCKET
 	 */
	demoController.prototype.websoketAction= function(message){
		var context = this.getContext();
		switch( this.getMethod() ){
			case "GET" :
				return this.render('demoBundle:Default:websocket.html.twig',{name:"websoket"});
			break;
			case "WEBSOCKET" :
				if (message){
					// MESSAGES CLIENT
					this.logger( message.utf8Data , "INFO");
				}else{
					// PREPARE  PUSH MESSAGES SERVER 
					// SEND MESSAGES TO CLIENTS
					var i = 0 ;
					var id = setInterval(function(){
						var mess = "I am a  message "+ i +"\n" ;
						context.send(mess);
						this.logger( "SEND TO CLIENT :" + mess , "INFO");
						i++
					}.bind(this), 1000);

					setTimeout(function(){
						clearInterval(id);
						// close reason , descripton
						context.close(1000, "NODEFONY CONTROLLER CLOSE SOCKET");
						id = null ;
					}, 10000);
					this.context.listen(this, "onClose" , function(){
						if (id){
							clearInterval(id);	
						}
					})
				}
			break;
			default :
				throw new Error("REALTIME METHOD NOT ALLOWED")
		}
	};


	demoController.prototype.readmeAction = function(){
		var kernel = this.container.get("kernel");
		var path = kernel.rootDir+'/README.md';
		var file = new nodefony.fileClass(path);
		var res = this.htmlMdParser(file.content(),{
			linkify: true,
			typographer: true	
		});
		return  this.render('demoBundle:Default:documentation.html.twig',{
			html:res
		});
	}


	
	return demoController;
});

