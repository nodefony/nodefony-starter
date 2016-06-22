
nodefony.registerController("default", function(){

		/**
		 *	The class is a **`default` CONTROLLER** .
		 *	@module App
		 *	@main App
		 *	@class default
		 *	@constructor
		 *	@param {class} container   
		 *	@param {class} context
		 *	
		 */
		var defaultController = function(container, context){
			this.mother = this.$super;
			this.mother.constructor(container, context);
		};


		/**
		 *
		 *	@method indexAction
		 *
		 */
		defaultController.prototype.indexAction = function(){
			
			return this.forward("documentationBundle:default:version");
		};


		defaultController.prototype.subSectionAction = function(version , section){
			if ( version ){
				var finder  = new nodefony.finder( {
					path:this.get("kernel").nodefonyPath+"/doc/"+version,
				});

				
			}else{
				var finder  = new nodefony.finder( {
					path:this.get("kernel").nodefonyPath+"/doc/Default",
				});	
			}
			var directory  = finder.result.getDirectories();
			var sections = []
			directory.forEach(function(ele , index){
				sections.push(ele.name)
			})
			return this.render("documentationBundle:layouts:navSection.html.twig", {version:version, section:section,sections:sections});
		};

		defaultController.prototype.versionAction = function(version , section){
			

			if ( version ){
				var finder  = new nodefony.finder( {
					path:this.get("kernel").nodefonyPath+"/doc/"+version,
				});
			}else{
				var finder  = new nodefony.finder( {
					path:this.get("kernel").nodefonyPath+"/doc/Default",
				});
			}

			var result = finder.result  ;

			var Section  = result.findByNode(section) ;

			if ( section ){
				var file = Section.getFile("readme.md" )
				if (  ! file ){
					return this.render("documentationBundle::index.html.twig",{version:version, section:section}); 
				}
				var res = this.htmlMdParser(file.content(file.encoding),{
					linkify: true,
					typographer: true	
				});
				return this.render("documentationBundle::index.html.twig",{readme:res, version:version, section:section});
			}else{
				var file = result.getFile("README.md" );
				if ( file ){
					var res = this.htmlMdParser(file.content(file.encoding),{
						linkify: true,
						typographer: true	
					});
					return this.render("documentationBundle::index.html.twig",{readme:res, version:version, section:section});
				}else{
					return this.forward("documentationBundle:default:index");
				}
			}


		};

		defaultController.prototype.navDocAction = function(){
			
			var finder  = new nodefony.finder( {
				path:this.get("kernel").nodefonyPath+"/doc/",
				recurse:false,
			});

			var directory  = finder.result.getDirectories();
			//console.log(directory)

			var versions = [];
			directory.forEach(function(ele , index){
				versions.push(ele.name)
			})

			return this.renderView("documentationBundle::navDoc.html.twig",{
				versions : versions	
			})
		}

		return defaultController;
});
