

stage.register.call(callContact, 'tools', function(){

	
	
	
	var createModal = function(title, message, options){
		
		var widthClass = (options.widthClass ? options.widthClass : 'md');
		var dom = '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalAlert" style="display: none;">\
			<div class="modal-dialog modal-' + widthClass + '" role="document">\
				<div class="modal-content">\
					<div class="modal-header' + (options.modalType ? ' modal-header-' + options.modalType : '') + '">\
						<button type="button" class="close btn-close" data-dismiss="modal" aria-label="Close">\
							<span aria-hidden="true">×</span>\
						</button>\
						<h4 class="modal-title">' + title + '</h4>\
					</div>\
					<div class="modal-body"></div>\
					<div class="modal-footer">\
						<button type="button" class="btn btn-default btn-cancel" data-dismiss="modal">' + (options.lang && options.lang.close ? options.lang.close : 'Fermer') + '</button>\
						';
						if(options.accept && options.accept.callback) {
							dom +='<button type="button" class="btn btn-default btn-validation" data-dismiss="modal">' + (options.lang && options.lang.accept ? options.lang.accept : 'Valider') + '</button>';
						}
						dom += '\
					</div>\
				</div>\
			</div>\
		</div>';
		
		
		var $modal = $(dom);
		
		if(options.accept && options.accept.callback) {
			$modal.find('.btn-validation').click(function(callback){
				callback();
			}.bind($modal, options.accept.callback));
		}
		
		if(options.cancel && options.cancel.callback) {
			$modal.find('.btn-close, .btn-cancel').click(function(callback){
				callback();
			}.bind($modal, options.cancel.callback));
		}
		
		$("body").append($modal);
		
		$modal.find('.modal-body').html(message);
		
		$modal.on('show.bs.modal', function(event) {
		    var idx = $('.modal:visible').length;
		    $(this).css('z-index', 2040 + (10 * idx));
		});
		$modal.on('shown.bs.modal', function(event) {
		    var idx = ($('.modal:visible').length) -1; 
		    $('.modal-backdrop').not('.stacked').css('z-index', 2039 + (10 * idx));
		    $('.modal-backdrop').not('.stacked').addClass('stacked');
		});

		
		$modal.on('hidden.bs.modal', function (e) {
			 $(this).remove();
		});		
		
		$modal.modal({
			show: true,
			keyboard: false,
			backdrop: "static"
		});		
		
		return $modal;
	};
	
	var alert = function(title, message, widthClass, callbackCancel, modalType){
		
		this.callbackCancel = callbackCancel;
		
		this.modal = createModal(title, message, { 
			widthClass: widthClass || 'md',
			modalType: modalType,
			cancel: {
				callback: callbackCancel
			},
		});
	};
	
	alert.prototype.close = function(){
		if(this.callbackCancel) this.callbackCancel();
		this.modal.modal('hide');
	};
	
	var confirm = function(title, message, callback, callbackCancel, widthClass, modalType){
		
		this.callback = callback;
		this.callbackCancel = callbackCancel;
		
		this.modal = createModal(title, message, {
			widthClass: widthClass || 'md',
			modalType: modalType,
			accept: {
				callback: callback
			},
			cancel: {
				callback: callbackCancel
			},
			lang: {
				close: 'Annuler',
				accept: 'Confirmer ?'
			}
		});
	};
	
	confirm.prototype.cancel = function(){
		if(this.callbackCancel) this.callbackCancel();
		this.modal.modal('hide');
	};
	
	confirm.prototype.accept = function(){
		if(this.callback) this.callback();
		this.modal.modal('hide');
	};
	
	
	
	var tools = {};
	
	tools.alert = function(title, message, widthClass, callbackCancel, modalType){
		return new alert(title, message, widthClass, callbackCancel, modalType);
	};
	
	
	tools.confirm = function(title, message, callback, callbackCancel, widthClass, modalType){		
		return new confirm(title, message, callback, callbackCancel, widthClass, modalType);
	};	
	
	
	return tools;
});
