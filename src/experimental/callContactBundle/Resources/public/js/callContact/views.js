
stage.register.call(callContact, 'views', function(){
	
	var views = function(container){
		
		this.mother = this.$super;
		
		this.container = container || $('body .blockDialTable');
		this.contentContainer = $('<div/>', {class: "container-dial-table"});
		this.container.append(
			$('<div/>', {class: "blockContainer"})
				.append(this.contentContainer)
		);
		
		this.container.attr('id', 'dial');
		this.api = null ;
	};
	
	views.prototype.clear = function(){
		this.contentContainer.empty();
	};	

	views.prototype.waitingPage = function(title){
		this.clear();
		this.contentContainer.append(
			$('<div/>', {
				class: "waitingBlock"
			}).append('<i class="fa fa-refresh fa-spin fa-10x fa-fw"></i><br/><h4 class="m-t-lg upper">' + title + '...</h4>')
		);
	};
	
	views.prototype.setConnected = function(container, title){
		var ele = container
			.empty().off()
			.append('<span title="Déconnecté" class="fa-stack fa-lg"><i class="fa fa-plug fa-stack-1x" title="' + (title ? title : 'Connecté') + '"></i></span>');
		ele.click(function(){
			console.log("try to disconnected")
			if ( this.api )
				this.api.close();
		}.bind(this))
	};
	
	views.prototype.setDisconnected = function(container, title){
		var ele = container
			.empty().off()
			.append('<span title="' + (title ? title : 'Déconnecté') + '" class="fa-stack fa-lg"><i class="fa fa-plug fa-stack-1x"></i><i class="fa fa-ban fa-stack-2x text-danger"></i></span>');
		ele.click(function(){
			console.log("try to Connected")
			if ( this.api )
				this.api.reConnect();
		}.bind(this)) 
	};
	
	views.prototype.addConsole = function(){
		this.contentContainer.append(
			$('<div/>', {class: "consoleContainer"})
		);
	};
	
	views.prototype.appendMediaTolocalUser = function(elem, stream){
		$('.localUser').empty().append(elem);
	};
	
	views.prototype.getLocalUserContainer = function(){
		return $('.localUser');
	};
	
	views.prototype.clearlocalUser = function(){
		$('.localUser').empty();
	};
	
	views.prototype.appendMediaToRemoteUsers = function(elem, media){
		$('.remoteUsers').empty().append(elem);
		
	};
	
	views.prototype.getRemoteUserContainer = function(){
		return $('.remoteUsers');
	};

	views.prototype.clearRemoteUser = function(){
		$('.remoteUsers').empty();
	};
	
	views.prototype.setApiName = function(apiName, api){
		this.apiName = apiName;
		this.api = api ;
		//var Klass = (apiName == 'NODEFONY' ? callContact.viewsCcapi : callContact.viewsDefault);
		var Klass = callContact.viewsDefault ;
		this.contentView = new Klass(this.container, this.contentContainer);
	};
	
	views.prototype.registerPage = function(){
		this.clear();
		this.contentView.registerPage.apply(this.contentView, arguments);
	};
	
	views.prototype.mediaPage = function(){
		this.clear();
		this.contentView.mediaPage.apply(this.contentView, arguments);
	};
	
	return views;
});
