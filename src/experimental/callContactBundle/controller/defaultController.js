nodefony.registerController("default", function() {

		/**
		 * The class is a **`default` CONTROLLER** .
		 * 
		 * @module Demo
		 * @main Demo
		 * @class default
		 * @constructor
		 * @param {class}
		 *            container
		 * @param {class}
		 *            context
		 * 
		 */
		var defaultController = function(container, context) {
			this.mother = this.$super;
			this.mother.constructor(container, context);

			/*
			 * var ccapi = this.context.session.getMetaBag('ccapi');
			 * if(!ccapi) this.context.session.setMetaBag('ccapi',
			 * this.getParameters('bundles.callContact.ccapi'));
			 */
		};

		/**
		 * 
		 * @method indexAction
		 * 
		 */
		defaultController.prototype.indexAction = function() {
			return this.render("callContactBundle::index.html.twig",{
				api: this.defaultApi()		
			});
		};

		defaultController.prototype.navAction = function() {
			return this.render(
					'callContactBundle:layouts:navBar.html.twig', {
						api : this.defaultApi() || null,
						env: this.defaultParam('env'),
						debug: this.defaultParam('debug')
					});
		};

		defaultController.prototype.navbarDialAction = function(api) {
			
			return this.render(
				'callContactBundle:dial:navbarDial.html.twig', {
					api: this.defaultApi(),
			        env: this.defaultParam('env'),
			        debug: this.defaultParam('debug')				
				}
			);
		};

		defaultController.prototype.configAction = function() {

			var query = [];

			if (this.getMethod() == 'POST') {

				query = this.context.request.queryPost;

				var config = this.defaultDialConfig();
				var nameApi = query['api'] || this.defaultApi();
				
				switch (query['type']) {
					case 'user':

						for ( var key in query) {
							if (config[nameApi]['userConfig'][key] || config[nameApi]['userConfig'][key] == '') {
								config[nameApi]['userConfig'][key] = query[key];
							}
						}
	
						break;
	
					case 'expert':
	
						for ( var key in query) {
							if (config[nameApi][key] || config[nameApi][key] == '') {
								config[nameApi][key] = query[key];
							}
						}
	
						// TRAITEMENT DES CHECKBOX
						config[nameApi]['disableVideo'] = (typeof (query['disableVideo']) == 'undefined' ? 0 : 1);
	
						break;
				}
				
				this.context.session.set("defaultApi", nameApi);
				this.context.session.set('api', JSON.stringify(config));

				return this.redirect(this.generateUrl('callContactConfiguration') + "?type=" + query['type']);

			}
			query = this.context.request.query;
			var config = this.defaultDialConfig();
			if(query['api']) {
				this.context.session.set("defaultApi", query['api']);
				var bundle = this.get('kernel').getBundles('callContact');
				bundle.closeMongoDbService();
				bundle.startMongoDbService(config[query['api']].mongodbUrl);
				var defaultApi = query['api'];
				
			} else {
				var defaultApi = this.defaultApi();
			}

			var conf = config[defaultApi];			
			return this.render('callContactBundle:configuration:configuration.html.twig', {
				defaultApi : defaultApi,
				api : conf,
				userConfig : conf.userConfig,
				tab : query['type']
			});
		};
		
		defaultController.prototype.defaultParam = function(name) {
			var defaultParam = this.context.session.get(name);

			if (!defaultParam) {
				defaultParam = this.getParameters('bundles.callContact.' + name);
			}

			return defaultParam;
		};

		defaultController.prototype.defaultApi = function() {
			return this.defaultParam('defaultApi');
		};

		defaultController.prototype.defaultDialConfig = function(defaultApi) {
			var api = JSON.parse(this.context.session.get('api'));

			if (!api) {
				var apiParams = this.getParameters('bundles.callContact.api');
				api = nodefony.extend(true, {}, apiParams);
			}

			return (defaultApi ? api[defaultApi] : api);
		};

		defaultController.prototype.dialConfigAction = function() {

			var defaultApi = this.defaultApi();
			var conf = this.defaultDialConfig(defaultApi);
			
			conf.api = defaultApi;

			return this.renderResponse(JSON.stringify(conf), 200, {
				"Content-Type" : "application/json"
			});
		};

		defaultController.prototype.dialPopupAction = function(message) {

			switch (this.getMethod()) {

				case 'GET':
					this.hideDebugBar();
					var defaultApi = this.defaultApi();
					var api = this.defaultDialConfig(defaultApi);
					//var settings = this.getParameters('bundles.callContact');	
					//console.log("env : " + this.defaultParam('env'));
					return this.render('callContactBundle:dial:dial.html.twig', {
						user : this.context.user,
						defaultApi : defaultApi,
						ccapi : api,
						urlWebsocket: api.WebSockServerUrl || "Not Connected",
						userConfig : api.userConfig,
					        env: this.defaultParam('env'),
					        debug: this.defaultParam('debug')					        
					});

					break;

				case 'WEBSOCKET':
					
					this.context.send("PASSAGE CALLCONTACT CONTROLLER WEBSOCKET" + (message ? ' (' + message.utf8Data + ')' : ''));
					break;
			}

		};
		
		defaultController.prototype.debugConfigAction = function(name, value){
			
			var conf = {};
			conf[name] = value;
		
			this.context.session.set(name, value);
			console.log(name + " : " + value);
			return this.renderResponse(JSON.stringify(conf), 200, {
				"Content-Type" : "application/json"
			});
	
		};
		
		defaultController.prototype.downloadCACertificateAction = function(api){
			var rootCA = this.get('kernel').rootDir + '/config/certificates/callcontact/rootCA.pem';
			return this.renderFileDownload(rootCA); 
		};

		defaultController.prototype.docAction = function() {
			return this.render('callContactBundle:doc:navDoc.html.twig');
		};

		defaultController.prototype.loginAction = function() {
			if (this.context.session)
				return this.redirect("callContact");
			return this.render('callContactBundle:login:login.html.twig');
		};

		defaultController.prototype.logoutAction = function() {
			if (this.context.session)
				return this.redirect("callContact");
			return this.render('callContactBundle:login:login.html.twig');
		};

		return defaultController;
	});
