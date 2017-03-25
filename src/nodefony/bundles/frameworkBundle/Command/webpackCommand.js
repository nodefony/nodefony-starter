/*
 *
 *
 *
 */
nodefony.registerCommand("webpack",function(){


	var webpack = class webpack extends nodefony.cliWorker {

		constructor(container, command/*, options*/){
			
			super( "webpack", container, container.get("notificationsCenter") );

			this.config = this.container.getParameters("bundles.App");
			this.configKernel = this.container.getParameters("kernel");
			var arg = command[0].split(":");
			switch ( arg[1] ){
				case "dump" :
					try { 
						this.webpackCompile();	
					}catch(e){
						this.terminate(1);
						return ;
					}	
				break;
				default:
					this.showHelp();
					this.terminate(0);
			}
		}

		webpackCompile (){
			this.listen( this, "onReady" , () => {
				for ( var bundle in this.kernel.bundles ){
					if ( this.kernel.bundles[bundle].webpackCompiler ){
						this.kernel.bundles[bundle].compileWebpack();
					}
				}	
			});
		}
	};

	return {

		name:"webpack",
		commands:{
			dump:["webpack:dump" ,"Compile webpack for all bundles "]
		},
		worker:webpack
	};
});
