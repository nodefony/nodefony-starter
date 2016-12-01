# BUNDLE NODEFONY DOCUMENTATION



## Add  DOCUMENTATION bundle in Framework :
Open Bundle App "appKernel.js" to add new DOCUMENTATION Bundle in **registerBundles** array : 
```js
/*
 *	ENTRY POINT FRAMEWORK APP KERNEL
 */

nodefony.register("appKernel",function(){

	var appKernel = class appKernel extends nodefony.kernel {

		constructor (type, environment, debug, loader, settings){
			
			// kernel constructor
			super(environment, debug, loader, type, settings)

			/*
	 		*	Bundles to register in Application
	 		*/
			this.registerBundles([
				...
				"src/nodefony/bundles/documentationBundle"
			]);

			...
		};
	};

	return appKernel;
})
```
## <a name="authors"></a>Authors

-     

##  <a name="license"></a>License

