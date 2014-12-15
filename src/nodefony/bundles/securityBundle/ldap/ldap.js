/*
 *
 *
 *
 *
 *
 *
 */

var ldap = require('ldapjs');

nodefony.register( "ldapManager",function(){

	var Ldap = function(property){
		this.engine = ldap ;
	};


	Ldap.prototype.getUserPassword = function(){
	};



	return Ldap;	

});

