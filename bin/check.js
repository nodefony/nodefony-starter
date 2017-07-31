#!/usr/bin/env node
"use strict;"
const path = require("path");
const fs = require("fs");
const classPackageManager = require( path.resolve("bin", "packageManager.js") );

const checkManager = class checkManager {

    constructor(){
        this.packageManager = new classPackageManager();
        this.isNodefony = this.isNodefonyTrunk();
        if( ! this.isNodefony ){
            throw new Error(" Nodefony repository not found !!  ")
        }
        this.isCore = this.isCoreTrunk();

        if( ! this.isCore ){
            this.nodefony = require("nodefony");
        }else{
            this.nodefony = require( path.resolve( "src", "nodefony", "core", "autoloader"));
        }
        if ( ! nodefony ){
                let error = new Error("Nodefony trunk is not build !!") ;
                console.error(error);
                console.error("Run npn install to build ");
                throw  error ;
        }
        this.version = this.getVersion();
    }

    isCoreTrunk (){
        try {
            let stat =  fs.lstatSync( this.checkPath(".core") );
            return true ;
        }catch(e){
            return  false ;
        }
    }

    isNodefonyTrunk (){
        try {
            let stat =  fs.lstatSync( this.checkPath( path.resolve("config", "config.yml") ));
            return true ;
        }catch(e){
            return  false ;
        }
    }

    getVersion(){
        return require( this.checkPath( "package.json") ).version ;
    }

    checkPath (myPath){
        if ( ! myPath ){
            return null ;
        }
        var abs = path.isAbsolute( myPath ) ;
        if ( abs ){
            return myPath ;
        }else{
            return path.resolve( process.cwd(), myPath ) ;
        }
    }

}

let check = null ;
try {
    check =  new checkManager();
}catch(e){
    throw e;
}
module.exports = check ;
