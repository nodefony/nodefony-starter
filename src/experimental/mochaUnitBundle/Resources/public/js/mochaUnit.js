/**
 * New node file
 */

var depends = function depends(libPath){
	console.log('LOADING : ' + libPath);
	$('body').append($('<script type="text/javascript" src="' + libPath + '?time=' + (new Date()).getTime() + '"></script>'));
};