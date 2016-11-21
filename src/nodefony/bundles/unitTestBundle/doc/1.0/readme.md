# BUNDLE NODEFONY UNITTEST



## Add  UNITTEST bundle in Framework :
Open Bundle App "appKernel.js" to add new UNITTEST Bundle in **registerBundles** array : 
```js
/*
 *	ENTRY POINT FRAMEWORK APP KERNEL
 */

nodefony.register("appKernel",function(){

	var appKernel = function(type, environment, debug, loader){
		
		// kernel constructor
		var kernel = this.$super;
		kernel.constructor(environment, debug, loader, type)

		/*
	 	*	Bundles to register in Application
	 	*/
		this.registerBundles([
			"src/nodefony/bundles/unitTestBundle"
		]);

		...


					
	}.herite(nodefony.kernel);

	return appKernel;
})
```
## <a name="authors"></a>Authors

- admin  admin@nodefony.com  

##  <a name="license"></a>License

