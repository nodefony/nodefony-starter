/*
 *
 *
 *
 *
 *
 *
 */


stage.ui.registerPlugin("panel",function(){


	var defaultSettings = {
		headers:{
			title:"Panel"
		},
		// close button
		closable	: true,
		closeText	: "",
		containerClass	: "panel",
		containerStyle	: "",
		bodyClass	: "fxoWidget-cell fxoWidget-content",	
	};

	var Panel = function(element, settings){
	
		this.mother = this.$super ;
		this.mother.constructor(element, $.extend(true, {}, defaultSettings, settings));
		
	}.herite(stage.ui.plugins.container);


	Panel.prototype.buildContainer = function(){
		this.buildHeader();
		this.mother.buildContainer();	
	};
	
	Panel.prototype.buildHeader = function(){

		this.rowHead = $(document.createElement("div"));
		this.rowHead.addClass('row');
		this.header = $(document.createElement("div"));
		this.header.addClass('head');
		if (this.settings.draggable )
			this.header.addClass("draggable");

		this.rowHead.append(this.header);
		this.container.append(this.rowHead) ;	
		this.buildTitle();
		if (this.settings.closable){
			this.buildClosable();
		}
	};


	Panel.prototype.draggable = function(){
		
		this.header.bind("click", function(){
			this.resetFocus();
		}.bind(this));

		this.mother.draggable({
			handle : (this.header?this.header:null)	,
			start: function( event, ui ) {
				this.resetFocus();
			}.bind(this)
		});
	};

	Panel.prototype.resizable = function(){
		this.mother.resizable({
			start: function( event, ui ) {
				this.resetFocus();
			}.bind(this)
		});
	};



	Panel.prototype.buildTitle = function(){
		var title = $(document.createElement("div"));
		title.addClass('title');
		title.html(this.settings.headers.title);
		this.header.append(title);
	
	};

	Panel.prototype.buildClosable = function(){
		var icon = $(document.createElement('span')).addClass("glyphicon glyphicon-remove form-control-feedback pull-right");
		this.header.append(icon);	
		icon.bind("click", function(event){
			this.destroy();	
			this.notificationsCenter.fire("onClose", event)
		}.bind(this))
	}


	jQuery.fn.panel = function(settings){
		for (var i =0 ; i < this.length ;i++){
			var inst = new  Panel($(this[i]), settings);
			jQuery.data( this[i], inst );
		}
		return this;
	};


	return Panel ;

});
