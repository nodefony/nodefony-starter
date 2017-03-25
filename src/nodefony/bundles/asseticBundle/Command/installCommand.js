/*
 *
 *
 *
 *
 *
 */

nodefony.registerCommand("assets",function(){

	
	
	var Asset = class Asset extends nodefony.cliWorker {

		constructor (container, command/*, options*/){

			super( "assets", container, container.get("notificationsCenter") );
				
			var arg = command[0].split(":");
			switch( arg[0] ){
				case "assets" :
					switch ( arg[1] ){
						case "install" :
							try {
								this.assetInstall();
							}catch(e){
								this.logger(e, "ERROR")	
							}
							this.terminate(0)
						break;
						case "dump" :
							this.bundles = this.kernel.getBundles();
							//var serviceTemplate = container.get("templating") ;
							this.kernel.listen(this, "onReady", () => {
								for ( var bundle in this.bundles ){
									var views = this.bundles[bundle].resourcesFiles.findByNode("views") ;
									views.getFiles().forEach((file/*, index, array*/) => {
										this.twig.twig( {
											path:file.path,
											name:file.name,
											async:false,
											base:this.kernel.rootDir,
											error:(error) => {
												this.logger(error, "ERROR");
												this.terminate(1);
											},
											load:(template) => {
												//this.logger(template.path,"INFO")
											}
										});
									});
								}
								this.terminate(0);
							});
						break;
						default:
							this.logger(new Error(command[0] + " command error"),"ERROR");
							this.showHelp();
					}
				break;
				default:
					this.logger(new Error(command[0] + " command error"),"ERROR");
					this.showHelp();
					this.terminate(0);
			}
		}

	};

	return {
		name:"assets",
		commands:{
			install:["assets:install" ,"Installs bundles web assets link under a public web directory "],
			dump:["assets:dump" ,"Dump  all bundles web assets under a public web directory "]
			//watch:["assetic:watch" ,"Installs bundles web assets under a public web directory "]
		},
		worker:Asset
	};

});
