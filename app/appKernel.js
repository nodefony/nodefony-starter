/*
 *  ENTRY POINT FRAMEWORK APP KERNEL
 */
"use strict;";
nodefony.require = require;
module.exports = class appKernel extends nodefony.kernel {
  constructor( environment, cli, settings) {
    // kernel constructor
    try {
      super(environment, cli, settings);
    } catch (e) {
      throw e;
    }
  }
};
