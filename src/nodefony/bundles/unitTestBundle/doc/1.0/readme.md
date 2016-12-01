# BUNDLE NODEFONY UNITTEST



## Add  UNITTEST bundle in Framework :
Open Bundle App "appKernel.js" to add new UNITTEST Bundle in **registerBundles** array : 
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
				"src/nodefony/bundles/unitTestBundle"
			]);

			...
		};
	};


	return appKernel;
})

```
## <a name="authors"></a>Authors

- admin  admin@nodefony.com  

##  <a name="license"></a>License

