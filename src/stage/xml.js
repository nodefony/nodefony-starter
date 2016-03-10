/*
 *
 *
 *
 *
 *
 *
 *
 */

stage.register("xml", function(){

	/**
   	* \brief changes the given string to XML doc.
   	*
   	* \param string an XML string
   	* \return  the document  node root
   	*/
  	var stringToDocumentXML = function(){

		if ( ! document.implementation.createDocument){
			return function(str){
				var doc = createDocument();
				doc.async="false";
				doc.loadXML(str);
				return doc;
			}
		}
		
		return function(str){
    			try{
				var oDomDoc = (new DOMParser()).parseFromString(str, 'application/xml');
      			}catch(e){
				throw Error('xml function stringToDocumentXML : '+e);
      			}
			return oDomDoc;
		}
  	}();
  	
  	var getDocumentRoot = function(doc){ 
		var type = stage.typeOf(doc);
		if ( type === "document" ){
			return (doc.documentElement || doc.childNodes[0]);		
		}
		if ( type === "element" ){
			var myDoc = doc.ownerDocument ;
			return (myDoc.documentElement || myDoc.childNodes[0]);
		}
  	};





	//parseXML
	var parseXml = function( xml ){
		switch (stage.typeOf(xml)){
			case "string":
				var root = getDocumentRoot(stringToDocumentXML(xml));
			break;
			case "document":
				var root = getDocumentRoot(xml);
			break;
			case "element":
				var root = xml;
			break;
			default:
				throw new Error("parseXml  bad type arguments");
		
		}
		return parseDOM( root );
	};

	var __force_array = null;
	var parseDOM = function(root){
		if ( ! root ) return null;
		var force_array = null;
		__force_array = {};
        	if ( force_array ) {
            		for( var i=0; i<force_array.length; i++ ) {
                		__force_array[force_array[i]] = 1;
            		}
        	}

        	var json = parseNode( root );   // parse root node
        	if ( __force_array[root.nodeName] ) {
            		json = [ json ];
        	}
        	if ( root.nodeType != 11 ) {            // DOCUMENT_FRAGMENT_NODE
            		var tmp = {};
            		tmp[root.nodeName] = json;          // root nodeName
            		json = tmp;
        	}
        	return json;
	};


	var attr_prefix ="@";
	var name_space = ":";
	var parseNode = function(node){
		if ( ! node ) return null;
		switch( node.nodeType ){
			// COMMENT_NODE
			case 7:
				return null;
			// TEXT_NODE 
			case 3:
			// CDATA_SECTION_NODE
			case 4:
				if ( node.nodeValue.match( /[^\x00-\x20]/ ) )
					return node.nodeValue;
				return null;
			break;		
		}
		var ret = null;
		var data = {};	

		// parse Attributes 
		if ( node.attributes && node.attributes.length ){
			ret = {};
			for ( var i=0; i<node.attributes.length; i++ ) {
				var key = node.attributes[i].nodeName;
                		if ( typeof(key) !== "string" ) continue;
                		var val =  node.attributes[i].value || node.attributes[i].nodeValue;
                		if ( ! val ) continue;
                		key = attr_prefix + key;
                		if ( typeof(data[key]) == "undefined" ) data[key] = 0;
                		data[key] ++;
				addNode( ret, key, data[key], val );
			}
			//console.log(data)
		}

		if ( node.childNodes && node.childNodes.length ) {
            		var textonly = true;
            		if ( ret ) textonly = false;        // some attributes exists
            		for ( var i=0; i<node.childNodes.length && textonly; i++ ) {
                		var ntype = node.childNodes[i].nodeType;
                		if ( ntype == 3 || ntype == 4 ) continue;
                		textonly = false;
            		}
            		if ( textonly ) {
                		if ( ! ret ) ret = "";
                		for ( var i=0; i<node.childNodes.length; i++ ) {
                    			ret += node.childNodes[i].nodeValue;
                		}
            		} else {
                		if ( ! ret ) ret = {};
                		for ( var i=0; i<node.childNodes.length; i++ ) {
                    			var key = node.childNodes[i].nodeName;
                    			if ( typeof(key) !== "string" ) continue;
                    			var val = parseNode( node.childNodes[i] );
                    			if ( ! val ) continue;
                    			if ( typeof(data[key]) === "undefined" ) data[key] = 0;
                    			data[key] ++;
                    			addNode( ret, key, data[key], val );
                		}
            		}
        	}
		return ret;
	};

	var addNode = function ( hash, key, cnts, val ) {
        	key = removeColon(key);
        	if ( __force_array && __force_array[key] ) {
            		if ( cnts == 1 ) hash[key] = [];
            		hash[key][hash[key].length] = val;      // push
        	} else if ( cnts == 1 ) {                   // 1st sibling
            		hash[key] = val;
        	} else if ( cnts == 2 ) {                   // 2nd sibling
            		hash[key] = [ hash[key], val ];
        	} else {                                    // 3rd sibling and more
            		hash[key][hash[key].length] = val;
        	}
	};
	
	var removeColon = function(name){
		return name ? (name.replace(':',name_space)): name;
	};



	return {
		parseXml:parseXml,
		//parseNode:parseDOM,
	  	stringToDocumentXML : stringToDocumentXML ,
	  	//getDocumentRoot :getDocumentRoot
	
	
	}


});
