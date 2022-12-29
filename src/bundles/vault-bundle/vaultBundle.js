/**
 *	The class is a **`vault` BUNDLE** .
 *	@class vaultBundle
 *	@constructor
 *	@param {string} name
 *	@param {class} kernel
 *	@param {class} container
 *
 */
module.exports = class vaultBundle extends nodefony.Bundle {

  constructor(name, kernel, container) {
    // Mother Class constructor
    super(name, kernel, container);
  }
}
