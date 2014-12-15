/*
 *
 *
 *
 *
 *
 *
 *
 */

stage.register("ui",function(){

	
	var viewport =  function(element){
		return {
			width		: $(element || window).width(),
			height		: $(element || window).height(),
			scrollLeft	: $(element || window).scrollLeft(),
			scrollTop	: $(element || window).scrollTop()
		}
	};

	var logUI = function(){
		this.motherSyslog = this.$super ;
		this.motherSyslog.constructor({
			defaultSeverity:"INFO"
		});
		this.viewport = viewport();
		$(document).ready(function(){
			this.viewport = viewport();
		}.bind(this));
		/*$(window).resize(function(){
			this.viewport = viewport();
			for (var ele in  this.uiStack){
				this.uiStack[ele].render({
					animate:false	
				});	
			}	
		}.bind(this));*/		
		this.uiStack = {};
	}.herite(stage.syslog);


	logUI.prototype.cleanUIlog = function(timeStamp){
		if (timeStamp){
			if ( this.uiStack[timeStamp] ){
				this.uiStack[timeStamp].destroy();
				return delete this.uiStack[timeStamp];
			}
		}
		for (var ele in this.uiStack){
			this.uiStack[ele].destroy();
			delete 	this.uiStack[ele];
		}
	}

	logUI.prototype.fade = function(ele, time, pduTimestamp){
		setTimeout( function(){
			ele.fadeOut({
				duration:2000,
				complete:function(){
					this.cleanUIlog(pduTimestamp)
					//ele.destroy();	
					//delete this.uiStack[pduTimestamp];
				}.bind(this)	
			});
		
		}.bind(this), time);	
	};

	logUI.prototype.notice = function(pdu){
		var myLog = new stage.ui.plugins.panel(null, {
			html		:pdu.payload,
			//appendTo:$("body"),
			headers		:{
				title:"LOG"
			},
			width		: 300,
		        height		: 100,
			closable	: true,
			//focusable	: true,
			position	: "center",
			containerClass	: "panel info",
			bodyClass	: "body",
			draggable	: {
				handle:".draggable"
			},
			resizable	: true,
			animate:{
				options:{
					duration:2000,
					//easing:"easeOutBounce"
				}
			}	    
		});
		if (myLog) this.uiStack[pdu.timeStamp] = myLog;
	};


	logUI.prototype.info = function(pdu){
		
		var myLog = new stage.ui.plugins.panel(null, {
			html:pdu.payload,
			//appendTo:$("body"),
			headers		:{
				title:"INFO"
			},
			width		: 300,
		        height		: 100,
			closable	: false,
			//focusable	: true,
			//autofocus	: true,
			containerClass	: "panel info",
			bodyClass	: "body",
			animate:{
				properties:{left:800,top:50},
				options:{
					duration:2000,
					//easing:"easeOutBounce"
				}
			}
		});
		if (myLog) this.uiStack[pdu.timeStamp] = myLog;
		this.fade(myLog.container, 5000, pdu.timeStamp);

	};

	logUI.prototype.error = function(pdu){
		var middle =  (this.viewport.width / 2) - 150 ;
		var myLog = new stage.ui.plugins.panel(null, {
			html		:pdu.payload,
			//appendTo:$("body"),
			headers:{
				title:"ERROR"
			},
			width		: 300,
		        height		: 100,
			top		: -200,
			left		: middle,   	    
			closable	: true,
			containerClass	: "panel info",
			bodyClass	: "body",
			animate:{
				properties:{top:0},
				options:{
					duration:2000,
					//easing:"easeOutBounce"
				}
			}
		});
		if (myLog) this.uiStack[pdu.timeStamp] = myLog;
		this.fade(myLog.container, 9000, pdu.timeStamp);
	};

	logUI.prototype.warning = function(text){

	};

	logUI.prototype.debug = function(pdu){

	};

	/*
 	 *	GLOBAL UI LOG
 	 */
	var log = new logUI();
	log.listenWithConditions(log, {
		severity:{
			data:"INFO"
		}
	}, log.info);
	log.listenWithConditions(log, {
		severity:{
			data:"NOTICE"
		}
	}, log.notice);
	log.listenWithConditions(log, {
		severity:{
			data:"ERROR"
		}
	}, log.error);
	log.listenWithConditions(log, {
		severity:{
			data:"DEBUG"
		}
	}, log.debug);
	log.listenWithConditions(log, {
		severity:{
			data:"WARNING"
		}
	}, log.warning)


	var registerPlugin = function(name, closure){
		if (name in this.plugins ) 
			throw new Error("PLUGIN NAME ALREADY register :  "+name+" PLUGIN ");

		if (! name || typeof name !== "string") {
			throw new Error("REGISTER PLUGIN : name is undefined or bad format argument");
		}
		if (! closure || typeof closure !== "function" ){
			throw new Error("REGISTER PLUGIN : closure is udefined or bad format argument ");
		}
		return this.plugins[name] = closure();
	}


	return {
		plugins:{},
		classLog:logUI,
		viewport:viewport,
		log:function(text){
			var PDU = new stage.PDU(text, "NOTICE", "UI LOG");
			log.logger(PDU);
			return PDU;
		},
		info:function(text){
			var PDU = new stage.PDU(text, "INFO", "UI LOG");
			log.logger(PDU);
			return PDU;
		},
		error:function(text){
			var PDU = new stage.PDU(text, "ERROR", "UI LOG");
			log.logger(PDU);
			return PDU;
		},
		debug:function(text){
			var PDU = new stage.PDU(text, "DEBUG", "UI LOG");
			log.logger(PDU);
			return PDU;
		},
		warning:function(text){
			var PDU = new stage.PDU(text, "WARNING", "UI LOG");
			log.logger(PDU);
			return PDU;
		},
		logger:log.logger.bind(log),
		cleanUiLog:function(timeStamp){
			return log.cleanUIlog(timeStamp)
		},
		registerPlugin:registerPlugin
	
	}




});
