/**
 * PREFORMATE une chaine type sql en chaine date
 * 
 */
String.prototype.uniqueId = function(){
	var uniqueID = new Date();
	return uniqueID.getTime();
};

/**
 * 
 * RENVOIE LA CHAINE AVEC LE 1er charactere en majuscule ..
 */

String.prototype.ucfirst = function() {
	var f = this.charAt(0).toUpperCase();
	return f + this.substr(1);
};

String.prototype.basename = function (suffix) {
	
	var b = this.replace(/^.*[\/\\]/g, '');
	
	if (typeof(suffix) == 'string' && b.substr(b.length-suffix.length) == suffix) {
		b = b.substr(0, b.length-suffix.length);
	}
	
	return b;
};

String.prototype.dirname = function(){
	var tmp = this;
	if(tmp[tmp.length - 1] == '/') tmp = tmp + 'dirname.html';
	return tmp.replace(/\\/g,'/').replace(/\/[^\/]*\/?$/, '') + '/';
};

String.prototype.pad = function (len) {
	len = len || 2;
	var str = this;
	while (str.length < len){
		str = "0" + str;
	}
	return str;
};

/**
 * Transforme une chaine en une date javascript
 * Format de la chaine en entrée : "2008-11-30 10:27:24"
 * 
 **/ 
String.prototype.strToDate= function(){
	
	//Mise en forme de la date et heure
	var dateS = this.split(" ");
	var dateD = dateS[0].split("-");
	var heure = dateS[1].split(":");
	var y = dateD[0];
	var m = dateD[1];
	var d = dateD[2];

	// Reconstitution de la date à partir de la chaine
	return new Date(y,(m-1),d,heure[0],heure[1],heure[2]);
};


/**
 * PREFORMATE une chaine type date en chaine date sql
 * 
 */
String.prototype.dateStrToSql = function(lang){
	var tab = this.split('/');
	if(lang == 'en'){
		return tab[2] + '-' + tab[0] + '-' + tab[1];
	} else {
		return tab[2] + '-' + tab[1] + '-' + tab[0];
	}
};

/**
 * PREFORMATE une chaine type sql en chaine date
 * 
 */
String.prototype.dateSqlToStr = function(lang){
	var tab = this.split('-');
	if(lang == 'en'){
		return tab[1] + '/' + tab[2] + '/' + tab[0];
	} else {
		return tab[2] + '/' + tab[1] + '/' + tab[0];
	}
};


function wordwrap (str, int_width, str_break, cut) {

    var m = ((arguments.length >= 2) ? arguments[1] : 75);
    var b = ((arguments.length >= 3) ? arguments[2] : "\n");
    var c = ((arguments.length >= 4) ? arguments[3] : false);
 
    var i, j, l, s, r;
 
    str += '';
 
    if (m < 1) {
        return str;
    }
 
    for (i = -1, l = (r = str.split(/\r\n|\n|\r/)).length; ++i < l; r[i] += s) {
        for (s = r[i], r[i] = ""; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? b : "")) {
            j = c == 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length || c == 1 && m || j.input.length + (j = s.slice(m).match(/^\S*/)).input.length;
        }
    }
 
    return r.join("\n");
}

/**
 * Recupere le nom d'un fichier et le raccourci
 * 
 */
String.prototype.getTruncateFileName = function(str, max){
	return this.basename().substr(0, this.lastIndexOf('.')).truncate(max);
};

function isSet(str){
	//return !str;
	return (typeof(str) !== 'undefined' && str !== null && str !== '');
};

function uniqueId(){
	var uniqueID = new Date();
	return uniqueID.getTime();
};
