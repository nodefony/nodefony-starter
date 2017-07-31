#!/usr/bin/env node
"use strict;"
const path = require("path");
const fs = require("fs");
const execSync = require('child_process').execSync ;


const packageManager = class packageManager {

    constructor(checkGlobal){
        this.yarn = this.checkYarn() ;
        this.npm = this.checkNpm() ;
        if ( ! (this.npm || this.yarn ) ){
            let error = new Error ("node.js Packages manager not found ") ;
            console.error("Try to install npm or yarn package manager ")
            throw error;
        }
        this.globalNpm = null ;
        this.globalYarn = null ;
        if ( checkGlobal ){
                this.checkGlobalYarn();
                this.checkGlobalNpm();
        }
    }

    checkYarn (){
        try{
            return  require("yarn");
        }catch(e){
            return  false ;
        }
    }

    checkNpm(){
        try{
            return require("npm");
        }catch(e){
            return  false ;
        }
    }

    checkGlobalNpm (){
        let res = null ;
        try {
            res = execSync("npm list --depth 1 --global npm",{
                encoding:"utf8"
            });
            if ( res ){
                this.globalYarn = true ;
                return true ;
            }
            this.globalYarn = false ;
            return false ;
        }catch(e){
            this.globalYarn = null ;
            throw e ;
        }
    }
    checkGlobalYarn (){
        let res = null ;
        try {
            res = execSync("npm list --depth 1 --global yarn",{
                encoding:"utf8"
            });
            if ( res ){
                this.globalYarn = true ;
                return true ;
            }
            this.globalYarn = false ;
            return false ;
        }catch(e){
            this.globalYarn = null ;
            throw e ;
        }
    }

}


module.exports = packageManager ;
