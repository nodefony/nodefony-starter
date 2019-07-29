/**
 *	The class is a **`users` BUNDLE** .
 *	@module nodefony-starter
 *	@main nodefony-starter
 *	@class usersBundle
 *	@constructor
 *	@param {string} name
 *	@param {class} kernel
 *	@param {class} container
 *
 */
module.exports = class usersBundle  extends nodefony.Bundle {

  constructor (name, kernel, container){
    // Mother Class constructor
    super( name, kernel, container );

  // Load core bundle library
  //this.autoLoader.loadDirectory( path.resolve( this.path, "src" ) );

 /*
  *	If you want kernel wait users event <<onReady>>
  *
  *      this.waitBundleReady = true ;
  */
  }
};
