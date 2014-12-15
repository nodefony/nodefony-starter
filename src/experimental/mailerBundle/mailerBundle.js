/*
 *
 *
 *
 */
nodefony.registerBundle ("mailer", function(){

    var mailer = function(kernel, container){
        // load bundle library 
        this.autoLoader.loadDirectory(this.path+"/core");

        this.mother = this.$super;
        this.mother.constructor(kernel, container);

        
    }

    return mailer;
});



