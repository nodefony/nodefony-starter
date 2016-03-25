$(document).ready(function(){


	$('#filer_input').filer({
		limit: 3,
		maxSize: 3,
		changeInput: true,
		addMore: true,
		showThumbs: true		
	}); 

	var uri = $('#form2').attr("data-uri");

	$('#filer_input2').filer({
    		changeInput: '<div class="jFiler-input-dragDrop"><div class="jFiler-input-inner"><div class="jFiler-input-icon"><i class="icon-jfi-cloud-up-o"></i></div><div class="jFiler-input-text"><h3>Drag&Drop files here</h3> <span style="display:inline-block; margin: 15px 0">or</span></div><a class="jFiler-input-choose-btn blue">Browse Files</a></div></div>',
    		showThumbs: true,
    		theme: "dragdropbox",
    		templates: {
        		box: '<ul class="jFiler-items-list jFiler-items-grid"></ul>',
        	item: '<li class="jFiler-item">\
                <div class="jFiler-item-container">\
                <div class="jFiler-item-inner">\
                <div class="jFiler-item-thumb">\
                <div class="jFiler-item-status"></div>\
                <div class="jFiler-item-info">\
                <span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name }}</b></span>\
                <span class="jFiler-item-others">{{fi-size2}}</span>\
                </div>\
        {{fi-image}}\
        </div>\
                <div class="jFiler-item-assets jFiler-row">\
                <ul class="list-inline pull-left">\
                <li>{{fi-progressBar}}</li>\
                </ul>\
                <ul class="list-inline pull-right">\
                <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>\
                </ul>\
                </div>\
                </div>\
                </div>\
                </li>',
        	itemAppend: '<li class="jFiler-item">\
                        <div class="jFiler-item-container">\
                        <div class="jFiler-item-inner">\
                        <div class="jFiler-item-thumb">\
                        <div class="jFiler-item-status"></div>\
                        <div class="jFiler-item-info">\
                        <span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name }}</b></span>\
                        <span class="jFiler-item-others">{{fi-size2}}</span>\
                        </div>\
                        {{fi-image}}\
        </div>\
                <div class="jFiler-item-assets jFiler-row">\
                <ul class="list-inline pull-left">\
                <li><span class="jFiler-item-others">{{fi-icon}}</span></li>\
                </ul>\
                <ul class="list-inline pull-right">\
                <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>\
                </ul>\
                </div>\
                </div>\
                </div>\
                </li>',
        	progressBar: '<div class="bar"></div>',
        	itemAppendToEnd: false,
        	removeConfirmation: true,
        	_selectors: {
			list: '.jFiler-items-list',
			item: '.jFiler-item',
			progressBar: '.bar',
			remove: '.jFiler-item-trash-action'
        	}
    		},
    		dragDrop: {
        		dragEnter: null,
        		dragLeave: null,
        		drop: null,
    		},
    		uploadFile: {
        		url: uri,
        		data: null,
        		type: 'POST',
        		enctype: 'multipart/form-data',
        		beforeSend: function(){},
        		success: function(data, el){
				var parent = el.find(".jFiler-jProgressBar").parent();
				el.find(".jFiler-jProgressBar").fadeOut("slow", function(){
					$("<div class=\"jFiler-item-others text-success\"><i class=\"icon-jfi-check-circle\"></i> Success</div>").hide().appendTo(parent).fadeIn("slow");    
				});
        		},
        		error: function(el){
				var parent = el.find(".jFiler-jProgressBar").parent();
            			el.find(".jFiler-jProgressBar").fadeOut("slow", function(){
                			$("<div class=\"jFiler-item-others text-error\"><i class=\"icon-jfi-minus-circle\"></i> Error</div>").hide().appendTo(parent).fadeIn("slow");    
				});
        		},
        		statusCode: null,
        		onProgress: null,
        		onComplete: null
    		}
	}); 

});

