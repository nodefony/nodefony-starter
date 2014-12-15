/*
 *
 *
 *
 *
 *
 *
 */
stage.ui.registerPlugin("container",function(){
	
	var normalize = function(val){

		switch ( stage.typeOf(val) ){
			case "object" :
				var tab = new Array(0, 0, 0, 0);
				
				if ( val.top )		tab[0] = val.top; 
				if ( val.right )	tab[1] = val.right; 
				if ( val.bottom )	tab[2] = val.bottom; 
				if ( val.left )		tab[3] = val.left;	
				return normalize( tab );
			break;
			case "string" :
				return normalize( val.replace(/ *$/, "").split(' ') );
			break;
			case "number" :
				return normalize ( new Array(val+"") );
			break;
			case "array" :
				switch(val.length){
					case 4:
						for(var i =0 ; i < val.length ; i++){
							val[i] = parseInt(val[i], 10);
						}
					break;
					case 1:
						val[0] = val[3] = val[2] = val[1] = parseInt(val[0], 10);
					break;	
					case 2:
						val[0] = val[2] = parseInt(val[0], 10);
						val[1] = val[3] = parseInt(val[1], 10);
					break;
					case 3:
						val[0] = parseInt(val[0], 10);
						val[2] = parseInt(val[2], 10);
						val[1] = val[3] = parseInt(val[1], 10);
					break;	
				}
				val["top"] = val[0];
				val["right"] = val[1];
				val["bottom"] = val[2];
				val["left"] = val[3];
				return val ;	
			break;
			default:
				return normalize( new Array(0, 0, 0, 0) );
		}
	
	}

	var extractDims = function(val, type){
		var tab =  normalize(val);
		var obj = {};
		switch (type){
			case "border" :
				obj[type+"TopWidth"] = tab.top;
				obj[type+"RightWidth"] = tab.right;
				obj[type+"BottomWidth"] = tab.bottom;
				obj[type+"LeftWidth"] = tab.left;
			break;
			case "margin" :
			case "padding" :
				obj[type+"Top"] = tab.top;
				obj[type+"Right"] = tab.right;
				obj[type+"Bottom"] = tab.bottom;
				obj[type+"Left"] = tab.left;
			break;
			default:
		}		
		return obj
	};

	//FOCUS MANAGER
	var zindex_global = 10000;
	var currentFocus = null;
	var tabindex_global = 1;
	var focusManager = function(element, eventsManager/*delegate events manager*/){		
		this.element = element;
		this.notificationsCenter = eventsManager || stage.notificationsCenter.create() ;
		// make the element focusable
		this.element.attr("tabindex", tabindex_global);
		tabindex_global += 1;
		// listen focus
		this.element.bind( "focus", function(event){		
			zindex_global += 1;
			this.zindex = zindex_global ;
			currentFocus =  this.element;
			this.element.css( "z-index", zindex_global);
			this.element.addClass("focusable");
			this.notificationsCenter.fire("onFocus", event);
		}.bind(this));		
		
		this.element.bind( "blur", function(event){	
			this.element.removeClass( "focusable");
			this.notificationsCenter.fire("onBlur", event);
		}.bind(this));		
	};

	focusManager.prototype.focus = function(){	
		return this.element.focus();
	};

	focusManager.prototype.blur = function(){
		return this.element.blur();	
	};

	var defaultSettings = {
		id		: null,
		html		: null,
		render		: true,	
		width		: "auto",
		height		: "auto",
		top		: "auto",
		left		: "auto",
		position	: "auto", // center || centerFixe 
		border		: "auto",
		bodyPadding	: "auto",
		margin		: "auto",
		// CSS 
		containerClass	: "",
		containerStyle	: "",
		bodyClass	: "",
		bodyStyle	: "",
		// behavoir
		animate		: false,
		draggable	: false,
		resizable	: false,
		focusable	: false,
		autofocus	: false,
	};
 
	var Container = function(element, settings){
		this.container = element || $(document.createElement("div")) ;
		this.settings = $.extend(true, {}, defaultSettings, settings);
		this.settings.focusable ?  this.focusable = this.container : null;
		this.notificationsCenter = stage.notificationsCenter.create(this.settings, this);
		this.parent = this.settings.appendTo /*|| element ? element.parent() : null*/ || $(document.body) ;
		this.build();
	};
	
	Container.prototype.getCurrentFocus = function(){
		return  currentFocus ;
	};

	Container.prototype.resetFocus = function(){
		if (this.settings.focusable){
			this.focus();	
		}else{
			var focus = this.getCurrentFocus();
			if ( focus )
				focus.blur();
		}
	};

	Container.prototype.buildContainer = function(){
		if ( this.settings.containerClass )
			this.container.addClass(this.settings.containerClass);
		if ( this.settings.containerStyle )
			this.container.css(this.settings.containerStyle);
	
		this.rowBody = $(document.createElement("div")).addClass("row");
		
		return this.rowBody ;
	};

	Container.prototype.buildBody = function(){
		this.body =  $(document.createElement("div"));	
		if ( this.settings.bodyClass )
			this.body.addClass(this.settings.bodyClass);
		if ( this.settings.bodyStyle )
			this.body.css(this.settings.bodyStyle);
		this.rowBody.append(this.body)
		return this.body ;
	};	

	/*
 	 *	
 	 */
	Container.prototype.build = function(){

		// Container
		this.buildContainer();
		// body	
		this.buildBody();

		// insert in dom 
		this.parent.append(this.container);
		this.container.append(this.rowBody);

		// manage behavior
		if(this.settings.draggable)
			this.draggable();

		if(this.settings.resizable)
			this.resizable();

		if(this.settings.focusable){
			this.focusManager = new focusManager(this.focusable, this.notificationsCenter);
			this.focus = this.focusManager.focus.bind(this.focusManager) ;
			this.blur = this.focusManager.blur.bind(this.focusManager)
		}

		/*********************/
		/*  RENDER CONTAINER */
		/*********************/
		if(this.settings.render){
			this.render();
		}
	};

	Container.prototype.draggable = function(settings){
		this.draggable = this.container.draggable($.extend({}, this.settings.draggable, settings));
	};

	Container.prototype.resizable = function(settings){
		this.resizable = this.container.resizable($.extend({}, this.settings.resizable, settings));
	};

	Container.prototype.destroy = function(){
		this.container.remove();
	};

	Container.prototype.renderBody = function(){
			
		if (this.settings.html)
			this.html();
	};


	Container.prototype.render = function(settings){
		if ( settings )
			this.settings = $.extend( true, {}, this.settings, settings);

		if ( this.settings.focusable && this.settings.autofocus ){
			this.focus();
		}

		// Apply to body container
		this.renderBody();

		var css = {};

		// manage size
		if ( this.settings.width !== "auto" ){
			this.width = this.settings.width ;
			css["width"] = this.width ;
		}else{
			this.width = this.container.width();
		}
		if ( this.settings.height !== "auto" ){
			this.height = this.settings.height ;
			css["height"] = this.height ;
		}else{
			this.height = this.container.height();
		}

		// manage position
		if ( this.settings.top !== "auto" ){
			this.top = this.settings.top ;
			css["top"] = this.top ;
		}
		if ( this.settings.left !== "auto" ){
			this.left = this.settings.left ;
			css["left"] = this.left ;
		}

		// margin 
		if ( this.settings.margin !== "auto" ){
			this.margin = extractDims(this.settings.margin, "margin") ;
			$.extend(css, this.margin)
		}
		// border
		if ( this.settings.border !== "auto" ){
			this.border = extractDims( this.settings.border, "border") ;
			//css["border"] = this.border ;
			$.extend(css, {"border-style":"solid"}, this.border)
		}

		// padding
		if ( this.settings.bodyPadding !== "auto" ){
			this.bodyPadding = extractDims(this.settings.bodyPadding, "padding") ;
			this.body.css( this.bodyPadding );
		}
		
		switch(this.settings.position){
			case "auto" :
				this.container.css( css );
			break;
			case "center" :
				var viewport = stage.ui.viewport();
				this.left = ( (viewport.scrollLeft + viewport.width) / 2 ) - ( this.width / 2 ) ;                   
				this.top = ( (viewport.scrollTop + viewport.height) / 2 ) - ( this.height /2 ) ; 
				css["left"] = this.left ;
				css["top"] = this.top ;
				css["position"] = "absolute" ;
			break;
			case "centerFixed" :
				var viewport = stage.ui.viewport();
				this.left = ( (viewport.width / 2 ) - ( this.width/ 2 ) ) ;                   
				this.top = ( (viewport.height / 2 ) - ( this.height/ 2 ) ) ; 
				css["left"] = this.left ;
				css["top"] = this.top ;
				css["position"] = "fixed" ;
			break;
			default:
				css["position"] = this.settings.position ;
		}

		// Effects
		if (this.settings.animate ){
			var options = $.extend(true, {}, this.settings.animate.options );
			
			options.always =  function(animation){
				if (this.settings.animate.options.always && typeof this.settings.animate.options.always === "function")
					this.settings.animate.options.always.apply(this, arguments);
				this.notificationsCenter.fire("onRender", this);
			}.bind(this);
			if ( this.settings.animate.properties ){
				this.container.animate(this.settings.animate.properties, options);
			}else{
				this.container.animate(css, options);
			}
			return ;
		}

		// Apply to container
		this.container.css( css );
		this.notificationsCenter.fire("onRender", this);
 	};

	Container.prototype.html = function(ele){
		this.body.append(ele || this.settings.html);
	};

	return Container;

});
