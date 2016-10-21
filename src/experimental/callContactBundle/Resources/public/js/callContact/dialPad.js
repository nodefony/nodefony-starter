
stage.register.call(callContact, 'dialPad', function(){
	
	var dialPad = function(container, input){
		this.container = container;
		this.input = input;
	};
	
	dialPad.prototype.build = function(callback){
		this.container.append( 
			'<div class="dialPadContainer">\
				<div class="key" rel="1">1</div>\
			    <div class="key" rel="2">2<span>abc</span></div>\
			    <div class="key" rel="3">3<span>def</span></div>\
			    <div class="clear"></div>\
			    <div class="key" rel="4">4<span>ghi</span></div>\
			    <div class="key" rel="5">5<span>jkl</span></div>\
			    <div class="key" rel="6">6<span>mno</span></div>\
			    <div class="clear"></div>\
			    <div class="key" rel="7">7<span>pqrs</span></div>\
			    <div class="key" rel="8">8<span>tuv</span></div>\
			    <div class="key" rel="9">9<span>wxyz</span></div>\
			    <div class="clear"></div>\
			    <div class="key special" rel="*">*</div>\
			    <div class="key" rel="1">0<span>oper</span></div>\
			    <div class="key special" rel="#">#</div>\
		    </div>'
		);
		
		$('.key').click(callback ||function(ev){
			this.input.val(this.input.val() + $(ev.currentTarget).attr('rel'));
			ev.stopPropagation();
		}.bind(this));
	};
	
	
	
	return dialPad;	
});
