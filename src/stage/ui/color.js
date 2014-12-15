/*
 *
 *
 *
 *
 *
 */


stage.register( "color" , function(){

	var colorName = {
		aliceblue 	:"#F0F8FF",
		antiquewhite 	:"#FAEBD7",
		aqua		:"#00FFFF",
		aquamarine 	:"#7FFFD4",
		azure		:"#F0FFFF",
		beige		:"#F5F5DC",
		bisque		:"#FFE4C4",
		black		:"#000000",
		blanchedalmond 	:"#FFEBCD",
		blue		:"#0000FF",
		blueViolet 	:"#8A2BE2",
		brown		:"#A52A2A",
		burlywood 	:"#DEB887",
		cadetblue 	:"#5F9EA0",
		chartreuse 	:"#7FFF00",
		chocolate 	:"#D2691E",
		coral		:"#FF7F50",
		cornflowerblue 	:"#6495ED",
		cornsilk 	:"#FFF8DC",
		crimson 	:"#DC143C",
		cyan		:"#00FFFF",
		darkblue 	:"#00008B",
		darkcyan 	:"#008B8B",
		darkgoldenrod 	:"#B8860B",
		darkgray 	:"#A9A9A9",
		darkgreen 	:"#006400",
		darkkhaki 	:"#BDB76B",
		darkmagenta 	:"#8B008B",
		darkolivegreen 	:"#556B2F",
		darkorange 	:"#FF8C00",
		darkorchid 	:"#9932CC",
		darkred 	:"#8B0000",
		darksalmon 	:"#E9967A",
		darkseagreen 	:"#8FBC8F",
		darkslateblue 	:"#483D8B",
		darkslategray 	:"#2F4F4F",
		darkturquoise 	:"#00CED1",
		darkviolet 	:"#9400D3",
		deeppink 	:"#FF1493",
		deepskyblue 	:"#00BFFF",
		dimgray 	:"#696969",
		dodgerblue 	:"#1E90FF",
		firebrick 	:"#B22222",
		floralwhite 	:"#FFFAF0",
		forestgreen 	:"#228B22",
		fuchsia 	:"#FF00FF",
		gainsboro 	:"#DCDCDC",
		ghostwhite 	:"#F8F8FF",
		gold		:"#FFD700",
		goldenrod 	:"#DAA520",
		gray		:"#808080",
		green		:"#008000",
		greenyellow 	:"#ADFF2F",
		honeydew 	:"#F0FFF0",
		hotpink 	:"#FF69B4",
		indianred  	:"#CD5C5C",
		indigo  	:"#4B0082",
		ivory		:"#FFFFF0",
		khaki		:"#F0E68C",
		lavender 	:"#E6E6FA",
		lavenderblush 	:"#FFF0F5",
		lawngreen 	:"#7CFC00",
		lemonchiffon 	:"#FFFACD",
		lightblue 	:"#ADD8E6",
		lightcoral 	:"#F08080",
		lightcyan 	:"#E0FFFF",
		lightgoldenrodyellow 	:"#FAFAD2",
		lightgrey 	:"#D3D3D3",
		lightgreen 	:"#90EE90",
		lightpink 	:"#FFB6C1",
		lightsalmon 	:"#FFA07A",
		lightseagreen 	:"#20B2AA",
		lightskyblue 	:"#87CEFA",
		lightslategray 	:"#778899",
		lightsteelblue 	:"#B0C4DE",
		lightyellow 	:"#FFFFE0",
		lime		:"#00FF00",
		limegreen 	:"#32CD32",
		linen		:"#FAF0E6",
		magenta 	:"#FF00FF",
		maroon		:"#800000",
		mediumaquamarine 	:"#66CDAA",
		mediumblue 	:"#0000CD",
		mediumorchid 	:"#BA55D3",
		mediumpurple 	:"#9370D8",
		mediumseagreen 	:"#3CB371",
		mediumslateblue 	:"#7B68EE",
		mediumspringgreen 	:"#00FA9A",
		mediumturquoise 	:"#48D1CC",
		mediumvioletred 	:"#C71585",
		midnightblue 	:"#191970",
		mintcream 	:"#F5FFFA",
		mistyrose 	:"#FFE4E1",
		moccasin 	:"#FFE4B5",
		navajowhite 	:"#FFDEAD",
		navy		:"#000080",
		oldlace 	:"#FDF5E6",
		olive		:"#808000",
		olivedrab 	:"#6B8E23",
		orange		:"#FFA500",
		orangered 	:"#FF4500",
		orchid		:"#DA70D6",
		palegoldenrod 	:"#EEE8AA",
		palegreen 	:"#98FB98",
		paleturquoise 	:"#AFEEEE",
		palevioletred 	:"#D87093",
		papayawhip 	:"#FFEFD5",
		peachpuff 	:"#FFDAB9",
		peru		:"#CD853F",
		pink		:"#FFC0CB",
		plum		:"#DDA0DD",
		powderblue 	:"#B0E0E6",
		purple		:"#800080",
		red		:"#FF0000",
		rosybrown 	:"#BC8F8F",
		royalblue 	:"#4169E1",
		saddlebrown 	:"#8B4513",
		salmon		:"#FA8072",
		sandybrown 	:"#F4A460",
		seagreen 	:"#2E8B57",
		seashell 	:"#FFF5EE",
		sienna		:"#A0522D",
		silver		:"#C0C0C0",
		skyblue 	:"#87CEEB",
		slateblue 	:"#6A5ACD",
		slategray 	:"#708090",
		snow		:"#FFFAFA",
		springgreen 	:"#00FF7F",
		steelblue 	:"#4682B4",
		tan		:"#D2B48C",
		teal		:"#008080",
		thistle 	:"#D8BFD8",
		tomato 	:	"#FF6347",
		turquoise 	:"#40E0D0",
		violet		:"#EE82EE",
		wheat		:"#F5DEB3",
		white		:"#FFFFFF",
		whitesmoke 	:"#F5F5F5",
		yellow		:"#FFFF00",
		yellowgreen	:"#9ACD32"
	};

	var colorFromHex = function( color ){
		
		var bits = (color.length === 4) ? 4 : 8 ;
		var mask = (1 << bits) - 1 ;
		color = Number("0x" + color.substr(1));
		if(isNaN(color)){
			return null;
		}
		$.each(["blue","green","red"], function(index, ele){			
			var c = color & mask;
			color >>= bits;
			this[ele] = bits == 4 ? 17 * c : c;
		}.bind(this));
		this.alpha = 1;
		return this;
	};

	var colorFromArray = function( color){
		if (color.length === 3){
			this.red = parseFloat( color[0] );
			this.green = parseFloat(color[1] );
			this.blue = parseFloat( color[2] );
			return ;
		}
		if (color.length === 4){
			this.red = parseFloat(color[0]);
			this.green = parseFloat(color[1]);
			this.blue = parseFloat(color[2]);
			this.alpha = parseFloat(color[3]);
			return ;
		}
	};

	var colorFromRgb = function( color){
		var reg = color.toLowerCase().match(/^rgba?\(([\s\.,0-9]+)\)/);
		return colorFromArray.call(this, reg[1].split(/\s*,\s*/))
	};
	
	var color = function(color){
		if (color) this.setColor(color);
	};

	color.prototype.setColor = function(color){

		switch (stage.typeOf(color)){
			case "array":
				colorFromArray.call(this,color);
			break;
			case "object":
				this.red = color.red;
				this.green = color.green;
				this.blue = color.blue;
				this.alpha = color.alpha;
			break;
			case "string":
				var sanatizeColor = color.toLowerCase();
				if (colorName[sanatizeColor])
					color = colorName[sanatizeColor];
				var ret = colorFromHex.call(this, color);
				if (! ret){
					colorFromRgb.call(this, color)
				}
			break;
		}
	};

	color.prototype.toString = function(alpha){
		if (alpha)
			return "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.alpha + ")";
		return  "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
	};

	color.prototype.toRgb = function(){
		return [this.red, this.green, this.blue];
	};
	color.prototype.toRgba = function(){
		return [this.red, this.green, this.blue, this.alpha];
	};
	color.prototype.toHex = function(){
		var res = "#";
		$.each(["red","green","blue"], function(index, color){
			var str = this[color].toString(16);		
			res+=str.length < 2 ? "0" + str : str;
		}.bind(this));
		return res;
	};

	color.prototype.blendColors = function( end, data){
		
		var rvb = "rgb(";
		$.each(["red","green","blue"], function(i, ele){
			var value = this[ele] + (end[ele] - this[ele]) * data;
			if(i != 2){ 
				rvb += Math.round(value)+","; 
			}else{
				rvb += Math.round(value)+")"; 
			}

		}.bind(this));
		return rvb;
	};

	/*
 	 *
 	 *	Monstrueux
 	 *
 	 */
	color.prototype.getRainbow = function(end, nb){
		var myend = new color(end);
		var tab = [this.toString()];
		for (var i = 0 ; i < (nb -2) ; i++)
			tab.push( this.blendColors(myend, (1/(nb-1))*(i+1) ) );
		tab.push(myend.toString());
		return tab;
	};
		

	return color;


});

