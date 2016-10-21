stage.register.call(callContact, 'console', function(){
	
	var getBlockContainer = function(){
		return $('<div/>', {class: "consoleContainer"}).append($('<div/>', {class: "scroll"}));
	};
	
	var getLogsContainer = function(){
		return $('<table/>', {class: "tableConsole"});
	};
	
	var getIcon = function(severity){
		switch(severity){
			case "info":
				return "info-circle";
				break;
				
			case "warning":
				return "warning";
				break;
				
			case "error":
				return "times-circle";
				break;
				
			case "debug":
				return "bug";
				break;
				
			default:
				return "check";
		}
	};
	
	var getColor = function(severity){
		switch(severity){				
			case "error":
				return "danger";
				break;
				
			case "debug":
				return "success";
				break;
				
			default:
				return severity;
		}
	};
	
	var colSeverity = function(severity){
		return $('<span/>', {title: severity, class: "default-cursor text-" + getColor(severity) + " fa fa-" + getIcon(severity)});
	};
	
	var colDate = function(timestamp){
		var date = new Date(timestamp);
		var html = /*date.getDay()+'/'+date.getMonth()+'/'+date.getFullYear() + ' <br/>' + */date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		return $('<div/>', {class: "consoleDate", html: html});
	};
	
	var colMsgId = function(msgid){
		return $('<span/>', {class: "label label-default", text: msgid});
	};
	
	var colPayload = function(pdu){
		if(typeof(pdu.payload) == 'object'){
			
			var message = (pdu.msgid == "SIP" ? payloadMessageSip(pdu.payload) : payloadMessageWebrtc(pdu.payload));
			
			return $('<button/>', {type: 'button', class: "btn btn-xs btn-default", text: "Voir", click: function(){
				callContact.tools.alert('LOGS ' + pdu.msgid, '<pre>' + message + '</pre>', 'large', null, pdu.severityName.toLowerCase());
			}});
		} else {
			return pdu.payload;
		}
	};
	
	var colDir = function(event){
		return $('<span/>', {class: "label label-info", text: (event == 'onSend' ? 'SEND': 'RECEIVE')});
	};
	
	var colWord = function(payload){
		return $('<span/>', {class: "", text: (payload.event == 'onSend' ? '' : payload.message.method)});
	};
	
	var payloadMessageSip = function(payload){
		switch ( payload.event ){
			case "onSend" :
				return payload.message ;
			break;
			case "onMessage" :
				return payload.message ; 
			default :
				return payload ;

		}
		return payload.event == 'onSend' ? payload.message : payload.message.rawResponse;
	};
	
	var payloadMessageWebrtc = function(payload){
		return payload.message;
	};
	
	var colsSip = function(container, pdu){
		
		container.append($('<td/>', {class: "col-xs-2 text-center", html: colDate.call(this, pdu.timeStamp)}));
		container.append($('<td/>', {class: "col-xs-1 text-center"}).append(colSeverity.call(this, pdu.severityName.toLowerCase())));
		container.append($('<td/>', {class: "col-xs-3 text-center"}).append(colMsgId(pdu.msgid)));
		container.append($('<td/>', {class: "col-xs-1 text-center"}).append(colDir(pdu.payload.event)));
		container.append($('<td/>', {class: "col-xs-2 text-center"}).append(colWord(pdu.payload)));
		container.append($('<td/>', {class: "col-xs-3 ellipsis text-center"}).append(colPayload.call(this, pdu)));
	};
	
	var colsWebrtc = function(container, pdu){
		
		container.append($('<td/>', {class: "col-xs-2 text-center", html: colDate.call(this, pdu.timeStamp)}));
		container.append($('<td/>', {class: "col-xs-1 text-center"}).append(colSeverity.call(this, pdu.severityName.toLowerCase())));
		container.append($('<td/>', {class: "col-xs-3 text-center"}).append(colMsgId(pdu.msgid)));
		container.append($('<td/>', {class: "col-xs-1 text-center"}));
		container.append($('<td/>', {class: "col-xs-2 text-center"}));
		container.append($('<td/>', {class: "col-xs-3 ellipsis text-center"}).append(colPayload.call(this, pdu)));
	};
	
	var colsDefault = function(container, pdu){
		
		container.append($('<td/>', {class: "col-xs-2 text-center", html: colDate.call(this, pdu.timeStamp)}));
		container.append($('<td/>', {class: "col-xs-1 text-center"}).append(colSeverity.call(this, pdu.severityName.toLowerCase())));
		container.append($('<td/>', {class: "col-xs-3 text-center"}).append(colMsgId(pdu.msgid)));
		container.append($('<td/>', {class: "col-xs-1 text-center"}));
		container.append($('<td/>', {class: "col-xs-2 text-center"}));
		container.append($('<td/>', {class: "col-xs-3 ellipsis text-center"}).append(colPayload.call(this, pdu)));
	};
	
	var createLine = function(type, pdu){
		//console.log(pdu);
		var line = $('<tr/>', {class: "row"});
		
		switch(type){
			case "sip":
				colsSip(line, pdu);
				break;
			case "webrtc":
				colsWebrtc(line, pdu);
				break;
				
			default: 
				colsDefault(line, pdu);
		}
		
		
		
		return line;
	};
	
	var logConsole = function(kernel, container){
		this.kernel = kernel;
		this.container = container || $('body .blockDialTable');
		this.storage = new callContact.browserStorage("local");
		this.state = this.storage.get("console_debug");
	};
	
	logConsole.prototype.init = function(buttonCallback){
		this.logsContainer = getLogsContainer.call(this);
		this.blockContainer = getBlockContainer.call(this);
		this.container.append(this.blockContainer);	
		this.blockContainer.find('.scroll').append(this.logsContainer);
		
		buttonCallback(this.state);
	};
	
	logConsole.prototype.consoleOpen = function(){
		console.log('consoleOpen');
		this.blockContainer.show();
		this.logsContainer.addClass('m-t-xs m-b-xs');
		this.storage.set("console_debug", true);
	};
	
	logConsole.prototype.consoleClose = function(){
		this.blockContainer.hide();
		this.logsContainer.removeClass('m-t-xs m-b-xs');
		this.storage.set("console_debug", false);
	};
	
	logConsole.prototype.logWebrtc = function(pdu){
		this.logsContainer.prepend(createLine.call(this, "webrtc", pdu));
	};
	
	logConsole.prototype.logSip = function(pdu){
		this.logsContainer.prepend(createLine.call(this, "sip", pdu));
	};
	
	logConsole.prototype.logApi = function(pdu){
		this.logsContainer.prepend(createLine.call(this, pdu.api, pdu));
	};
	
	return logConsole;
	
});


/*

// EVENTS LOAD 
    var load = function(){
        this.debugbar = document.getElementById("nodefony-container");
        this.smallContainer = document.getElementById("nodefony-small");
        this.nodefonyClose = document.getElementById("nodefonyClose");

        var storage = new browserStorage("local");
        var state = storage.get("nodefony_debug") ;
        if ( state === false){
            removeClass( this.smallContainer, "hidden" );   
            addClass( this.debugbar, "hidden" );
        }

        this.listen(this.nodefonyClose, "click", function(event){
            //var ev = new coreEvent(event);
            removeClass( this.smallContainer, "hidden" );    
            addClass( this.debugbar, "hidden" );    
            storage.set("nodefony_debug",false);
            //ev.stopPropagation();
        }.bind(this))

        this.listen(this.smallContainer, "click", function(event){
            //var ev = new coreEvent(event);
            removeClass(  this.debugbar, "hidden" )    ;
            addClass( this.smallContainer, "hidden" );
            storage.set("nodefony_debug",true);
            //ev.stopPropagation();    
        }.bind(this))
    };


*/
