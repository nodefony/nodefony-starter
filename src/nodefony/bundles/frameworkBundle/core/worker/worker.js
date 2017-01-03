/*
 *
 *
 *
 *
 *
 */

nodefony.register("Worker", function(){

	var Worker = class Worker extends nodefony.Service {

		constructor (name, container, notificationsCenter){
			super( name, container, notificationsCenter);
			this.twig = this.kernel.templating ; //this.container.get("templating");
		}

		showHelp (){
			return this.kernel.showHelp() ;
		}

		terminate (code){
			if ( code === undefined ){
				return this.kernel.terminate(0);	
			}
			return this.kernel.terminate(code);
		}

		createDirectory (path, mode, callback){
			try {
				fs.mkdirSync(path, mode);
				var file = new nodefony.fileClass(path);
				callback( file );
				return file ;
			}catch(e){
				throw e ;
			}
		}

		createFile (path, skeleton, parse, params, callback){
			if ( skeleton ){
				this.buildSkeleton(skeleton, parse, params,(error, result) => {
					if (error){
						this.logger(error, "ERROR");	
					}else{
						try {
							fs.writeFileSync(path, result,{
								mode:"777"
							});
							callback( new nodefony.fileClass(path) ); 
						}catch(e){
							throw e	;
						}		
					}					
				});
			}else{
				var data = "/* generate by nodefony */";
				try {
					fs.writeFileSync(path, data,{
						mode:"777"
					});
					callback( new nodefony.fileClass(path) ); 
				}catch(e){
					throw e	;
				}
			}
		}

		buildSkeleton (skeleton, parse, obj, callback){
			var skelete = null ;
			try {
				skelete = new nodefony.fileClass(skeleton);
				if (skelete.type === "File"){
					if (parse !== false){
						this.twig.renderFile(skelete, obj, callback);
					}else{
						callback(null, fs.readFileSync(skelete.path,{
							encoding:'utf8'
						}));
					}
				}else{
					throw new Error( " skeleton must be file !!! : "+ skelete.path);
				}
			}catch(e){
				this.logger(e, "ERROR");
			}
			return skelete;
		}

		build (obj, parent){
			var child = null;
			switch ( nodefony.typeOf(obj) ){
				case "array" :
					for (var i = 0 ; i < obj.length ; i++){
						this.build(obj[i], parent);
					}	
				break;
				case "object" :
					for (var ele in obj ){
						var value = obj[ele];
						switch (ele){
							case "name" :
								var name = value;
							break;
							case "type" :
								switch(value){
									case "directory":
										child = this.createDirectory(parent.path+"/"+name, "777", (ele) => {
											this.logger("Create Directory :" + ele.name);
										} );
									break;
									case "file":
										this.createFile(parent.path+"/"+name, obj.skeleton, obj.parse, obj.params, (ele) =>{
											this.logger("Create File      :" + ele.name);
										});
									break;
									case "symlink":
										fs.symlink ( parent.path+"/"+obj.params.source, parent.path+"/"+obj.params.dest , obj.params.type || "file", (ele) => {
											this.logger("Create symbolic link :" + ele.name);
										} );
									break;
								}
							break;
							case "childs" :
								try {
									//console.log(value)
									this.build(value, child);
								}catch (e){
									this.logger(e, "ERROR");
								}
							break;
						}
					}
				break;
				default:
					this.logger("generate build error arguments : "+ ele, "ERROR" );
			}
			return child ;
		}
	};
	return Worker ;
});

