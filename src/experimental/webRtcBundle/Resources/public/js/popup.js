
nodefony.register.call(nodefony.ui, "Popup", function(){

	var defaultOptions = {
		modal: {
			backdrop: true,
			keyboard: true,
			show: true,
			remote: false
		}
	};
	
	var defaultEvents = {
		
		"show.bs.modal": function () {
			
			$(this).css('display', 'block');
			var md = $(this).find('.modal-dialog');
			var mdH = md.height(); 
		var scH = $(document).outerHeight();
		if (scH > 380 && (mdH + 60) < scH) {
			md.css('margin-top', (scH / 2) - (mdH/2));
		} else {
			md.css('margin-top', '');
		}
	
		var idx = $('.modal:visible').length;
		$(this).css('z-index', 1040 + (10 * idx));  
		
	},
	
	"shown.bs.modal": function () {
			
			var idx = $('.modal:visible').length;
		$('.modal-backdrop').not('.stacked').css('z-index', 1039 + (10 * idx));
		$('.modal-backdrop').not('.stacked').addClass('stacked');

		},
		
		"hidden.bs.modal": function () {
			$(this).remove();
		}
	};
	
	var getHtml = function(container){
		container.append('\
		<div class="modal fade" id="popup-' + this.id + '" tabindex="-1" role="dialog" aria-labelledby="modalLabel' + this.id + '" aria-hidden="true">\
			<div class="modal-dialog  modal-dialog-center ' + this.options.widthClass + '">\
				<div class="modal-content">\
					<div class="modal-header">\
						<h4 class="modal-title" id="modalLabel' + this.id + '">' + this.title + '</h4>\
					</div>\
					<div class="modal-body">' + this.content + '</div>\
					' + 
					(this.callbackButtons ? '<div class="modal-footer">\
						<button type="button" id="butCancel" class="btn btn-default" data-dismiss="modal">' + (this.cancelTitle ? this.cancelTitle : 'Close') + '</button>\
        				<button type="button" id="butAccept" class="btn btn-primary" data-dismiss="modal">' + (this.acceptTitle ? this.acceptTitle : 'Accept') + '</button>\
					</div>' : '')
					+ '\
				</div>\
			</div>\
		</div>');

		if(this.callbackButtons){
			container.find('#butCancel').click(function(){
				this.callbackButtons(true, false);
			}.bind(this));
			container.find('#butAccept').click(function(){
				this.callbackButtons(false, true);
			}.bind(this));
		}
		
	};
	
	var applyEvent = function(){

		for(var eventName in defaultEvents) {
			this.entity.on(eventName, defaultEvents[eventName]);
		}
		
		if(this.options.events){
			for(var eventName in this.options.events) {
				this.entity.on(eventName, this.options.events[eventName]);
			}
		}
	};
	
	var applyModalOptions = function(){
		this.entity.modal(this.options.modal);
	};

	var Popup = function Popup (options) {
		this.options = nodefony.extend(true, {}, defaultOptions, options || {});
		this.id = (new Date).getTime();
		this.entity = null;
	};
	
	Popup.prototype.setTitle = function(title) {
		this.title = title;
		if(this.entity) this.entity.find('.modal-title').html(title);
		return this;
	};
	
	Popup.prototype.setWidth = function(widthType) {
		this.options.widthClass = '';
		if(widthType){
			switch(widthType){
				case 'large':
					this.options.widthClass = 'modal-lg';
					break;
				case 'small':
					this.options.widthClass = 'modal-sm';
					break;
			}
		}
		if(this.entity) $(this.entity.find('.modal-dialog')).addClass(widthClass);
		return this;
	};
	
	Popup.prototype.setContent = function(content) {
		this.content = content;
		if(this.entity) this.entity.find('.modal-body').html(content);
		return this;
	};
	
	Popup.prototype.getContentContainer = function(){
		return (this.entity ? this.entity.find('.modal-body') : null);
	};
	
	Popup.prototype.setEvents = function(events) {
		this.options.events = events;
		return this;
	};
	
	Popup.prototype.setModalOptions = function(modal) {
		this.options.modal = nodefony.extend(this.options.modal, modal);
		return this;
	};
	
	Popup.prototype.appendTo = function(container) {
		getHtml.call(this, container);
		this.entity = $('#popup-' + this.id);
		if(this.options.cssClass) this.entity.addClass(this.options.cssClass);
		applyEvent.call(this);
		applyModalOptions.call(this);
		return this;
	};
	
	Popup.prototype.addClass = function(cssClass) {
		if(!this.options.cssClass) this.options.cssClass = '';
		this.options.cssClass = this.options.cssClass + ' ' + cssClass;
		if(this.entity) this.entity.addClass(cssClass);
		return this;
	};
	
	Popup.prototype.removeClass = function(cssClass) {
		var tabClass = this.options.cssClass.split(' ');
		if(this.entity) this.entity.removeClass(cssClass);
		return this;
	};

	Popup.prototype.addConfirmButtons = function(cancelTitle, acceptTitle, callbackButtons){
		this.cancelTitle = cancelTitle;
		this.acceptTitle = acceptTitle;
		this.callbackButtons = callbackButtons;
		if(this.entity){
			this.entity.find('.modal-footer *').remove();
			var container = this.entity.find('.modal-footer');
			
			var cancel = $(document.createElement('div'))
							.addClass('btn btn-default')
							.attr('data-dismiss', 'modal')
							.text(cancelTitle);
			container.append(cancel);
			cancel.click(function(){
				this.callbackButtons(true, false);
			}.bind(this));

			var accept = $(document.createElement('div'))
							.addClass('btn btn-primary')
							.attr('data-dismiss', 'modal')
							.text(acceptTitle);
			container.append(accept);
			accept.click(function(){
				this.callbackButtons(false, true);
			}.bind(this));
		}
	};
	
	Popup.prototype.show = function(){
		if(this.entity) this.entity.modal('show');
		return this;
	};
	
	Popup.prototype.hide = function(){
		if(this.entity) this.entity.modal('hide');
		return this;
	};
	
	return Popup;
});


nodefony.register.call(nodefony.ui, "Confirm", function(){
	return function(title, content, callback){	
		var popup = new nodefony.ui.Popup();
		popup.setTitle(title);
		popup.setContent(content);
		
		popup.setModalOptions({
			backdrop: "static",
			keyboard: false
		});
		popup.addConfirmButtons('Annuler', 'Accepter', callback);
		popup.appendTo($('body'));
		popup.show();

		return popup;
	}
});


