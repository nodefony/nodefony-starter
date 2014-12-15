nodefony.registerController("mochaUnit", function(){
	
	var mochaUnit = function(container, context){
		this.mother = this.$super;
		this.mother.constructor(container, context);
	};
	
	mochaUnit.prototype.indexAction = function(){
		
		var get = this.container.getParameters("query.get");
		var jsToLoad = [];
		var files  = [];
		var config = this.container.getParameters('bundles.' + this.name);
		var bundles = this.container.get("kernel").bundles;
		var result = [];
		var regFile = /^.*\.js$/;
		
		for(var bundle in bundles){
			if(bundles[bundle] && bundles[bundle].finder){
				var files = bundles[bundle].finder.find({exclude:/^docs$/}).findByNode('public').findByNode('tests').files;
				for(var i = 0; i < files.length; i++){
					if(files[i].type == 'File' && regFile.exec(files[i].name)){
						result.push({
							bundle: bundle,
							name: files[i].name,
							dir: files[i].dirName.split('/tests/')[1] || ''
						});
					}
				}
			}
		}

		if(get.test == 'all'){
			if(get.bundle){
				
				if(bundles[get.bundle] && bundles[get.bundle].finder){
					var files = bundles[get.bundle].finder.find({exclude:/^docs$/}).findByNode('public').findByNode('tests').files;
					for(var i = 0; i < files.length; i++){
						if(files[i].type == 'File' && regFile.exec(files[i].name)){
							var dirName = files[i].dirName.split('/tests/')[1];
							dirName = (dirName ? dirName + '/' : '')
							jsToLoad.push('/' + get.bundle + 'Bundle/tests/' + dirName + files[i].name);
						}
					}
				}
				
			} else {
				for(var i = 0; i < result.length; i++){
					jsToLoad.push('/' + result[i].bundle + 'Bundle/tests/' + (result[i].dir != '' ? result[i].dir + '/' : '') + result[i].name);
				}
			}
			
		} else {
			
			if(get.test && get.test != '' && get.bundle && get.bundle != ''){
				jsToLoad.push('/' + get.bundle + 'Bundle/tests/' + (get.dir != '' ? get.dir + '/' : '') +get.test);
			}
		}
		
		return this.render('mochaUnitBundle:default:index.html.twig',{
			tests: result,
			jsToLoad: jsToLoad,
			config: config
		});
	};
	
	return mochaUnit;
	
});
