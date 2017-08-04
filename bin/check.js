#!/usr/bin/env node
"use strict;"
const path = require("path");
const fs = require("fs");
const classPackageManager = require( path.resolve("bin", "packageManager.js") );

const checkManager = class checkManager {

    constructor(){
        this.isNodefony = this.isNodefonyTrunk();
        if( ! this.isNodefony ){
            console.error( "You must run nodefony on Framework Root Directory  ");
            throw new Error(process.cwd() + " Is Not a Nodefony Repository !!  ");
        }
        this.isCore = this.isCoreTrunk();
        try {
            if( ! this.isCore ){
                this.nodefony = require("nodefony");
            }else{
                this.nodefony = require( path.resolve( "src", "nodefony", "core", "autoloader"));
            }
            if ( ! this.nodefony ){
                    let error = new Error("Nodefony trunk is not build !!") ;
                    console.error("Run make build to install framework  ");
                    throw  error ;
            }
        }catch(e){
            let error = new Error("Nodefony trunk is not build !!") ;
            console.error("Run make build to install framework  ");
            throw e ;
        }
        this.nodefonyPath = this.checkPath( path.resolve("src", "nodefony") );
        try {
            this.packageManager = new classPackageManager();
        }catch(e){
            throw e ;
        }
        try {
            this.version = this.getVersion();
        }catch(e){
            throw e ;
        }
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

    linkCoreBundles(){
        if ( this.isCore ){
            return true ;
        }
        let shell = null ;
        try {
            shell = require("shelljs");
        }catch(e){
            throw e ;
        }
        try {
            fs.lstatSync( this.nodefonyPath );
        }catch(e){
            try {
                fs.lstatSync( this.nodefony.autoloader.dirname );
            }catch(e){
                throw e ;
            }
            try {
                shell.ln("-sf", this.nodefony.autoloader.dirname, this.nodefonyPath);
            }catch(e){
                throw e ;
            }
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
