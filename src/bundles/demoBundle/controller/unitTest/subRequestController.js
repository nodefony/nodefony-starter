/*
 *
 *
 *
 *	CONTROLLER test unit
 *
 *
 *
 *
 */

nodefony.registerController("subrequest", function(){

	var subRequestController = class subRequestController extends nodefony.controller {

		constructor(container, context){
			super(container, context);
		};


		indexAction (){
		
			return this.render("demoBundle:unitTest:subrequest.html.twig", {title:"sub-request"});
		}

		subAction(){
			//console.log("PASS")
			return this.renderResponse("<h1>SUB-REQUEST</h1>");
		}

		sub2Action(){
			//console.log("PASS2")
			return this.renderResponse("<h1>SUB-REQUEST-2</h1>");
		}
		sub3Action(){
			//console.log("PASS3")
			return this.renderJson({foo:"bar"});
		}
	}
	return subRequestController ;
});

