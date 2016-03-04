
 /**** NODEFONY  CONCAT : jquery-2.1.4.min.js  ***/
/*! jQuery v2.1.4 | (c) 2005, 2015 jQuery Foundation, Inc. | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k={},l=a.document,m="2.1.4",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return n.each(this,a,b)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(n.isPlainObject(d)||(e=n.isArray(d)))?(e?(e=!1,f=c&&n.isArray(c)?c:[]):f=c&&n.isPlainObject(c)?c:{},g[b]=n.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){return!n.isArray(a)&&a-parseFloat(a)+1>=0},isPlainObject:function(a){return"object"!==n.type(a)||a.nodeType||n.isWindow(a)?!1:a.constructor&&!j.call(a.constructor.prototype,"isPrototypeOf")?!1:!0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=n.trim(a),a&&(1===a.indexOf("use strict")?(b=l.createElement("script"),b.text=a,l.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=s(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:g.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=s(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(c=a[b],b=a,a=c),n.isFunction(a)?(e=d.call(arguments,2),f=function(){return a.apply(b||this,e.concat(d.call(arguments)))},f.guid=a.guid=a.guid||n.guid++,f):void 0},now:Date.now,support:k}),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function s(a){var b="length"in a&&a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N=M.replace("w","w#"),O="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+N+"))|)"+L+"*\\]",P=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+O+")*)|.*)\\)|)",Q=new RegExp(L+"+","g"),R=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),S=new RegExp("^"+L+"*,"+L+"*"),T=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),U=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),V=new RegExp(P),W=new RegExp("^"+N+"$"),X={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+O),PSEUDO:new RegExp("^"+P),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},Y=/^(?:input|select|textarea|button)$/i,Z=/^h\d$/i,$=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,aa=/[+~]/,ba=/'|\\/g,ca=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),da=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ea=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(fa){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s,w,x;if((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,d=d||[],k=b.nodeType,"string"!=typeof a||!a||1!==k&&9!==k&&11!==k)return d;if(!e&&p){if(11!==k&&(f=_.exec(a)))if(j=f[1]){if(9===k){if(h=b.getElementById(j),!h||!h.parentNode)return d;if(h.id===j)return d.push(h),d}else if(b.ownerDocument&&(h=b.ownerDocument.getElementById(j))&&t(b,h)&&h.id===j)return d.push(h),d}else{if(f[2])return H.apply(d,b.getElementsByTagName(a)),d;if((j=f[3])&&c.getElementsByClassName)return H.apply(d,b.getElementsByClassName(j)),d}if(c.qsa&&(!q||!q.test(a))){if(s=r=u,w=b,x=1!==k&&a,1===k&&"object"!==b.nodeName.toLowerCase()){o=g(a),(r=b.getAttribute("id"))?s=r.replace(ba,"\\$&"):b.setAttribute("id",s),s="[id='"+s+"'] ",l=o.length;while(l--)o[l]=s+ra(o[l]);w=aa.test(a)&&pa(b.parentNode)||b,x=o.join(",")}if(x)try{return H.apply(d,w.querySelectorAll(x)),d}catch(y){}finally{r||b.removeAttribute("id")}}}return i(a.replace(R,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function pa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=g.documentElement,e=g.defaultView,e&&e!==e.top&&(e.addEventListener?e.addEventListener("unload",ea,!1):e.attachEvent&&e.attachEvent("onunload",ea)),p=!f(g),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(g.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=$.test(g.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!g.getElementsByName||!g.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ca,da);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ca,da);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=$.test(g.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\f]' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){var b=g.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=$.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",P)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=$.test(o.compareDocumentPosition),t=b||$.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===g||a.ownerDocument===v&&t(v,a)?-1:b===g||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,h=[a],i=[b];if(!e||!f)return a===g?-1:b===g?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)i.unshift(c);while(h[d]===i[d])d++;return d?la(h[d],i[d]):h[d]===v?-1:i[d]===v?1:0},g):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(U,"='$1']"),!(!c.matchesSelector||!p||r&&r.test(b)||q&&q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ca,da),a[3]=(a[3]||a[4]||a[5]||"").replace(ca,da),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return X.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&V.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ca,da).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(Q," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){k=q[u]||(q[u]={}),j=k[a]||[],n=j[0]===w&&j[1],m=j[0]===w&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[w,n,m];break}}else if(s&&(j=(b[u]||(b[u]={}))[a])&&j[0]===w)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(s&&((l[u]||(l[u]={}))[a]=[w,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(R,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(ca,da),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return W.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(ca,da).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Z.test(a.nodeName)},input:function(a){return Y.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:oa(function(){return[0]}),last:oa(function(a,b){return[b-1]}),eq:oa(function(a,b,c){return[0>c?c+b:c]}),even:oa(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:oa(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:oa(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:oa(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function qa(){}qa.prototype=d.filters=d.pseudos,d.setFilters=new qa,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=S.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=T.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(R," ")}),h=h.slice(c.length));for(g in d.filter)!(e=X[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function ra(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function sa(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[u]||(b[u]={}),(h=i[d])&&h[0]===w&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function ta(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ua(a,b,c){for(var d=0,e=b.length;e>d;d++)ga(a,b[d],c);return c}function va(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function wa(a,b,c,d,e,f){return d&&!d[u]&&(d=wa(d)),e&&!e[u]&&(e=wa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ua(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:va(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=va(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=va(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function xa(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=sa(function(a){return a===b},h,!0),l=sa(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[sa(ta(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return wa(i>1&&ta(m),i>1&&ra(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(R,"$1"),c,e>i&&xa(a.slice(i,e)),f>e&&xa(a=a.slice(e)),f>e&&ra(a))}m.push(c)}return ta(m)}function ya(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,m,o,p=0,q="0",r=f&&[],s=[],t=j,u=f||e&&d.find.TAG("*",k),v=w+=null==t?1:Math.random()||.1,x=u.length;for(k&&(j=g!==n&&g);q!==x&&null!=(l=u[q]);q++){if(e&&l){m=0;while(o=a[m++])if(o(l,g,h)){i.push(l);break}k&&(w=v)}c&&((l=!o&&l)&&p--,f&&r.push(l))}if(p+=q,c&&q!==p){m=0;while(o=b[m++])o(r,s,g,h);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=F.call(i));s=va(s)}H.apply(i,s),k&&!f&&s.length>0&&p+b.length>1&&ga.uniqueSort(i)}return k&&(w=v,j=t),r};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=xa(b[c]),f[u]?d.push(f):e.push(f);f=A(a,ya(e,d)),f.selector=a}return f},i=ga.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(ca,da),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=X.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(ca,da),aa.test(j[0].type)&&pa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&ra(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,aa.test(a)&&pa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=n.expr.match.needsContext,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^.[^:#\[\.,]*$/;function x(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(w.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return g.call(b,a)>=0!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;c>b;b++)if(n.contains(e[b],this))return!0}));for(b=0;c>b;b++)n.find(a,e[b],d);return d=this.pushStack(c>1?n.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(x(this,a||[],!1))},not:function(a){return this.pushStack(x(this,a||[],!0))},is:function(a){return!!x(this,"string"==typeof a&&u.test(a)?n(a):a||[],!1).length}});var y,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,A=n.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:z.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||y).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:l,!0)),v.test(c[1])&&n.isPlainObject(b))for(c in b)n.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}return d=l.getElementById(c[2]),d&&d.parentNode&&(this.length=1,this[0]=d),this.context=l,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?"undefined"!=typeof y.ready?y.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};A.prototype=n.fn,y=n(l);var B=/^(?:parents|prev(?:Until|All))/,C={children:!0,contents:!0,next:!0,prev:!0};n.extend({dir:function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),n.fn.extend({has:function(a){var b=n(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(n.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=u.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.unique(f):f)},index:function(a){return a?"string"==typeof a?g.call(n(a),this[0]):g.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.unique(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function D(a,b){while((a=a[b])&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return n.dir(a,"parentNode")},parentsUntil:function(a,b,c){return n.dir(a,"parentNode",c)},next:function(a){return D(a,"nextSibling")},prev:function(a){return D(a,"previousSibling")},nextAll:function(a){return n.dir(a,"nextSibling")},prevAll:function(a){return n.dir(a,"previousSibling")},nextUntil:function(a,b,c){return n.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return n.dir(a,"previousSibling",c)},siblings:function(a){return n.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return n.sibling(a.firstChild)},contents:function(a){return a.contentDocument||n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(C[a]||n.unique(e),B.test(a)&&e.reverse()),this.pushStack(e)}});var E=/\S+/g,F={};function G(a){var b=F[a]={};return n.each(a.match(E)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?F[a]||G(a):n.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(b=a.memory&&l,c=!0,g=e||0,e=0,f=h.length,d=!0;h&&f>g;g++)if(h[g].apply(l[0],l[1])===!1&&a.stopOnFalse){b=!1;break}d=!1,h&&(i?i.length&&j(i.shift()):b?h=[]:k.disable())},k={add:function(){if(h){var c=h.length;!function g(b){n.each(b,function(b,c){var d=n.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&g(c)})}(arguments),d?f=h.length:b&&(e=c,j(b))}return this},remove:function(){return h&&n.each(arguments,function(a,b){var c;while((c=n.inArray(b,h,c))>-1)h.splice(c,1),d&&(f>=c&&f--,g>=c&&g--)}),this},has:function(a){return a?n.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],f=0,this},disable:function(){return h=i=b=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,b||k.disable(),this},locked:function(){return!i},fireWith:function(a,b){return!h||c&&!i||(b=b||[],b=[a,b.slice?b.slice():b],d?i.push(b):j(b)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!c}};return k},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&n.isFunction(a.promise)?e:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var H;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(H.resolveWith(l,[n]),n.fn.triggerHandler&&(n(l).triggerHandler("ready"),n(l).off("ready"))))}});function I(){l.removeEventListener("DOMContentLoaded",I,!1),a.removeEventListener("load",I,!1),n.ready()}n.ready.promise=function(b){return H||(H=n.Deferred(),"complete"===l.readyState?setTimeout(n.ready):(l.addEventListener("DOMContentLoaded",I,!1),a.addEventListener("load",I,!1))),H.promise(b)},n.ready.promise();var J=n.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)n.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f};n.acceptData=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function K(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=n.expando+K.uid++}K.uid=1,K.accepts=n.acceptData,K.prototype={key:function(a){if(!K.accepts(a))return 0;var b={},c=a[this.expando];if(!c){c=K.uid++;try{b[this.expando]={value:c},Object.defineProperties(a,b)}catch(d){b[this.expando]=c,n.extend(a,b)}}return this.cache[c]||(this.cache[c]={}),c},set:function(a,b,c){var d,e=this.key(a),f=this.cache[e];if("string"==typeof b)f[b]=c;else if(n.isEmptyObject(f))n.extend(this.cache[e],b);else for(d in b)f[d]=b[d];return f},get:function(a,b){var c=this.cache[this.key(a)];return void 0===b?c:c[b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,n.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=this.key(a),g=this.cache[f];if(void 0===b)this.cache[f]={};else{n.isArray(b)?d=b.concat(b.map(n.camelCase)):(e=n.camelCase(b),b in g?d=[b,e]:(d=e,d=d in g?[d]:d.match(E)||[])),c=d.length;while(c--)delete g[d[c]]}},hasData:function(a){return!n.isEmptyObject(this.cache[a[this.expando]]||{})},discard:function(a){a[this.expando]&&delete this.cache[a[this.expando]]}};var L=new K,M=new K,N=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,O=/([A-Z])/g;function P(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(O,"-$1").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:N.test(c)?n.parseJSON(c):c}catch(e){}M.set(a,b,c)}else c=void 0;return c}n.extend({hasData:function(a){return M.hasData(a)||L.hasData(a)},data:function(a,b,c){
return M.access(a,b,c)},removeData:function(a,b){M.remove(a,b)},_data:function(a,b,c){return L.access(a,b,c)},_removeData:function(a,b){L.remove(a,b)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=M.get(f),1===f.nodeType&&!L.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),P(f,d,e[d])));L.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){M.set(this,a)}):J(this,function(b){var c,d=n.camelCase(a);if(f&&void 0===b){if(c=M.get(f,a),void 0!==c)return c;if(c=M.get(f,d),void 0!==c)return c;if(c=P(f,d,void 0),void 0!==c)return c}else this.each(function(){var c=M.get(this,d);M.set(this,d,b),-1!==a.indexOf("-")&&void 0!==c&&M.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){M.remove(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=L.get(a,b),c&&(!d||n.isArray(c)?d=L.access(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return L.get(a,c)||L.access(a,c,{empty:n.Callbacks("once memory").add(function(){L.remove(a,[b+"queue",c])})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=L.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var Q=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,R=["Top","Right","Bottom","Left"],S=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)},T=/^(?:checkbox|radio)$/i;!function(){var a=l.createDocumentFragment(),b=a.appendChild(l.createElement("div")),c=l.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),k.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",k.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var U="undefined";k.focusinBubbles="onfocusin"in a;var V=/^key/,W=/^(?:mouse|pointer|contextmenu)|click/,X=/^(?:focusinfocus|focusoutblur)$/,Y=/^([^.]*)(?:\.(.+)|)$/;function Z(){return!0}function $(){return!1}function _(){try{return l.activeElement}catch(a){}}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.get(a);if(r){c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=n.guid++),(i=r.events)||(i=r.events={}),(g=r.handle)||(g=r.handle=function(b){return typeof n!==U&&n.event.triggered!==b.type?n.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(E)||[""],j=b.length;while(j--)h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o&&(l=n.event.special[o]||{},o=(e?l.delegateType:l.bindType)||o,l=n.event.special[o]||{},k=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},f),(m=i[o])||(m=i[o]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,p,g)!==!1||a.addEventListener&&a.addEventListener(o,g,!1)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),n.event.global[o]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.hasData(a)&&L.get(a);if(r&&(i=r.events)){b=(b||"").match(E)||[""],j=b.length;while(j--)if(h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=i[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&q!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete i[o])}else for(o in i)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(i)&&(delete r.handle,L.remove(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,m,o,p=[d||l],q=j.call(b,"type")?b.type:b,r=j.call(b,"namespace")?b.namespace.split("."):[];if(g=h=d=d||l,3!==d.nodeType&&8!==d.nodeType&&!X.test(q+n.event.triggered)&&(q.indexOf(".")>=0&&(r=q.split("."),q=r.shift(),r.sort()),k=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=r.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:n.makeArray(c,[b]),o=n.event.special[q]||{},e||!o.trigger||o.trigger.apply(d,c)!==!1)){if(!e&&!o.noBubble&&!n.isWindow(d)){for(i=o.delegateType||q,X.test(i+q)||(g=g.parentNode);g;g=g.parentNode)p.push(g),h=g;h===(d.ownerDocument||l)&&p.push(h.defaultView||h.parentWindow||a)}f=0;while((g=p[f++])&&!b.isPropagationStopped())b.type=f>1?i:o.bindType||q,m=(L.get(g,"events")||{})[b.type]&&L.get(g,"handle"),m&&m.apply(g,c),m=k&&g[k],m&&m.apply&&n.acceptData(g)&&(b.result=m.apply(g,c),b.result===!1&&b.preventDefault());return b.type=q,e||b.isDefaultPrevented()||o._default&&o._default.apply(p.pop(),c)!==!1||!n.acceptData(d)||k&&n.isFunction(d[q])&&!n.isWindow(d)&&(h=d[k],h&&(d[k]=null),n.event.triggered=q,d[q](),n.event.triggered=void 0,h&&(d[k]=h)),b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(L.get(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(g.namespace))&&(a.handleObj=g,a.data=g.data,e=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(a.result=e)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!==this;i=i.parentNode||this)if(i.disabled!==!0||"click"!==a.type){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>=0:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||l,d=c.documentElement,e=c.body,a.pageX=b.clientX+(d&&d.scrollLeft||e&&e.scrollLeft||0)-(d&&d.clientLeft||e&&e.clientLeft||0),a.pageY=b.clientY+(d&&d.scrollTop||e&&e.scrollTop||0)-(d&&d.clientTop||e&&e.clientTop||0)),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},fix:function(a){if(a[n.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=W.test(e)?this.mouseHooks:V.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new n.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=l),3===a.target.nodeType&&(a.target=a.target.parentNode),g.filter?g.filter(a,f):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==_()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===_()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&n.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=n.extend(new n.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?n.event.trigger(e,null,b):n.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?Z:$):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={isDefaultPrevented:$,isPropagationStopped:$,isImmediatePropagationStopped:$,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=Z,a&&a.preventDefault&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=Z,a&&a.stopPropagation&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=Z,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!n.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),k.focusinBubbles||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a),!0)};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=L.access(d,b);e||d.addEventListener(a,c,!0),L.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=L.access(d,b)-1;e?L.access(d,b,e):(d.removeEventListener(a,c,!0),L.remove(d,b))}}}),n.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(g in a)this.on(g,b,c,a[g],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=$;else if(!d)return this;return 1===e&&(f=d,d=function(a){return n().off(a),f.apply(this,arguments)},d.guid=f.guid||(f.guid=n.guid++)),this.each(function(){n.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=$),this.each(function(){n.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}});var aa=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,ba=/<([\w:]+)/,ca=/<|&#?\w+;/,da=/<(?:script|style|link)/i,ea=/checked\s*(?:[^=]|=\s*.checked.)/i,fa=/^$|\/(?:java|ecma)script/i,ga=/^true\/(.*)/,ha=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ia={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ia.optgroup=ia.option,ia.tbody=ia.tfoot=ia.colgroup=ia.caption=ia.thead,ia.th=ia.td;function ja(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function ka(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function la(a){var b=ga.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function ma(a,b){for(var c=0,d=a.length;d>c;c++)L.set(a[c],"globalEval",!b||L.get(b[c],"globalEval"))}function na(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(L.hasData(a)&&(f=L.access(a),g=L.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)n.event.add(b,e,j[e][c])}M.hasData(a)&&(h=M.access(a),i=n.extend({},h),M.set(b,i))}}function oa(a,b){var c=a.getElementsByTagName?a.getElementsByTagName(b||"*"):a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&n.nodeName(a,b)?n.merge([a],c):c}function pa(a,b){var c=b.nodeName.toLowerCase();"input"===c&&T.test(a.type)?b.checked=a.checked:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}n.extend({clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=n.contains(a.ownerDocument,a);if(!(k.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(g=oa(h),f=oa(a),d=0,e=f.length;e>d;d++)pa(f[d],g[d]);if(b)if(c)for(f=f||oa(a),g=g||oa(h),d=0,e=f.length;e>d;d++)na(f[d],g[d]);else na(a,h);return g=oa(h,"script"),g.length>0&&ma(g,!i&&oa(a,"script")),h},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k=b.createDocumentFragment(),l=[],m=0,o=a.length;o>m;m++)if(e=a[m],e||0===e)if("object"===n.type(e))n.merge(l,e.nodeType?[e]:e);else if(ca.test(e)){f=f||k.appendChild(b.createElement("div")),g=(ba.exec(e)||["",""])[1].toLowerCase(),h=ia[g]||ia._default,f.innerHTML=h[1]+e.replace(aa,"<$1></$2>")+h[2],j=h[0];while(j--)f=f.lastChild;n.merge(l,f.childNodes),f=k.firstChild,f.textContent=""}else l.push(b.createTextNode(e));k.textContent="",m=0;while(e=l[m++])if((!d||-1===n.inArray(e,d))&&(i=n.contains(e.ownerDocument,e),f=oa(k.appendChild(e),"script"),i&&ma(f),c)){j=0;while(e=f[j++])fa.test(e.type||"")&&c.push(e)}return k},cleanData:function(a){for(var b,c,d,e,f=n.event.special,g=0;void 0!==(c=a[g]);g++){if(n.acceptData(c)&&(e=c[L.expando],e&&(b=L.cache[e]))){if(b.events)for(d in b.events)f[d]?n.event.remove(c,d):n.removeEvent(c,d,b.handle);L.cache[e]&&delete L.cache[e]}delete M.cache[c[M.expando]]}}}),n.fn.extend({text:function(a){return J(this,function(a){return void 0===a?n.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=a)})},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=ja(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=ja(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?n.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||n.cleanData(oa(c)),c.parentNode&&(b&&n.contains(c.ownerDocument,c)&&ma(oa(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(n.cleanData(oa(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return J(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!da.test(a)&&!ia[(ba.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(aa,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(oa(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,n.cleanData(oa(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,l=this.length,m=this,o=l-1,p=a[0],q=n.isFunction(p);if(q||l>1&&"string"==typeof p&&!k.checkClone&&ea.test(p))return this.each(function(c){var d=m.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(l&&(c=n.buildFragment(a,this[0].ownerDocument,!1,this),d=c.firstChild,1===c.childNodes.length&&(c=d),d)){for(f=n.map(oa(c,"script"),ka),g=f.length;l>j;j++)h=c,j!==o&&(h=n.clone(h,!0,!0),g&&n.merge(f,oa(h,"script"))),b.call(this[j],h,j);if(g)for(i=f[f.length-1].ownerDocument,n.map(f,la),j=0;g>j;j++)h=f[j],fa.test(h.type||"")&&!L.access(h,"globalEval")&&n.contains(i,h)&&(h.src?n._evalUrl&&n._evalUrl(h.src):n.globalEval(h.textContent.replace(ha,"")))}return this}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=[],e=n(a),g=e.length-1,h=0;g>=h;h++)c=h===g?this:this.clone(!0),n(e[h])[b](c),f.apply(d,c.get());return this.pushStack(d)}});var qa,ra={};function sa(b,c){var d,e=n(c.createElement(b)).appendTo(c.body),f=a.getDefaultComputedStyle&&(d=a.getDefaultComputedStyle(e[0]))?d.display:n.css(e[0],"display");return e.detach(),f}function ta(a){var b=l,c=ra[a];return c||(c=sa(a,b),"none"!==c&&c||(qa=(qa||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=qa[0].contentDocument,b.write(),b.close(),c=sa(a,b),qa.detach()),ra[a]=c),c}var ua=/^margin/,va=new RegExp("^("+Q+")(?!px)[a-z%]+$","i"),wa=function(b){return b.ownerDocument.defaultView.opener?b.ownerDocument.defaultView.getComputedStyle(b,null):a.getComputedStyle(b,null)};function xa(a,b,c){var d,e,f,g,h=a.style;return c=c||wa(a),c&&(g=c.getPropertyValue(b)||c[b]),c&&(""!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),va.test(g)&&ua.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function ya(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d=l.documentElement,e=l.createElement("div"),f=l.createElement("div");if(f.style){f.style.backgroundClip="content-box",f.cloneNode(!0).style.backgroundClip="",k.clearCloneStyle="content-box"===f.style.backgroundClip,e.style.cssText="border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",e.appendChild(f);function g(){f.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",f.innerHTML="",d.appendChild(e);var g=a.getComputedStyle(f,null);b="1%"!==g.top,c="4px"===g.width,d.removeChild(e)}a.getComputedStyle&&n.extend(k,{pixelPosition:function(){return g(),b},boxSizingReliable:function(){return null==c&&g(),c},reliableMarginRight:function(){var b,c=f.appendChild(l.createElement("div"));return c.style.cssText=f.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",c.style.marginRight=c.style.width="0",f.style.width="1px",d.appendChild(e),b=!parseFloat(a.getComputedStyle(c,null).marginRight),d.removeChild(e),f.removeChild(c),b}})}}(),n.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var za=/^(none|table(?!-c[ea]).+)/,Aa=new RegExp("^("+Q+")(.*)$","i"),Ba=new RegExp("^([+-])=("+Q+")","i"),Ca={position:"absolute",visibility:"hidden",display:"block"},Da={letterSpacing:"0",fontWeight:"400"},Ea=["Webkit","O","Moz","ms"];function Fa(a,b){if(b in a)return b;var c=b[0].toUpperCase()+b.slice(1),d=b,e=Ea.length;while(e--)if(b=Ea[e]+c,b in a)return b;return d}function Ga(a,b,c){var d=Aa.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Ha(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+R[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+R[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+R[f]+"Width",!0,e))):(g+=n.css(a,"padding"+R[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+R[f]+"Width",!0,e)));return g}function Ia(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=wa(a),g="border-box"===n.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=xa(a,b,f),(0>e||null==e)&&(e=a.style[b]),va.test(e))return e;d=g&&(k.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Ha(a,b,c||(g?"border":"content"),d,f)+"px"}function Ja(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=L.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&S(d)&&(f[g]=L.access(d,"olddisplay",ta(d.nodeName)))):(e=S(d),"none"===c&&e||L.set(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=xa(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;return b=n.cssProps[h]||(n.cssProps[h]=Fa(i,h)),g=n.cssHooks[b]||n.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=Ba.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(n.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||n.cssNumber[h]||(c+="px"),k.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Fa(a.style,h)),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=xa(a,b,d)),"normal"===e&&b in Da&&(e=Da[b]),""===c||c?(f=parseFloat(e),c===!0||n.isNumeric(f)?f||0:e):e}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?za.test(n.css(a,"display"))&&0===a.offsetWidth?n.swap(a,Ca,function(){return Ia(a,b,d)}):Ia(a,b,d):void 0},set:function(a,c,d){var e=d&&wa(a);return Ga(a,c,d?Ha(a,b,d,"border-box"===n.css(a,"boxSizing",!1,e),e):0)}}}),n.cssHooks.marginRight=ya(k.reliableMarginRight,function(a,b){return b?n.swap(a,{display:"inline-block"},xa,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+R[d]+b]=f[d]||f[d-2]||f[0];return e}},ua.test(a)||(n.cssHooks[a+b].set=Ga)}),n.fn.extend({css:function(a,b){return J(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=wa(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)},a,b,arguments.length>1)},show:function(){return Ja(this,!0)},hide:function(){return Ja(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){S(this)?n(this).show():n(this).hide()})}});function Ka(a,b,c,d,e){return new Ka.prototype.init(a,b,c,d,e)}n.Tween=Ka,Ka.prototype={constructor:Ka,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=Ka.propHooks[this.prop];return a&&a.get?a.get(this):Ka.propHooks._default.get(this)},run:function(a){var b,c=Ka.propHooks[this.prop];return this.options.duration?this.pos=b=n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Ka.propHooks._default.set(this),this}},Ka.prototype.init.prototype=Ka.prototype,Ka.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[n.cssProps[a.prop]]||n.cssHooks[a.prop])?n.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},Ka.propHooks.scrollTop=Ka.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},n.fx=Ka.prototype.init,n.fx.step={};var La,Ma,Na=/^(?:toggle|show|hide)$/,Oa=new RegExp("^(?:([+-])=|)("+Q+")([a-z%]*)$","i"),Pa=/queueHooks$/,Qa=[Va],Ra={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=Oa.exec(b),f=e&&e[3]||(n.cssNumber[a]?"":"px"),g=(n.cssNumber[a]||"px"!==f&&+d)&&Oa.exec(n.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,n.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function Sa(){return setTimeout(function(){La=void 0}),La=n.now()}function Ta(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=R[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function Ua(a,b,c){for(var d,e=(Ra[b]||[]).concat(Ra["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function Va(a,b,c){var d,e,f,g,h,i,j,k,l=this,m={},o=a.style,p=a.nodeType&&S(a),q=L.get(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,l.always(function(){l.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=n.css(a,"display"),k="none"===j?L.get(a,"olddisplay")||ta(a.nodeName):j,"inline"===k&&"none"===n.css(a,"float")&&(o.display="inline-block")),c.overflow&&(o.overflow="hidden",l.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],Na.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}m[d]=q&&q[d]||n.style(a,d)}else j=void 0;if(n.isEmptyObject(m))"inline"===("none"===j?ta(a.nodeName):j)&&(o.display=j);else{q?"hidden"in q&&(p=q.hidden):q=L.access(a,"fxshow",{}),f&&(q.hidden=!p),p?n(a).show():l.done(function(){n(a).hide()}),l.done(function(){var b;L.remove(a,"fxshow");for(b in m)n.style(a,b,m[b])});for(d in m)g=Ua(p?q[d]:0,d,l),d in q||(q[d]=g.start,p&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function Wa(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function Xa(a,b,c){var d,e,f=0,g=Qa.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=La||Sa(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:La||Sa(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(Wa(k,j.opts.specialEasing);g>f;f++)if(d=Qa[f].call(j,a,k,j.opts))return d;return n.map(k,Ua,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(Xa,{tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],Ra[c]=Ra[c]||[],Ra[c].unshift(b)},prefilter:function(a,b){b?Qa.unshift(a):Qa.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(S).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=Xa(this,n.extend({},a),f);(e||L.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=L.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&Pa.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=L.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(Ta(b,!0),a,d,e)}}),n.each({slideDown:Ta("show"),slideUp:Ta("hide"),slideToggle:Ta("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=0,c=n.timers;for(La=n.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||n.fx.stop(),La=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){Ma||(Ma=setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){clearInterval(Ma),Ma=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(a,b){return a=n.fx?n.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a=l.createElement("input"),b=l.createElement("select"),c=b.appendChild(l.createElement("option"));a.type="checkbox",k.checkOn=""!==a.value,k.optSelected=c.selected,b.disabled=!0,k.optDisabled=!c.disabled,a=l.createElement("input"),a.value="t",a.type="radio",k.radioValue="t"===a.value}();var Ya,Za,$a=n.expr.attrHandle;n.fn.extend({attr:function(a,b){return J(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===U?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),d=n.attrHooks[b]||(n.expr.match.bool.test(b)?Za:Ya)),
void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=n.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void n.removeAttr(a,b))},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(E);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)},attrHooks:{type:{set:function(a,b){if(!k.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),Za={set:function(a,b,c){return b===!1?n.removeAttr(a,c):a.setAttribute(c,c),c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=$a[b]||n.find.attr;$a[b]=function(a,b,d){var e,f;return d||(f=$a[b],$a[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,$a[b]=f),e}});var _a=/^(?:input|select|textarea|button)$/i;n.fn.extend({prop:function(a,b){return J(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[n.propFix[a]||a]})}}),n.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!n.isXMLDoc(a),f&&(b=n.propFix[b]||b,e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){return a.hasAttribute("tabindex")||_a.test(a.nodeName)||a.href?a.tabIndex:-1}}}}),k.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this});var ab=/[\t\r\n\f]/g;n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h="string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ab," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=n.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0===arguments.length||"string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ab," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?n.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(n.isFunction(a)?function(c){n(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=n(this),f=a.match(E)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===U||"boolean"===c)&&(this.className&&L.set(this,"__className__",this.className),this.className=this.className||a===!1?"":L.get(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(ab," ").indexOf(b)>=0)return!0;return!1}});var bb=/\r/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(bb,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.trim(n.text(a))}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(k.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=n.inArray(d.value,f)>=0)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>=0:void 0}},k.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var cb=n.now(),db=/\?/;n.parseJSON=function(a){return JSON.parse(a+"")},n.parseXML=function(a){var b,c;if(!a||"string"!=typeof a)return null;try{c=new DOMParser,b=c.parseFromString(a,"text/xml")}catch(d){b=void 0}return(!b||b.getElementsByTagName("parsererror").length)&&n.error("Invalid XML: "+a),b};var eb=/#.*$/,fb=/([?&])_=[^&]*/,gb=/^(.*?):[ \t]*([^\r\n]*)$/gm,hb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,ib=/^(?:GET|HEAD)$/,jb=/^\/\//,kb=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,lb={},mb={},nb="*/".concat("*"),ob=a.location.href,pb=kb.exec(ob.toLowerCase())||[];function qb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(E)||[];if(n.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function rb(a,b,c,d){var e={},f=a===mb;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function sb(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&n.extend(!0,a,d),a}function tb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function ub(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:ob,type:"GET",isLocal:hb.test(pb[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":nb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?sb(sb(a,n.ajaxSettings),b):sb(n.ajaxSettings,a)},ajaxPrefilter:qb(lb),ajaxTransport:qb(mb),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=n.ajaxSetup({},b),l=k.context||k,m=k.context&&(l.nodeType||l.jquery)?n(l):n.event,o=n.Deferred(),p=n.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!f){f={};while(b=gb.exec(e))f[b[1].toLowerCase()]=b[2]}b=f[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?e:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return c&&c.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||ob)+"").replace(eb,"").replace(jb,pb[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=n.trim(k.dataType||"*").toLowerCase().match(E)||[""],null==k.crossDomain&&(h=kb.exec(k.url.toLowerCase()),k.crossDomain=!(!h||h[1]===pb[1]&&h[2]===pb[2]&&(h[3]||("http:"===h[1]?"80":"443"))===(pb[3]||("http:"===pb[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=n.param(k.data,k.traditional)),rb(lb,k,b,v),2===t)return v;i=n.event&&k.global,i&&0===n.active++&&n.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!ib.test(k.type),d=k.url,k.hasContent||(k.data&&(d=k.url+=(db.test(d)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=fb.test(d)?d.replace(fb,"$1_="+cb++):d+(db.test(d)?"&":"?")+"_="+cb++)),k.ifModified&&(n.lastModified[d]&&v.setRequestHeader("If-Modified-Since",n.lastModified[d]),n.etag[d]&&v.setRequestHeader("If-None-Match",n.etag[d])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+nb+"; q=0.01":""):k.accepts["*"]);for(j in k.headers)v.setRequestHeader(j,k.headers[j]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(j in{success:1,error:1,complete:1})v[j](k[j]);if(c=rb(mb,k,b,v)){v.readyState=1,i&&m.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,c.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,f,h){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),c=void 0,e=h||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,f&&(u=tb(k,v,f)),u=ub(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(n.lastModified[d]=w),w=v.getResponseHeader("etag"),w&&(n.etag[d]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,i&&m.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),i&&(m.trigger("ajaxComplete",[v,k]),--n.active||n.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){var b;return n.isFunction(a)?this.each(function(b){n(this).wrapAll(a.call(this,b))}):(this[0]&&(b=n(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return this.each(n.isFunction(a)?function(b){n(this).wrapInner(a.call(this,b))}:function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0},n.expr.filters.visible=function(a){return!n.expr.filters.hidden(a)};var vb=/%20/g,wb=/\[\]$/,xb=/\r?\n/g,yb=/^(?:submit|button|image|reset|file)$/i,zb=/^(?:input|select|textarea|keygen)/i;function Ab(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||wb.test(a)?d(a,e):Ab(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Ab(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Ab(c,a[c],b,e);return d.join("&").replace(vb,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&zb.test(this.nodeName)&&!yb.test(a)&&(this.checked||!T.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(xb,"\r\n")}}):{name:b.name,value:c.replace(xb,"\r\n")}}).get()}}),n.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(a){}};var Bb=0,Cb={},Db={0:200,1223:204},Eb=n.ajaxSettings.xhr();a.attachEvent&&a.attachEvent("onunload",function(){for(var a in Cb)Cb[a]()}),k.cors=!!Eb&&"withCredentials"in Eb,k.ajax=Eb=!!Eb,n.ajaxTransport(function(a){var b;return k.cors||Eb&&!a.crossDomain?{send:function(c,d){var e,f=a.xhr(),g=++Bb;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)f.setRequestHeader(e,c[e]);b=function(a){return function(){b&&(delete Cb[g],b=f.onload=f.onerror=null,"abort"===a?f.abort():"error"===a?d(f.status,f.statusText):d(Db[f.status]||f.status,f.statusText,"string"==typeof f.responseText?{text:f.responseText}:void 0,f.getAllResponseHeaders()))}},f.onload=b(),f.onerror=b("error"),b=Cb[g]=b("abort");try{f.send(a.hasContent&&a.data||null)}catch(h){if(b)throw h}},abort:function(){b&&b()}}:void 0}),n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(d,e){b=n("<script>").prop({async:!0,charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&e("error"===a.type?404:200,a.type)}),l.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Fb=[],Gb=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Fb.pop()||n.expando+"_"+cb++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Gb.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Gb.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Gb,"$1"+e):b.jsonp!==!1&&(b.url+=(db.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Fb.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||l;var d=v.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=n.buildFragment([a],b,e),e&&e.length&&n(e).remove(),n.merge([],d.childNodes))};var Hb=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&Hb)return Hb.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=n.trim(a.slice(h)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e,dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,f||[a.responseText,b,a])}),this},n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};var Ib=a.document.documentElement;function Jb(a){return n.isWindow(a)?a:9===a.nodeType&&a.defaultView}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)return b=f.documentElement,n.contains(b,d)?(typeof d.getBoundingClientRect!==U&&(e=d.getBoundingClientRect()),c=Jb(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===n.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(d=a.offset()),d.top+=n.css(a[0],"borderTopWidth",!0),d.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-n.css(c,"marginTop",!0),left:b.left-d.left-n.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||Ib;while(a&&!n.nodeName(a,"html")&&"static"===n.css(a,"position"))a=a.offsetParent;return a||Ib})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(b,c){var d="pageYOffset"===c;n.fn[b]=function(e){return J(this,function(b,e,f){var g=Jb(b);return void 0===f?g?g[c]:b[e]:void(g?g.scrollTo(d?a.pageXOffset:f,d?f:a.pageYOffset):b[e]=f)},b,e,arguments.length,null)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=ya(k.pixelPosition,function(a,c){return c?(c=xa(a,b),va.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return J(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.size=function(){return this.length},n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var Kb=a.jQuery,Lb=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=Lb),b&&a.jQuery===n&&(a.jQuery=Kb),n},typeof b===U&&(a.jQuery=a.$=n),n});


 /**** NODEFONY  CONCAT : bootstrap.js  ***/
/*!
 * Bootstrap v3.3.6 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 2)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.6
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.6
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.6'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.6
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.6'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.6
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.6'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.6
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.6'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.6
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.6'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.6
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.6'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.6
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.6'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.6
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.6'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.6
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.6'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.6
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.6'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.6
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.6'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);


 /**** NODEFONY  CONCAT : twig.js  ***/
/**
 * Twig.js 0.7.0
 *
 * @copyright 2011-2013 John Roepke
 * @license   Available under the BSD 2-Clause License
 * @link      https://github.com/justjohn/twig.js
 */

var Twig = (function (Twig) {

    Twig.VERSION = "0.7.0";

    return Twig;
})(Twig || {});
//     Twig.js
//     Copyright (c) 2011-2013 John Roepke
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

var Twig = (function (Twig) {
    "use strict";
    // ## twig.core.js
    //
    // This file handles template level tokenizing, compiling and parsing.

    Twig.trace = false;
    Twig.debug = false;

    // Default caching to true for the improved performance it offers
    Twig.cache = true;

    Twig.placeholders = {
        parent: "{{|PARENT|}}"
    };

    /**
     * Fallback for Array.indexOf for IE8 et al
     */
    Twig.indexOf = function (arr, searchElement /*, fromIndex */ ) {
        if (Array.prototype.hasOwnProperty("indexOf")) {
            return arr.indexOf(searchElement);
        }
        if (arr === void 0 || arr === null) {
            throw new TypeError();
        }
        var t = Object(arr);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n !== n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            // console.log("indexOf not found1 ", JSON.stringify(searchElement), JSON.stringify(arr));
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        if (arr == searchElement) {
            return 0;
        }
        // console.log("indexOf not found2 ", JSON.stringify(searchElement), JSON.stringify(arr));

        return -1;
    }

    Twig.forEach = function (arr, callback, thisArg) {
        if (Array.prototype.forEach ) {
            return arr.forEach(callback, thisArg);
        }

        var T, k;

        if ( arr == null ) {
          throw new TypeError( " this is null or not defined" );
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(arr);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if ( {}.toString.call(callback) != "[object Function]" ) {
          throw new TypeError( callback + " is not a function" );
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if ( thisArg ) {
          T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while( k < len ) {

          var kValue;

          // a. Let Pk be ToString(k).
          //   This is implicit for LHS operands of the in operator
          // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
          //   This step can be combined with c
          // c. If kPresent is true, then
          if ( k in O ) {

            // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
            kValue = O[ k ];

            // ii. Call the Call internal method of callback with T as the this value and
            // argument list containing kValue, k, and O.
            callback.call( T, kValue, k, O );
          }
          // d. Increase k by 1.
          k++;
        }
        // 8. return undefined
    };

    /**
     * Exception thrown by twig.js.
     */
    Twig.Error = function(message) {
       this.message = message;
       this.name = "TwigException";
       this.type = "TwigException";
    };

    /**
     * Get the string representation of a Twig error.
     */
    Twig.Error.prototype.toString = function() {
        var output = this.name + ": " + this.message;

        return output;
    };

    /**
     * Wrapper for logging to the console.
     */
    Twig.log = {
        trace: function() {if (Twig.trace && console) {console.log(Array.prototype.slice.call(arguments));}},
        debug: function() {if (Twig.debug && console) {console.log(Array.prototype.slice.call(arguments));}}
    };

    if (typeof console !== "undefined" && 
        typeof console.log !== "undefined") {
        Twig.log.error = function() {
            console.log.apply(console, arguments);
        }
    } else {
        Twig.log.error = function(){};
    }

    /**
     * Container for methods related to handling high level template tokens
     *      (for example: {{ expression }}, {% logic %}, {# comment #}, raw data)
     */
    Twig.token = {};

    /**
     * Token types.
     */
    Twig.token.type = {
        output:  'output',
        logic:   'logic',
        comment: 'comment',
        raw:     'raw'
    };

    /**
     * Token syntax definitions.
     */
    Twig.token.definitions = [
        {
            type: Twig.token.type.raw,
            open: '{% raw %}',
            close: '{% endraw %}'
        },
        // *Output type tokens*
        //
        // These typically take the form `{{ expression }}`.
        {
            type: Twig.token.type.output,
            open: '{{',
            close: '}}'
        },
        // *Logic type tokens*
        //
        // These typically take a form like `{% if expression %}` or `{% endif %}`
        {
            type: Twig.token.type.logic,
            open: '{%',
            close: '%}'
        },
        // *Comment type tokens*
        //
        // These take the form `{# anything #}`
        {
            type: Twig.token.type.comment,
            open: '{#',
            close: '#}'
        }
    ];


    /**
     * What characters start "strings" in token definitions. We need this to ignore token close
     * strings inside an expression.
     */
    Twig.token.strings = ['"', "'"];

    Twig.token.findStart = function (template) {
        var output = {
                position: null,
                def: null
            },
            i,
            token_template,
            first_key_position;

        for (i=0;i<Twig.token.definitions.length;i++) {
            token_template = Twig.token.definitions[i];
            first_key_position = template.indexOf(token_template.open);

            Twig.log.trace("Twig.token.findStart: ", "Searching for ", token_template.open, " found at ", first_key_position);

            // Does this token occur before any other types?
            if (first_key_position >= 0 && (output.position === null || first_key_position < output.position)) {
                output.position = first_key_position;
                output.def = token_template;
            }
        }

        return output;
    };

    Twig.token.findEnd = function (template, token_def, start) {
        var end = null,
            found = false,
            offset = 0,

            // String position variables
            str_pos = null,
            str_found = null,
            pos = null,
            end_offset = null,
            this_str_pos = null,
            end_str_pos = null,

            // For loop variables
            i,
            l;

        while (!found) {
            str_pos = null;
            str_found = null;
            pos = template.indexOf(token_def.close, offset);

            if (pos >= 0) {
                end = pos;
                found = true;
            } else {
                // throw an exception
                throw new Twig.Error("Unable to find closing bracket '" + token_def.close +
                                "'" + " opened near template position " + start);
            }

            // Ignore quotes within comments; just look for the next comment close sequence,
            // regardless of what comes before it. https://github.com/justjohn/twig.js/issues/95
            if (token_def.type === Twig.token.type.comment) {
              break;
            }

            l = Twig.token.strings.length;
            for (i = 0; i < l; i += 1) {
                this_str_pos = template.indexOf(Twig.token.strings[i], offset);

                if (this_str_pos > 0 && this_str_pos < pos &&
                        (str_pos === null || this_str_pos < str_pos)) {
                    str_pos = this_str_pos;
                    str_found = Twig.token.strings[i];
                }
            }

            // We found a string before the end of the token, now find the string's end and set the search offset to it
            if (str_pos !== null) {
                end_offset = str_pos + 1;
                end = null;
                found = false;
                while (true) {
                    end_str_pos = template.indexOf(str_found, end_offset);
                    if (end_str_pos < 0) {
                        throw "Unclosed string in template";
                    }
                    // Ignore escaped quotes
                    if (template.substr(end_str_pos - 1, 1) !== "\\") {
                        offset = end_str_pos + 1;
                        break;
                    } else {
                        end_offset = end_str_pos + 1;
                    }
                }
            }
        }
        return end;
    };

    /**
     * Convert a template into high-level tokens.
     */
    Twig.tokenize = function (template) {
        var tokens = [],
            // An offset for reporting errors locations in the template.
            error_offset = 0,

            // The start and type of the first token found in the template.
            found_token = null,
            // The end position of the matched token.
            end = null;

        while (template.length > 0) {
            // Find the first occurance of any token type in the template
            found_token = Twig.token.findStart(template);

            Twig.log.trace("Twig.tokenize: ", "Found token: ", found_token);

            if (found_token.position !== null) {
                // Add a raw type token for anything before the start of the token
                if (found_token.position > 0) {
                    tokens.push({
                        type: Twig.token.type.raw,
                        value: template.substring(0, found_token.position)
                    });
                }
                template = template.substr(found_token.position + found_token.def.open.length);
                error_offset += found_token.position + found_token.def.open.length;

                // Find the end of the token
                end = Twig.token.findEnd(template, found_token.def, error_offset);

                Twig.log.trace("Twig.tokenize: ", "Token ends at ", end);

                tokens.push({
                    type:  found_token.def.type,
                    value: template.substring(0, end).trim()
                });

                if ( found_token.def.type === "logic" && template.substr( end + found_token.def.close.length, 1 ) === "\n" ) {
                    // Newlines directly after logic tokens are ignored
                    end += 1;
                }

                template = template.substr(end + found_token.def.close.length);

                // Increment the position in the template
                error_offset += end + found_token.def.close.length;

            } else {
                // No more tokens -> add the rest of the template as a raw-type token
                tokens.push({
                    type: Twig.token.type.raw,
                    value: template
                });
                template = '';
            }
        }

        return tokens;
    };


    Twig.compile = function (tokens) {
        try {

            // Output and intermediate stacks
            var output = [],
                stack = [],
                // The tokens between open and close tags
                intermediate_output = [],

                token = null,
                logic_token = null,
                unclosed_token = null,
                // Temporary previous token.
                prev_token = null,
                // The previous token's template
                prev_template = null,
                // The output token
                tok_output = null,

                // Logic Token values
                type = null,
                open = null,
                next = null;

            while (tokens.length > 0) {
                token = tokens.shift();
                Twig.log.trace("Compiling token ", token);
                switch (token.type) {
                    case Twig.token.type.raw:
                        if (stack.length > 0) {
                            intermediate_output.push(token);
                        } else {
                            output.push(token);
                        }
                        break;

                    case Twig.token.type.logic:
                        // Compile the logic token
                        logic_token = Twig.logic.compile.apply(this, [token]);

                        type = logic_token.type;
                        open = Twig.logic.handler[type].open;
                        next = Twig.logic.handler[type].next;

                        Twig.log.trace("Twig.compile: ", "Compiled logic token to ", logic_token,
                                                         " next is: ", next, " open is : ", open);

                        // Not a standalone token, check logic stack to see if this is expected
                        if (open !== undefined && !open) {
                            prev_token = stack.pop();
                            prev_template = Twig.logic.handler[prev_token.type];

                            if (Twig.indexOf(prev_template.next, type) < 0) {
                                throw new Error(type + " not expected after a " + prev_token.type);
                            }

                            prev_token.output = prev_token.output || [];

                            prev_token.output = prev_token.output.concat(intermediate_output);
                            intermediate_output = [];

                            tok_output = {
                                type: Twig.token.type.logic,
                                token: prev_token
                            };
                            if (stack.length > 0) {
                                intermediate_output.push(tok_output);
                            } else {
                                output.push(tok_output);
                            }
                        }

                        // This token requires additional tokens to complete the logic structure.
                        if (next !== undefined && next.length > 0) {
                            Twig.log.trace("Twig.compile: ", "Pushing ", logic_token, " to logic stack.");

                            if (stack.length > 0) {
                                // Put any currently held output into the output list of the logic operator
                                // currently at the head of the stack before we push a new one on.
                                prev_token = stack.pop();
                                prev_token.output = prev_token.output || [];
                                prev_token.output = prev_token.output.concat(intermediate_output);
                                stack.push(prev_token);
                                intermediate_output = [];
                            }

                            // Push the new logic token onto the logic stack
                            stack.push(logic_token);

                        } else if (open !== undefined && open) {
                            tok_output = {
                                type: Twig.token.type.logic,
                                token: logic_token
                            };
                            // Standalone token (like {% set ... %}
                            if (stack.length > 0) {
                                intermediate_output.push(tok_output);
                            } else {
                                output.push(tok_output);
                            }
                        }
                        break;

                    // Do nothing, comments should be ignored
                    case Twig.token.type.comment:
                        break;

                    case Twig.token.type.output:
                        Twig.expression.compile.apply(this, [token]);
                        if (stack.length > 0) {
                            intermediate_output.push(token);
                        } else {
                            output.push(token);
                        }
                        break;
                }

                Twig.log.trace("Twig.compile: ", " Output: ", output,
                                                 " Logic Stack: ", stack,
                                                 " Pending Output: ", intermediate_output );
            }

            // Verify that there are no logic tokens left in the stack.
            if (stack.length > 0) {
                unclosed_token = stack.pop();
                throw new Error("Unable to find an end tag for " + unclosed_token.type +
                                ", expecting one of " + unclosed_token.next);
            }
            return output;
        } catch (ex) {
            Twig.log.error("Error compiling twig template " + this.id + ": ");
            if (ex.stack) {
                Twig.log.error(ex.stack);
            } else {
                Twig.log.error(ex.toString());
            }

            if (this.options.rethrow) throw ex;
        }
    };

    /**
     * Parse a compiled template.
     *
     * @param {Array} tokens The compiled tokens.
     * @param {Object} context The render context.
     *
     * @return {string} The parsed template.
     */
    Twig.parse = function (tokens, context) {
        try {
            var output = [],
                // Track logic chains
                chain = true,
                that = this;

            // Default to an empty object if none provided
            context = context || { };


            Twig.forEach(tokens, function parseToken(token) {
                Twig.log.debug("Twig.parse: ", "Parsing token: ", token);

                switch (token.type) {
                    case Twig.token.type.raw:
                        output.push(token.value);
                        break;

                    case Twig.token.type.logic:
                        var logic_token = token.token,
                            logic = Twig.logic.parse.apply(that, [logic_token, context, chain]);

                        if (logic.chain !== undefined) {
                            chain = logic.chain;
                        }
                        if (logic.context !== undefined) {
                            context = logic.context;
                        }
                        if (logic.output !== undefined) {
                            output.push(logic.output);
                        }
                        break;

                    case Twig.token.type.comment:
                        // Do nothing, comments should be ignored
                        break;

                    case Twig.token.type.output:
                        Twig.log.debug("Twig.parse: ", "Output token: ", token.stack);
                        // Parse the given expression in the given context
                        output.push(Twig.expression.parse.apply(that, [token.stack, context]));
                        break;
                }
            });
            return output.join("");
        } catch (ex) {
            Twig.log.error("Error parsing twig template " + this.id + ": ");
            if (ex.stack) {
                Twig.log.error(ex.stack);
            } else {
                Twig.log.error(ex.toString());
            }

            if (this.options.rethrow) throw ex;

            if (Twig.debug) {
                return ex.toString();
            }
        }
    };

    /**
     * Tokenize and compile a string template.
     *
     * @param {string} data The template.
     *
     * @return {Array} The compiled tokens.
     */
    Twig.prepare = function(data) {
        var tokens, raw_tokens;

        // Tokenize
        Twig.log.debug("Twig.prepare: ", "Tokenizing ", data);
        raw_tokens = Twig.tokenize.apply(this, [data]);

        // Compile
        Twig.log.debug("Twig.prepare: ", "Compiling ", raw_tokens);
        tokens = Twig.compile.apply(this, [raw_tokens]);

        Twig.log.debug("Twig.prepare: ", "Compiled ", tokens);

        return tokens;
    };

    // Namespace for template storage and retrieval
    Twig.Templates = {
        registry: {}
    };

    /**
     * Is this id valid for a twig template?
     *
     * @param {string} id The ID to check.
     *
     * @throws {Twig.Error} If the ID is invalid or used.
     * @return {boolean} True if the ID is valid.
     */
    Twig.validateId = function(id) {
        if (id === "prototype") {
            throw new Twig.Error(id + " is not a valid twig identifier");
        } else if (Twig.Templates.registry.hasOwnProperty(id)) {
            throw new Twig.Error("There is already a template with the ID " + id);
        }
        return true;
    }

    /**
     * Save a template object to the store.
     *
     * @param {Twig.Template} template   The twig.js template to store.
     */
    Twig.Templates.save = function(template) {
        if (template.id === undefined) {
            throw new Twig.Error("Unable to save template with no id");
        }
        Twig.Templates.registry[template.id] = template;
    };

    /**
     * Load a previously saved template from the store.
     *
     * @param {string} id   The ID of the template to load.
     *
     * @return {Twig.Template} A twig.js template stored with the provided ID.
     */
    Twig.Templates.load = function(id) {
        if (!Twig.Templates.registry.hasOwnProperty(id)) {
            return null;
        }
        return Twig.Templates.registry[id];
    };

    /**
     * Load a template from a remote location using AJAX and saves in with the given ID.
     *
     * Available parameters:
     *
     *      async:       Should the HTTP request be performed asynchronously.
     *                      Defaults to true.
     *      method:      What method should be used to load the template
     *                      (fs or ajax)
     *      precompiled: Has the template already been compiled.
     *
     * @param {string} location  The remote URL to load as a template.
     * @param {Object} params The template parameters.
     * @param {function} callback  A callback triggered when the template finishes loading.
     * @param {function} error_callback  A callback triggered if an error occurs loading the template.
     *
     *
     */
    Twig.Templates.loadRemote = function(location, params, callback, error_callback) {
        var id          = params.id,
            method      = params.method,
            async       = params.async,
            precompiled = params.precompiled,
            template    = null;

        // Default to async
        if (async === undefined) async = true;

        // Default to the URL so the template is cached.
        if (id === undefined) {
            id = location;
        }
        params.id = id;

        // Check for existing template
        if (Twig.cache && Twig.Templates.registry.hasOwnProperty(id)) {
            // A template is already saved with the given id.
            if (callback) {
                callback(Twig.Templates.registry[id]);
            }
            return Twig.Templates.registry[id];
        }

        if (method == 'ajax') {
            if (typeof XMLHttpRequest == "undefined") {
                throw new Twig.Error("Unsupported platform: Unable to do remote requests " +
                                     "because there is no XMLHTTPRequest implementation");
            }

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                var data = null;

                if(xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                        Twig.log.debug("Got template ", xmlhttp.responseText);

                        if (precompiled === true) {
                            data = JSON.parse(xmlhttp.responseText);
                        } else {
                            data = xmlhttp.responseText;
                        }

                        params.url = location;
                        params.data = data;

                        template = new Twig.Template(params);

                        if (callback) {
                            callback(template);
                        }
                    } else {
                        if (error_callback) {
                            error_callback(xmlhttp);
                        }
                    }
                }
            };
            xmlhttp.open("GET", location, async);
            xmlhttp.send();

        } else { // if method = 'fs'
            // Create local scope
            (function() {
                var fs = require('fs'),
                    path = require('path'),
                    data = null,
                    loadTemplateFn = function(err, data) {
                        if (err) {
                            if (error_callback) {
                                error_callback(err);
                            }
                            return;
                        }

                        if (precompiled === true) {
                            data = JSON.parse(data);
                        }

                        params.data = data;
                        params.path = location;

                        // template is in data
                        template = new Twig.Template(params);

                        if (callback) {
                            callback(template);
                        }
                    };

                if (async === true) {
                    fs.stat(location, function (err, stats) {
                        if (err || !stats.isFile())
                            throw new Twig.Error("Unable to find template file " + location);

                        fs.readFile(location, 'utf8', loadTemplateFn);
                    });
                } else {
                    if (!fs.statSync(location).isFile())
                        throw new Twig.Error("Unable to find template file " + location);

                    data = fs.readFileSync(location, 'utf8');
                    loadTemplateFn(undefined, data);
                }
            })();
        }
        if (async === false) {
            return template;
        } else {
            // placeholder for now, should eventually return a deferred object.
            return true;
        }
    };

    // Determine object type
    function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }

    /**
     * Create a new twig.js template.
     *
     * Parameters: {
     *      data:   The template, either pre-compiled tokens or a string template
     *      id:     The name of this template
     *      blocks: Any pre-existing block from a child template
     * }
     *
     * @param {Object} params The template parameters.
     */
    Twig.Template = function ( params ) {
        var data = params.data,
            id = params.id,
            blocks = params.blocks,
            macros = params.macros || {},
            base = params.base,
            path = params.path,
            url = params.url,
            // parser options
            options = params.options;

        // # What is stored in a Twig.Template
        //
        // The Twig Template hold several chucks of data.
        //
        //     {
        //          id:     The token ID (if any)
        //          tokens: The list of tokens that makes up this template.
        //          blocks: The list of block this template contains.
        //          base:   The base template (if any)
        //            options:  {
        //                Compiler/parser options
        //
        //                strict_variables: true/false
        //                    Should missing variable/keys emit an error message. If false, they default to null.
        //            }
        //     }
        //

        this.id     = id;
        this.base   = base;
        this.path   = path;
        this.url    = url;
        this.macros = macros;
        this.options = options;

        this.reset(blocks);

        if (is('String', data)) {
            this.tokens = Twig.prepare.apply(this, [data]);
        } else {
            this.tokens = data;
        }

        if (id !== undefined) {
            Twig.Templates.save(this);
        }
    };

    Twig.Template.prototype.reset = function(blocks) {
        Twig.log.debug("Twig.Template.reset", "Reseting template " + this.id);
        this.blocks = {};
        this.child = {
            blocks: blocks || {}
        };
        this.extend = null;
    };

    Twig.Template.prototype.render = function (context, params) {
        params = params || {};

        var output,
            url;

        this.context = context || {};

        // Clear any previous state
        this.reset();
        if (params.blocks) {
            this.blocks = params.blocks;
        }
        if (params.macros) {
            this.macros = params.macros;
        }

        output = Twig.parse.apply(this, [this.tokens, this.context]);

        // Does this template extend another
        if (this.extend) {
            var ext_template;

            // check if the template is provided inline
            if ( this.options.allowInlineIncludes ) {
                ext_template = Twig.Templates.load(this.extend);
                if ( ext_template ) {
                    ext_template.options = this.options;
                }
            }

            // check for the template file via include
            if (!ext_template) {
                url = relativePath(this, this.extend);

                ext_template = Twig.Templates.loadRemote(url, {
                    method: this.url?'ajax':'fs',
                    base: this.base,
                    async:  false,
                    id:     url,
                    options: this.options
                });
            }

            this.parent = ext_template;

            return this.parent.render(this.context, {
                blocks: this.blocks
            });
        }

        if (params.output == 'blocks') {
            return this.blocks;
        } else if (params.output == 'macros') {
            return this.macros;
        } else {
            return output;
        }
    };

    Twig.Template.prototype.importFile = function(file) {
        var url, sub_template;
        if ( !this.url && !this.path && this.options.allowInlineIncludes ) {
            sub_template = Twig.Templates.load(file);
            sub_template.options = this.options;
            if ( sub_template ) {
                return sub_template;
            }

            throw new Twig.Error("Didn't find the inline template by id");
        }

        url = relativePath(this, file);

        // Load blocks from an external file
        sub_template = Twig.Templates.loadRemote(url, {
            method: this.url?'ajax':'fs',
            base: this.base,
            async: false,
            options: this.options,
            id: url
        });

        return sub_template;
    };

    Twig.Template.prototype.importBlocks = function(file, override) {
        var sub_template = this.importFile(file),
            context = this.context,
            that = this,
            key;

        override = override || false;

        sub_template.render(context);

        // Mixin blocks
        Twig.forEach(Object.keys(sub_template.blocks), function(key) {
            if (override || that.blocks[key] === undefined) {
                that.blocks[key] = sub_template.blocks[key];
            }
        });
    };

    Twig.Template.prototype.importMacros = function(file) {
        var url = relativePath(this, file);

        // load remote template
        var remoteTemplate = Twig.Templates.loadRemote(url, {
            method: this.url?'ajax':'fs',
            async: false,
            id: url
        });

        return remoteTemplate;
    };

    Twig.Template.prototype.compile = function(options) {
        // compile the template into raw JS
        return Twig.compiler.compile(this, options);
    };

    /**
     * Generate the relative canonical version of a url based on the given base path and file path.
     *
     * @param {string} template The Twig.Template.
     * @param {string} file The file path, relative to the base path.
     *
     * @return {string} The canonical version of the path.
     */
    function relativePath(template, file) {
        var base,
            base_path,
            sep_chr = "/",
            new_path = [],
            val;

        if (template.url) {
            if (typeof template.base !== 'undefined') {
                base = template.base + ((template.base.charAt(template.base.length-1) === '/') ? '' : '/');
            } else {
                base = template.url;
            }
        } else if (template.path) {
            // Get the system-specific path separator
            var path = require("path"),
                sep = path.sep || sep_chr,
                relative = new RegExp("^\\.{1,2}" + sep.replace("\\", "\\\\"));

            if (template.base !== undefined && file.match(relative) == null) {
                file = file.replace(template.base, '');
                base = template.base + sep;
            } else {
                base = template.path;
            }

            base = base.replace(sep+sep, sep);
            sep_chr = sep;
        } else {
            throw new Twig.Error("Cannot extend an inline template.");
        }

        base_path = base.split(sep_chr);

        // Remove file from url
        base_path.pop();
        base_path = base_path.concat(file.split(sep_chr));

        while (base_path.length > 0) {
            val = base_path.shift();
            if (val == ".") {
                // Ignore
            } else if (val == ".." && new_path.length > 0 && new_path[new_path.length-1] != "..") {
                new_path.pop();
            } else {
                new_path.push(val);
            }
        }

        return new_path.join(sep_chr);
    }

    return Twig;

}) (Twig || { });

// The following methods are from MDN and are available under a
// [MIT License](http://www.opensource.org/licenses/mit-license.php) or are
// [Public Domain](https://developer.mozilla.org/Project:Copyrights).
//
// See:
// * [Object.keys - MDN](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys)

// ## twig.fills.js
//
// This file contains fills for backwards compatability.
(function() {
    "use strict";
    // Handle methods that don't yet exist in every browser

    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g,'');
        }
    };

    if(!Object.keys) Object.keys = function(o){
        if (o !== Object(o)) {
            throw new TypeError('Object.keys called on non-object');
        }
        var ret = [], p;
        for (p in o) if (Object.prototype.hasOwnProperty.call(o, p)) ret.push(p);
        return ret;
    }

})();
// ## twig.lib.js
//
// This file contains 3rd party libraries used within twig.
//
// Copies of the licenses for the code included here can be found in the
// LICENSES.md file.
//

var Twig = (function(Twig) {

    // Namespace for libraries
    Twig.lib = { };

    /**
    sprintf() for JavaScript 0.7-beta1
    http://www.diveintojavascript.com/projects/javascript-sprintf
    **/
    var sprintf = (function() {
            function get_type(variable) {
                    return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
            }
            function str_repeat(input, multiplier) {
                    for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
                    return output.join('');
            }

            var str_format = function() {
                    if (!str_format.cache.hasOwnProperty(arguments[0])) {
                            str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
                    }
                    return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
            };

            str_format.format = function(parse_tree, argv) {
                    var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
                    for (i = 0; i < tree_length; i++) {
                            node_type = get_type(parse_tree[i]);
                            if (node_type === 'string') {
                                    output.push(parse_tree[i]);
                            }
                            else if (node_type === 'array') {
                                    match = parse_tree[i]; // convenience purposes only
                                    if (match[2]) { // keyword argument
                                            arg = argv[cursor];
                                            for (k = 0; k < match[2].length; k++) {
                                                    if (!arg.hasOwnProperty(match[2][k])) {
                                                            throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
                                                    }
                                                    arg = arg[match[2][k]];
                                            }
                                    }
                                    else if (match[1]) { // positional argument (explicit)
                                            arg = argv[match[1]];
                                    }
                                    else { // positional argument (implicit)
                                            arg = argv[cursor++];
                                    }

                                    if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
                                            throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
                                    }
                                    switch (match[8]) {
                                            case 'b': arg = arg.toString(2); break;
                                            case 'c': arg = String.fromCharCode(arg); break;
                                            case 'd': arg = parseInt(arg, 10); break;
                                            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
                                            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
                                            case 'o': arg = arg.toString(8); break;
                                            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
                                            case 'u': arg = Math.abs(arg); break;
                                            case 'x': arg = arg.toString(16); break;
                                            case 'X': arg = arg.toString(16).toUpperCase(); break;
                                    }
                                    arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
                                    pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
                                    pad_length = match[6] - String(arg).length;
                                    pad = match[6] ? str_repeat(pad_character, pad_length) : '';
                                    output.push(match[5] ? arg + pad : pad + arg);
                            }
                    }
                    return output.join('');
            };

            str_format.cache = {};

            str_format.parse = function(fmt) {
                    var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
                    while (_fmt) {
                            if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
                                    parse_tree.push(match[0]);
                            }
                            else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
                                    parse_tree.push('%');
                            }
                            else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
                                    if (match[2]) {
                                            arg_names |= 1;
                                            var field_list = [], replacement_field = match[2], field_match = [];
                                            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                                                    field_list.push(field_match[1]);
                                                    while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                                                            if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                                                                    field_list.push(field_match[1]);
                                                            }
                                                            else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                                                                    field_list.push(field_match[1]);
                                                            }
                                                            else {
                                                                    throw('[sprintf] huh?');
                                                            }
                                                    }
                                            }
                                            else {
                                                    throw('[sprintf] huh?');
                                            }
                                            match[2] = field_list;
                                    }
                                    else {
                                            arg_names |= 2;
                                    }
                                    if (arg_names === 3) {
                                            throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
                                    }
                                    parse_tree.push(match);
                            }
                            else {
                                    throw('[sprintf] huh?');
                            }
                            _fmt = _fmt.substring(match[0].length);
                    }
                    return parse_tree;
            };

            return str_format;
    })();

    var vsprintf = function(fmt, argv) {
        argv.unshift(fmt);
        return sprintf.apply(null, argv);
    };

    // Expose to Twig
    Twig.lib.sprintf = sprintf;
    Twig.lib.vsprintf = vsprintf;


    /**
     * jPaq - A fully customizable JavaScript/JScript library
     * http://jpaq.org/
     *
     * Copyright (c) 2011 Christopher West
     * Licensed under the MIT license.
     * http://jpaq.org/license/
     *
     * Version: 1.0.6.0000W
     * Revised: April 6, 2011
     */
    ; (function() {
        var shortDays = "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",");
        var fullDays = "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(",");
        var shortMonths = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(",");
        var fullMonths = "January,February,March,April,May,June,July,August,September,October,November,December".split(",");
        function getOrdinalFor(intNum) {
                return (((intNum = Math.abs(intNum) % 100) % 10 == 1 && intNum != 11) ? "st"
                        : (intNum % 10 == 2 && intNum != 12) ? "nd" : (intNum % 10 == 3
                        && intNum != 13) ? "rd" : "th");
        }
        function getISO8601Year(aDate) {
                var d = new Date(aDate.getFullYear() + 1, 0, 4);
                if((d - aDate) / 86400000 < 7 && (aDate.getDay() + 6) % 7 < (d.getDay() + 6) % 7)
                        return d.getFullYear();
                if(aDate.getMonth() > 0 || aDate.getDate() >= 4)
                        return aDate.getFullYear();
                return aDate.getFullYear() - (((aDate.getDay() + 6) % 7 - aDate.getDate() > 2) ? 1 : 0);
        }
        function getISO8601Week(aDate) {
                // Get a day during the first week of the year.
                var d = new Date(getISO8601Year(aDate), 0, 4);
                // Get the first monday of the year.
                d.setDate(d.getDate() - (d.getDay() + 6) % 7);
                return parseInt((aDate - d) / 604800000) + 1;
        }
        Twig.lib.formatDate = function(date, format) {
            /// <summary>
            ///   Gets a string for this date, formatted according to the given format
            ///   string.
            /// </summary>
            /// <param name="format" type="String">
            ///   The format of the output date string.  The format string works in a
            ///   nearly identical way to the PHP date function which is highlighted here:
            ///   http://php.net/manual/en/function.date.php.
            ///   The only difference is the fact that "u" signifies milliseconds
            ///   instead of microseconds.  The following characters are recognized in
            ///   the format parameter string:
            ///     d - Day of the month, 2 digits with leading zeros
            ///     D - A textual representation of a day, three letters
            ///     j - Day of the month without leading zeros
            ///     l (lowercase 'L') - A full textual representation of the day of the week
            ///     N - ISO-8601 numeric representation of the day of the week (starting from 1)
            ///     S - English ordinal suffix for the day of the month, 2 characters st,
            ///         nd, rd or th. Works well with j.
            ///     w - Numeric representation of the day of the week (starting from 0)
            ///     z - The day of the year (starting from 0)
            ///     W - ISO-8601 week number of year, weeks starting on Monday
            ///     F - A full textual representation of a month, such as January or March
            ///     m - Numeric representation of a month, with leading zeros
            ///     M - A short textual representation of a month, three letters
            ///     n - Numeric representation of a month, without leading zeros
            ///     t - Number of days in the given month
            ///     L - Whether it's a leap year
            ///     o - ISO-8601 year number. This has the same value as Y, except that if
            ///         the ISO week number (W) belongs to the previous or next year, that
            ///         year is used instead.
            ///     Y - A full numeric representation of a year, 4 digits
            ///     y - A two digit representation of a year
            ///     a - Lowercase Ante meridiem and Post meridiem
            ///     A - Uppercase Ante meridiem and Post meridiem
            ///     B - Swatch Internet time
            ///     g - 12-hour format of an hour without leading zeros
            ///     G - 24-hour format of an hour without leading zeros
            ///     h - 12-hour format of an hour with leading zeros
            ///     H - 24-hour format of an hour with leading zeros
            ///     i - Minutes with leading zeros
            ///     s - Seconds, with leading zeros
            ///     u - Milliseconds
            ///     U - Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
            /// </param>
            /// <returns type="String">
            ///   Returns the string for this date, formatted according to the given
            ///   format string.
            /// </returns>
            // If the format was not passed, use the default toString method.
            if(typeof format !== "string" || /^\s*$/.test(format))
                    return date + "";
            var jan1st = new Date(date.getFullYear(), 0, 1);
            var me = date;
            return format.replace(/[dDjlNSwzWFmMntLoYyaABgGhHisuU]/g, function(option) {
                switch(option) {
                    // Day of the month, 2 digits with leading zeros
                    case "d": return ("0" + me.getDate()).replace(/^.+(..)$/, "$1");
                    // A textual representation of a day, three letters
                    case "D": return shortDays[me.getDay()];
                    // Day of the month without leading zeros
                    case "j": return me.getDate();
                    // A full textual representation of the day of the week
                    case "l": return fullDays[me.getDay()];
                    // ISO-8601 numeric representation of the day of the week
                    case "N": return (me.getDay() + 6) % 7 + 1;
                    // English ordinal suffix for the day of the month, 2 characters
                    case "S": return getOrdinalFor(me.getDate());
                    // Numeric representation of the day of the week
                    case "w": return me.getDay();
                    // The day of the year (starting from 0)
                    case "z": return Math.ceil((jan1st - me) / 86400000);
                    // ISO-8601 week number of year, weeks starting on Monday
                    case "W": return ("0" + getISO8601Week(me)).replace(/^.(..)$/, "$1");
                    // A full textual representation of a month, such as January or March
                    case "F": return fullMonths[me.getMonth()];
                    // Numeric representation of a month, with leading zeros
                    case "m": return ("0" + (me.getMonth() + 1)).replace(/^.+(..)$/, "$1");
                    // A short textual representation of a month, three letters
                    case "M": return shortMonths[me.getMonth()];
                    // Numeric representation of a month, without leading zeros
                    case "n": return me.getMonth() + 1;
                    // Number of days in the given month
                    case "t": return new Date(me.getFullYear(), me.getMonth() + 1, -1).getDate();
                    // Whether it's a leap year
                    case "L": return new Date(me.getFullYear(), 1, 29).getDate() == 29 ? 1 : 0;
                    // ISO-8601 year number. This has the same value as Y, except that if the
                    // ISO week number (W) belongs to the previous or next year, that year is
                    // used instead.
                    case "o": return getISO8601Year(me);
                    // A full numeric representation of a year, 4 digits
                    case "Y": return me.getFullYear();
                    // A two digit representation of a year
                    case "y": return (me.getFullYear() + "").replace(/^.+(..)$/, "$1");
                    // Lowercase Ante meridiem and Post meridiem
                    case "a": return me.getHours() < 12 ? "am" : "pm";
                    // Uppercase Ante meridiem and Post meridiem
                    case "A": return me.getHours() < 12 ? "AM" : "PM";
                    // Swatch Internet time
                    case "B": return Math.floor((((me.getUTCHours() + 1) % 24) + me.getUTCMinutes() / 60 + me.getUTCSeconds() / 3600) * 1000 / 24);
                    // 12-hour format of an hour without leading zeros
                    case "g": return me.getHours() % 12 != 0 ? me.getHours() % 12 : 12;
                    // 24-hour format of an hour without leading zeros
                    case "G": return me.getHours();
                    // 12-hour format of an hour with leading zeros
                    case "h": return ("0" + (me.getHours() % 12 != 0 ? me.getHours() % 12 : 12)).replace(/^.+(..)$/, "$1");
                    // 24-hour format of an hour with leading zeros
                    case "H": return ("0" + me.getHours()).replace(/^.+(..)$/, "$1");
                    // Minutes with leading zeros
                    case "i": return ("0" + me.getMinutes()).replace(/^.+(..)$/, "$1");
                    // Seconds, with leading zeros
                    case "s": return ("0" + me.getSeconds()).replace(/^.+(..)$/, "$1");
                    // Milliseconds
                    case "u": return me.getMilliseconds();
                    // Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
                    case "U": return me.getTime() / 1000;
                }
            });
        };
    })();

    Twig.lib.strip_tags = function(input, allowed) {
        // Strips HTML and PHP tags from a string
        //
        // version: 1109.2015
        // discuss at: http://phpjs.org/functions/strip_tags
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Luke Godfrey
        // +      input by: Pul
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Onno Marsman
        // +      input by: Alex
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: Marc Palau
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: Brett Zamir (http://brett-zamir.me)
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Eric Nagel
        // +      input by: Bobby Drake
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Tomasz Wesolowski
        // +      input by: Evertjan Garretsen
        // +    revised by: Rafał Kukawski (http://blog.kukawski.pl/)
        // *     example 1: strip_tags('<p>Kevin</p> <b>van</b> <i>Zonneveld</i>', '<i><b>');
        // *     returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
        // *     example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>');
        // *     returns 2: '<p>Kevin van Zonneveld</p>'
        // *     example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>");
        // *     returns 3: '<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>'
        // *     example 4: strip_tags('1 < 5 5 > 1');
        // *     returns 4: '1 < 5 5 > 1'
        // *     example 5: strip_tags('1 <br/> 1');
        // *     returns 5: '1  1'
        // *     example 6: strip_tags('1 <br/> 1', '<br>');
        // *     returns 6: '1  1'
        // *     example 7: strip_tags('1 <br/> 1', '<br><br/>');
        // *     returns 7: '1 <br/> 1'
        allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
            return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
        });
    }

    Twig.lib.parseISO8601Date = function (s){
        // Taken from http://n8v.enteuxis.org/2010/12/parsing-iso-8601-dates-in-javascript/
        // parenthese matches:
        // year month day    hours minutes seconds  
        // dotmilliseconds 
        // tzstring plusminus hours minutes
        var re = /(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(\.\d+)?(Z|([+-])(\d\d):(\d\d))/;

        var d = [];
        d = s.match(re);

        // "2010-12-07T11:00:00.000-09:00" parses to:
        //  ["2010-12-07T11:00:00.000-09:00", "2010", "12", "07", "11",
        //     "00", "00", ".000", "-09:00", "-", "09", "00"]
        // "2010-12-07T11:00:00.000Z" parses to:
        //  ["2010-12-07T11:00:00.000Z",      "2010", "12", "07", "11", 
        //     "00", "00", ".000", "Z", undefined, undefined, undefined]

        if (! d) {
            throw "Couldn't parse ISO 8601 date string '" + s + "'";
        }

        // parse strings, leading zeros into proper ints
        var a = [1,2,3,4,5,6,10,11];
        for (var i in a) {
            d[a[i]] = parseInt(d[a[i]], 10);
        }
        d[7] = parseFloat(d[7]);

        // Date.UTC(year, month[, date[, hrs[, min[, sec[, ms]]]]])
        // note that month is 0-11, not 1-12
        // see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/UTC
        var ms = Date.UTC(d[1], d[2] - 1, d[3], d[4], d[5], d[6]);

        // if there are milliseconds, add them
        if (d[7] > 0) {  
            ms += Math.round(d[7] * 1000);
        }

        // if there's a timezone, calculate it
        if (d[8] != "Z" && d[10]) {
            var offset = d[10] * 60 * 60 * 1000;
            if (d[11]) {
                offset += d[11] * 60 * 1000;
            }
            if (d[9] == "-") {
                ms -= offset;
            }
            else {
                ms += offset;
            }
        }

        return new Date(ms);
    };

    Twig.lib.strtotime = function (str, now) {
        // http://kevin.vanzonneveld.net
        // +   original by: Caio Ariede (http://caioariede.com)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: David
        // +   improved by: Caio Ariede (http://caioariede.com)
        // +   improved by: Brett Zamir (http://brett-zamir.me)
        // +   bugfixed by: Wagner B. Soares
        // +   bugfixed by: Artur Tchernychev
        // %        note 1: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
        // *     example 1: strtotime('+1 day', 1129633200);
        // *     returns 1: 1129719600
        // *     example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
        // *     returns 2: 1130425202
        // *     example 3: strtotime('last month', 1129633200);
        // *     returns 3: 1127041200
        // *     example 4: strtotime('2009-05-04 08:30:00');
        // *     returns 4: 1241418600
        var i, l, match, s, parse = '';

        str = str.replace(/\s{2,}|^\s|\s$/g, ' '); // unecessary spaces
        str = str.replace(/[\t\r\n]/g, ''); // unecessary chars
        if (str === 'now') {
            return now === null || isNaN(now) ? new Date().getTime() / 1000 | 0 : now | 0;
        } else if (!isNaN(parse = Date.parse(str))) {
            return parse / 1000 | 0;
        } else if (now) {
            now = new Date(now * 1000); // Accept PHP-style seconds
        } else {
            now = new Date();
        }

        var upperCaseStr = str;

        str = str.toLowerCase();

        var __is = {
            day: {
                'sun': 0,
                'mon': 1,
                'tue': 2,
                'wed': 3,
                'thu': 4,
                'fri': 5,
                'sat': 6
            },
            mon: [
                'jan',
                'feb',
                'mar',
                'apr',
                'may',
                'jun',
                'jul',
                'aug',
                'sep',
                'oct',
                'nov',
                'dec'
            ]
        };

        var process = function (m) {
            var ago = (m[2] && m[2] === 'ago');
            var num = (num = m[0] === 'last' ? -1 : 1) * (ago ? -1 : 1);

            switch (m[0]) {
            case 'last':
            case 'next':
                switch (m[1].substring(0, 3)) {
                case 'yea':
                    now.setFullYear(now.getFullYear() + num);
                    break;
                case 'wee':
                    now.setDate(now.getDate() + (num * 7));
                    break;
                case 'day':
                    now.setDate(now.getDate() + num);
                    break;
                case 'hou':
                    now.setHours(now.getHours() + num);
                    break;
                case 'min':
                    now.setMinutes(now.getMinutes() + num);
                    break;
                case 'sec':
                    now.setSeconds(now.getSeconds() + num);
                    break;
                case 'mon':
                    if (m[1] === "month") {
                        now.setMonth(now.getMonth() + num);
                        break;
                    }
                    // fall through
                default:
                    var day = __is.day[m[1].substring(0, 3)];
                    if (typeof day !== 'undefined') {
                        var diff = day - now.getDay();
                        if (diff === 0) {
                            diff = 7 * num;
                        } else if (diff > 0) {
                            if (m[0] === 'last') {
                                diff -= 7;
                            }
                        } else {
                            if (m[0] === 'next') {
                                diff += 7;
                            }
                        }
                        now.setDate(now.getDate() + diff);
                        now.setHours(0, 0, 0, 0); // when jumping to a specific last/previous day of week, PHP sets the time to 00:00:00
                    }
                }
                break;

            default:
                if (/\d+/.test(m[0])) {
                    num *= parseInt(m[0], 10);

                    switch (m[1].substring(0, 3)) {
                    case 'yea':
                        now.setFullYear(now.getFullYear() + num);
                        break;
                    case 'mon':
                        now.setMonth(now.getMonth() + num);
                        break;
                    case 'wee':
                        now.setDate(now.getDate() + (num * 7));
                        break;
                    case 'day':
                        now.setDate(now.getDate() + num);
                        break;
                    case 'hou':
                        now.setHours(now.getHours() + num);
                        break;
                    case 'min':
                        now.setMinutes(now.getMinutes() + num);
                        break;
                    case 'sec':
                        now.setSeconds(now.getSeconds() + num);
                        break;
                    }
                } else {
                    return false;
                }
                break;
            }
            return true;
        };

        match = str.match(/^(\d{2,4}-\d{2}-\d{2})(?:\s(\d{1,2}:\d{2}(:\d{2})?)?(?:\.(\d+))?)?$/);
        if (match !== null) {
            if (!match[2]) {
                match[2] = '00:00:00';
            } else if (!match[3]) {
                match[2] += ':00';
            }

            s = match[1].split(/-/g);

            s[1] = __is.mon[s[1] - 1] || s[1];
            s[0] = +s[0];

            s[0] = (s[0] >= 0 && s[0] <= 69) ? '20' + (s[0] < 10 ? '0' + s[0] : s[0] + '') : (s[0] >= 70 && s[0] <= 99) ? '19' + s[0] : s[0] + '';
            return parseInt(this.strtotime(s[2] + ' ' + s[1] + ' ' + s[0] + ' ' + match[2]) + (match[4] ? match[4] / 1000 : ''), 10);
        }

        var regex = '([+-]?\\d+\\s' + '(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?' + '|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday' + '|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday)' + '|(last|next)\\s' + '(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?' + '|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday' + '|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday))' + '(\\sago)?';

        match = str.match(new RegExp(regex, 'gi')); // Brett: seems should be case insensitive per docs, so added 'i'
        if (match === null) {
            // Try to parse ISO8601 in IE8
            try {
                num = Twig.lib.parseISO8601Date(upperCaseStr);
                if (num) {
                    return num / 1000 | 0;
               }
            } catch (err) {
                return false;
            }
            return false;
        }

        for (i = 0, l = match.length; i < l; i++) {
            if (!process(match[i].split(' '))) {
                return false;
            }
        }

        return now.getTime() / 1000 | 0;
    };

    Twig.lib.is = function(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    };

    // shallow-copy an object
    Twig.lib.copy = function(src) {
        var target = {},
            key;
        for (key in src)
            target[key] = src[key];

        return target;
    };

    Twig.lib.replaceAll = function(string, search, replace) {
        return string.split(search).join(replace);
    };

    return Twig;

})(Twig || { });
//     Twig.js
//     Copyright (c) 2011-2013 John Roepke
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.logic.js
//
// This file handles tokenizing, compiling and parsing logic tokens. {% ... %}
var Twig = (function (Twig) {
    "use strict";

    /**
     * Namespace for logic handling.
     */
    Twig.logic = {};

    /**
     * Logic token types.
     */
    Twig.logic.type = {
        if_:       'Twig.logic.type.if',
        endif:     'Twig.logic.type.endif',
        for_:      'Twig.logic.type.for',
        endfor:    'Twig.logic.type.endfor',
        else_:     'Twig.logic.type.else',
        elseif:    'Twig.logic.type.elseif',
        set:       'Twig.logic.type.set',
        setcapture:'Twig.logic.type.setcapture',
        endset:    'Twig.logic.type.endset',
        filter:    'Twig.logic.type.filter',
        endfilter: 'Twig.logic.type.endfilter',
        block:     'Twig.logic.type.block',
        endblock:  'Twig.logic.type.endblock',
        extends_:  'Twig.logic.type.extends',
        use:       'Twig.logic.type.use',
        include:   'Twig.logic.type.include',
        spaceless: 'Twig.logic.type.spaceless',
        endspaceless: 'Twig.logic.type.endspaceless',
        macro:     'Twig.logic.type.macro',
        endmacro:  'Twig.logic.type.endmacro',
        import_:   'Twig.logic.type.import',
        from:      'Twig.logic.type.from'
    };


    // Regular expressions for handling logic tokens.
    //
    // Properties:
    //
    //      type:  The type of expression this matches
    //
    //      regex: A regular expression that matches the format of the token
    //
    //      next:  What logic tokens (if any) pop this token off the logic stack. If empty, the
    //             logic token is assumed to not require an end tag and isn't push onto the stack.
    //
    //      open:  Does this tag open a logic expression or is it standalone. For example,
    //             {% endif %} cannot exist without an opening {% if ... %} tag, so open = false.
    //
    //  Functions:
    //
    //      compile: A function that handles compiling the token into an output token ready for
    //               parsing with the parse function.
    //
    //      parse:   A function that parses the compiled token into output (HTML / whatever the
    //               template represents).
    Twig.logic.definitions = [
        {
            /**
             * If type logic tokens.
             *
             *  Format: {% if expression %}
             */
            type: Twig.logic.type.if_,
            regex: /^if\s+([^\s].+)$/,
            next: [
                Twig.logic.type.else_,
                Twig.logic.type.elseif,
                Twig.logic.type.endif
            ],
            open: true,
            compile: function (token) {
                var expression = token.match[1];
                // Compile the expression.
                token.stack = Twig.expression.compile.apply(this, [{
                    type:  Twig.expression.type.expression,
                    value: expression
                }]).stack;
                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                var output = '',
                    // Parse the expression
                    result = Twig.expression.parse.apply(this, [token.stack, context]);

                // Start a new logic chain
                chain = true;

                if (result) {
                    chain = false;
                    // parse if output
                    output = Twig.parse.apply(this, [token.output, context]);
                }
                return {
                    chain: chain,
                    output: output
                };
            }
        },
        {
            /**
             * Else if type logic tokens.
             *
             *  Format: {% elseif expression %}
             */
            type: Twig.logic.type.elseif,
            regex: /^elseif\s+([^\s].*)$/,
            next: [
                Twig.logic.type.else_,
                Twig.logic.type.elseif,
                Twig.logic.type.endif
            ],
            open: false,
            compile: function (token) {
                var expression = token.match[1];
                // Compile the expression.
                token.stack = Twig.expression.compile.apply(this, [{
                    type:  Twig.expression.type.expression,
                    value: expression
                }]).stack;
                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                var output = '';

                if (chain && Twig.expression.parse.apply(this, [token.stack, context]) === true) {
                    chain = false;
                    // parse if output
                    output = Twig.parse.apply(this, [token.output, context]);
                }

                return {
                    chain: chain,
                    output: output
                };
            }
        },
        {
            /**
             * Else if type logic tokens.
             *
             *  Format: {% elseif expression %}
             */
            type: Twig.logic.type.else_,
            regex: /^else$/,
            next: [
                Twig.logic.type.endif,
                Twig.logic.type.endfor
            ],
            open: false,
            parse: function (token, context, chain) {
                var output = '';
                if (chain) {
                    output = Twig.parse.apply(this, [token.output, context]);
                }
                return {
                    chain: chain,
                    output: output
                };
            }
        },
        {
            /**
             * End if type logic tokens.
             *
             *  Format: {% endif %}
             */
            type: Twig.logic.type.endif,
            regex: /^endif$/,
            next: [ ],
            open: false
        },
        {
            /**
             * For type logic tokens.
             *
             *  Format: {% for expression %}
             */
            type: Twig.logic.type.for_,
            regex: /^for\s+([a-zA-Z0-9_,\s]+)\s+in\s+([^\s].*?)(?:\s+if\s+([^\s].*))?$/,
            next: [
                Twig.logic.type.else_,
                Twig.logic.type.endfor
            ],
            open: true,
            compile: function (token) {
                var key_value = token.match[1],
                    expression = token.match[2],
                    conditional = token.match[3],
                    kv_split = null;

                token.key_var = null;
                token.value_var = null;

                if (key_value.indexOf(",") >= 0) {
                    kv_split = key_value.split(',');
                    if (kv_split.length === 2) {
                        token.key_var = kv_split[0].trim();
                        token.value_var = kv_split[1].trim();
                    } else {
                        throw new Twig.Error("Invalid expression in for loop: " + key_value);
                    }
                } else {
                    token.value_var = key_value;
                }

                // Valid expressions for a for loop
                //   for item     in expression
                //   for key,item in expression

                // Compile the expression.
                token.expression = Twig.expression.compile.apply(this, [{
                    type:  Twig.expression.type.expression,
                    value: expression
                }]).stack;

                // Compile the conditional (if available)
                if (conditional) {
                    token.conditional = Twig.expression.compile.apply(this, [{
                        type:  Twig.expression.type.expression,
                        value: conditional
                    }]).stack;
                }

                delete token.match;
                return token;
            },
            parse: function (token, context, continue_chain) {
                // Parse expression
                var result = Twig.expression.parse.apply(this, [token.expression, context]),
                    output = [],
					len,
					index = 0,
                    keyset,
                    that = this,
                    conditional = token.conditional,
                    buildLoop = function(index, len) {
                        var isConditional = conditional !== undefined;
                        return {
                            index: index+1,
                            index0: index,
                            revindex: isConditional?undefined:len-index,
                            revindex0: isConditional?undefined:len-index-1,
                            first: (index === 0),
                            last: isConditional?undefined:(index === len-1),
                            length: isConditional?undefined:len,
                            parent: context
                        };
                    },
                    loop = function(key, value) {
                        var inner_context = Twig.lib.copy(context);

                        inner_context[token.value_var] = value;
                        if (token.key_var) {
                            inner_context[token.key_var] = key;
                        }

                        // Loop object
                        inner_context.loop = buildLoop(index, len);

                        if (conditional === undefined ||
                            Twig.expression.parse.apply(that, [conditional, inner_context]))
                        {
                            output.push(Twig.parse.apply(that, [token.output, inner_context]));
                            index += 1;
                        }
                    };

                if (result instanceof Array) {
                    len = result.length;
                    Twig.forEach(result, function (value) {
                        var key = index;

                        loop(key, value);
                    });
                } else if (result instanceof Object) {
                    if (result._keys !== undefined) {
                        keyset = result._keys;
                    } else {
                        keyset = Object.keys(result);
                    }
					len = keyset.length;
                    Twig.forEach(keyset, function(key) {
                        // Ignore the _keys property, it's internal to twig.js
                        if (key === "_keys") return;

                        loop(key,  result[key]);
                    });
                }

                // Only allow else statements if no output was generated
                continue_chain = (output.length === 0);

                return {
                    chain: continue_chain,
                    output: output.join("")
                };
            }
        },
        {
            /**
             * End if type logic tokens.
             *
             *  Format: {% endif %}
             */
            type: Twig.logic.type.endfor,
            regex: /^endfor$/,
            next: [ ],
            open: false
        },
        {
            /**
             * Set type logic tokens.
             *
             *  Format: {% set key = expression %}
             */
            type: Twig.logic.type.set,
            regex: /^set\s+([a-zA-Z0-9_,\s]+)\s*=\s*(.+)$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var key = token.match[1].trim(),
                    expression = token.match[2],
                    // Compile the expression.
                    expression_stack  = Twig.expression.compile.apply(this, [{
                        type:  Twig.expression.type.expression,
                        value: expression
                    }]).stack;

                token.key = key;
                token.expression = expression_stack;

                delete token.match;
                return token;
            },
            parse: function (token, context, continue_chain) {
                var value = Twig.expression.parse.apply(this, [token.expression, context]),
                    key = token.key;

                // set on both the global and local context
                this.context[key] = value;
                context[key] = value;

                return {
                    chain: continue_chain,
                    context: context
                };
            }
        },
        {
            /**
             * Set capture type logic tokens.
             *
             *  Format: {% set key %}
             */
            type: Twig.logic.type.setcapture,
            regex: /^set\s+([a-zA-Z0-9_,\s]+)$/,
            next: [
                Twig.logic.type.endset
            ],
            open: true,
            compile: function (token) {
                var key = token.match[1].trim();

                token.key = key;

                delete token.match;
                return token;
            },
            parse: function (token, context, continue_chain) {

                var value = Twig.parse.apply(this, [token.output, context]),
                    key = token.key;

                // set on both the global and local context
                this.context[key] = value;
                context[key] = value;

                return {
                    chain: continue_chain,
                    context: context
                };
            }
        },
        {
            /**
             * End set type block logic tokens.
             *
             *  Format: {% endset %}
             */
            type: Twig.logic.type.endset,
            regex: /^endset$/,
            next: [ ],
            open: false
        },
        {
            /**
             * Filter logic tokens.
             *
             *  Format: {% filter upper %} or {% filter lower|escape %}
             */
            type: Twig.logic.type.filter,
            regex: /^filter\s+(.+)$/,
            next: [
                Twig.logic.type.endfilter
            ],
            open: true,
            compile: function (token) {
                var expression = "|" + token.match[1].trim();
                // Compile the expression.
                token.stack = Twig.expression.compile.apply(this, [{
                    type:  Twig.expression.type.expression,
                    value: expression
                }]).stack;
                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                var unfiltered = Twig.parse.apply(this, [token.output, context]),
                    stack = [{
                        type: Twig.expression.type.string,
                        value: unfiltered
                    }].concat(token.stack);

                var output = Twig.expression.parse.apply(this, [stack, context]);

                return {
                    chain: chain,
                    output: output
                };
            }
        },
        {
            /**
             * End filter logic tokens.
             *
             *  Format: {% endfilter %}
             */
            type: Twig.logic.type.endfilter,
            regex: /^endfilter$/,
            next: [ ],
            open: false
        },
        {
            /**
             * Block logic tokens.
             *
             *  Format: {% block title %}
             */
            type: Twig.logic.type.block,
            regex: /^block\s+([a-zA-Z0-9_]+)$/,
            next: [
                Twig.logic.type.endblock
            ],
            open: true,
            compile: function (token) {
                token.block = token.match[1].trim();
                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                var block_output = "",
                    output = "",
                    hasParent = this.blocks[token.block] && this.blocks[token.block].indexOf(Twig.placeholders.parent) > -1;

                // Don't override previous blocks
                if (this.blocks[token.block] === undefined || hasParent) {
                    block_output = Twig.expression.parse.apply(this, [{
                        type: Twig.expression.type.string,
                        value: Twig.parse.apply(this, [token.output, context])
                    }, context]);

                    if (hasParent) {
                        this.blocks[token.block] =  this.blocks[token.block].replace(Twig.placeholders.parent, block_output);
                    } else {
                        this.blocks[token.block] = block_output;
                    }
                }

                // Check if a child block has been set from a template extending this one.
                if (this.child.blocks[token.block]) {
                    output = this.child.blocks[token.block];

                } else {
                    output = this.blocks[token.block];
                }

                return {
                    chain: chain,
                    output: output
                };
            }
        },
        {
            /**
             * End block logic tokens.
             *
             *  Format: {% endblock %}
             */
            type: Twig.logic.type.endblock,
            regex: /^endblock(?:\s+([a-zA-Z0-9_]+))?$/,
            next: [ ],
            open: false
        },
        {
            /**
             * Block logic tokens.
             *
             *  Format: {% extends "template.twig" %}
             */
            type: Twig.logic.type.extends_,
            regex: /^extends\s+(.+)$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var expression = token.match[1].trim();
                delete token.match;

                token.stack   = Twig.expression.compile.apply(this, [{
                    type:  Twig.expression.type.expression,
                    value: expression
                }]).stack;

                return token;
            },
            parse: function (token, context, chain) {
                // Resolve filename
                var file = Twig.expression.parse.apply(this, [token.stack, context]);

                // Set parent template
                this.extend = file;

                return {
                    chain: chain,
                    output: ''
                };
            }
        },
        {
            /**
             * Block logic tokens.
             *
             *  Format: {% extends "template.twig" %}
             */
            type: Twig.logic.type.use,
            regex: /^use\s+(.+)$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var expression = token.match[1].trim();
                delete token.match;

                token.stack = Twig.expression.compile.apply(this, [{
                    type:  Twig.expression.type.expression,
                    value: expression
                }]).stack;

                return token;
            },
            parse: function (token, context, chain) {
                // Resolve filename
                var file = Twig.expression.parse.apply(this, [token.stack, context]);

                // Import blocks
                this.importBlocks(file);

                return {
                    chain: chain,
                    output: ''
                };
            }
        },
        {
            /**
             * Block logic tokens.
             *
             *  Format: {% includes "template.twig" [with {some: 'values'} only] %}
             */
            type: Twig.logic.type.include,
            regex: /^include\s+(ignore missing\s+)?(.+?)\s*(?:with\s+(.+?))?\s*(only)?$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var match = token.match,
                    includeMissing = match[1] !== undefined,
                    expression = match[2].trim(),
                    withContext = match[3],
                    only = ((match[4] !== undefined) && match[4].length);

                delete token.match;

                token.only = only;
                token.includeMissing = includeMissing;

                token.stack = Twig.expression.compile.apply(this, [{
                    type:  Twig.expression.type.expression,
                    value: expression
                }]).stack;

                if (withContext !== undefined) {
                    token.withStack = Twig.expression.compile.apply(this, [{
                        type:  Twig.expression.type.expression,
                        value: withContext.trim()
                    }]).stack;
                }

                return token;
            },
            parse: function (token, context, chain) {
                // Resolve filename
                var innerContext = {},
                    withContext,
                    i,
                    template;

                if (!token.only) {
                    for (i in context) {
                        if (context.hasOwnProperty(i))
                            innerContext[i] = context[i];
                    }
                }

                if (token.withStack !== undefined) {
                    withContext = Twig.expression.parse.apply(this, [token.withStack, context]);

                    for (i in withContext) {
                        if (withContext.hasOwnProperty(i))
                            innerContext[i] = withContext[i];
                    }
                }

                var file = Twig.expression.parse.apply(this, [token.stack, innerContext]);

                // Import file
                template = this.importFile(file);

                return {
                    chain: chain,
                    output: template.render(innerContext)
                };
            }
        },
        {
            type: Twig.logic.type.spaceless,
            regex: /^spaceless$/,
            next: [
                Twig.logic.type.endspaceless
            ],
            open: true,

            // Parse the html and return it without any spaces between tags
            parse: function (token, context, chain) {
                var // Parse the output without any filter
                    unfiltered = Twig.parse.apply(this, [token.output, context]),
                    // A regular expression to find closing and opening tags with spaces between them
                    rBetweenTagSpaces = />\s+</g,
                    // Replace all space between closing and opening html tags
                    output = unfiltered.replace(rBetweenTagSpaces,'><').trim();

                return {
                    chain: chain,
                    output: output
                };
            }
        },

        // Add the {% endspaceless %} token
        {
            type: Twig.logic.type.endspaceless,
            regex: /^endspaceless$/,
            next: [ ],
            open: false
        },
        {
            /**
             * Macro logic tokens.
             *
             * Format: {% maro input(name, value, type, size) %}
             *
             */ 
            type: Twig.logic.type.macro,
            regex: /^macro\s+([a-zA-Z0-9_]+)\s?\((([a-zA-Z0-9_]+(,\s?)?)*)\)$/,
            next: [
                Twig.logic.type.endmacro
            ],
            open: true,
            compile: function (token) {
                var macroName = token.match[1],
                    parameters = token.match[2].split(/[ ,]+/);

                //TODO: Clean up duplicate check
                for (var i=0; i<parameters.length; i++) {
                    for (var j=0; j<parameters.length; j++){
                        if (parameters[i] === parameters[j] && i !== j) {
                            throw new Twig.Error("Duplicate arguments for parameter: "+ parameters[i]);
                        }
                    }
                }

                token.macroName = macroName;
                token.parameters = parameters;

                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                var template = this;
                this.macros[token.macroName] = function() {
                    // Pass global context and other macros 
                    var macroContext = {
                        _self: template.macros
                    }
                    // Add parameters from context to macroContext
                    for (var i=0; i<token.parameters.length; i++) {
                        var prop = token.parameters[i];
                        macroContext[prop] = arguments[i] || undefined;
                    }
                    // Render
                    return Twig.parse.apply(template, [token.output, macroContext])
                };

                return {
                    chain: chain,
                    output: ''
                };

            }
            
        },
        {
            /**
             * End macro logic tokens.
             *
             * Format: {% endmacro %}
             */ 
             type: Twig.logic.type.endmacro,
             regex: /^endmacro$/,
             next: [ ],
             open: false
        },
        {
            /*
            * import logic tokens.
            *
            * Format: {% import "template.twig" as form %}
            */
            type: Twig.logic.type.import_,
            regex: /^import\s+(.+)\s+as\s+([a-zA-Z0-9_]+)$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var expression = token.match[1].trim(),
                    contextName = token.match[2].trim();
                delete token.match;

                token.expression = expression;
                token.contextName = contextName;

                token.stack = Twig.expression.compile.apply(this, [{
                    type: Twig.expression.type.expression,
                    value: expression
                }]).stack;

                return token;
            },
            parse: function (token, context, chain) {
                if (token.expression !== "_self") {
                    var file = Twig.expression.parse.apply(this, [token.stack, context]);
                    var template = this.importMacros(file || token.expression);
                    context[token.contextName] = template.render({}, {output: 'macros'});
                }
                else {
                    context[token.contextName] = this.macros;
                }

                return {
                    chain: chain,
                    output: ''
                }

            }
        },
        {
            /*
            * from logic tokens.
            *
            * Format: {% from "template.twig" import func as form %}
            */
            type: Twig.logic.type.from,
            regex: /^from\s+(.+)\s+import\s+([a-zA-Z0-9_, ]+)$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var expression = token.match[1].trim(),
                    macroExpressions = token.match[2].trim().split(/[ ,]+/),
                    macroNames = {};
                    

                for (var i=0; i<macroExpressions.length; i++) {
                    var res = macroExpressions[i];

                    // match function as variable
                    var macroMatch = res.match(/^([a-zA-Z0-9_]+)\s+(.+)\s+as\s+([a-zA-Z0-9_]+)$/);
                    if (macroMatch) {
                        macroNames[macroMatch[1].trim()] = macroMatch[2].trim();
                    }
                    else if (res.match(/^([a-zA-Z0-9_]+)$/)) {
                        macroNames[res] = res;
                    }
                    else {
                        // ignore import
                    }

                }

                delete token.match;

                token.expression = expression;
                token.macroNames = macroNames;

                token.stack = Twig.expression.compile.apply(this, [{
                    type: Twig.expression.type.expression,
                    value: expression
                }]).stack;

                return token;
            },
            parse: function (token, context, chain) {
                var macros;

                if (token.expression !== "_self") {
                    var file = Twig.expression.parse.apply(this, [token.stack, context]);
                    var template = this.importMacros(file || token.expression);
                    macros = template.render({}, {output: 'macros'});
                }
                else {
                    macros = this.macros;
                }

                for (var macroName in token.macroNames) {
                    if (macros.hasOwnProperty(macroName)) {
                        context[token.macroNames[macroName]] = macros[macroName];
                    }
                }

                return {
                    chain: chain,
                    output: ''
                }

            }
        }

    ];


    /**
     * Registry for logic handlers.
     */
    Twig.logic.handler = {};

    /**
     * Define a new token type, available at Twig.logic.type.{type}
     */
    Twig.logic.extendType = function (type, value) {
        value = value || ("Twig.logic.type" + type);
        Twig.logic.type[type] = value;
    };

    /**
     * Extend the logic parsing functionality with a new token definition.
     *
     * // Define a new tag
     * Twig.logic.extend({
     *     type: Twig.logic.type.{type},
     *     // The pattern to match for this token
     *     regex: ...,
     *     // What token types can follow this token, leave blank if any.
     *     next: [ ... ]
     *     // Create and return compiled version of the token
     *     compile: function(token) { ... }
     *     // Parse the compiled token with the context provided by the render call
     *     //   and whether this token chain is complete.
     *     parse: function(token, context, chain) { ... }
     * });
     *
     * @param {Object} definition The new logic expression.
     */
    Twig.logic.extend = function (definition) {

        if (!definition.type) {
            throw new Twig.Error("Unable to extend logic definition. No type provided for " + definition);
        }
        if (Twig.logic.type[definition.type]) {
            throw new Twig.Error("Unable to extend logic definitions. Type " +
                                 definition.type + " is already defined.");
        } else {
            Twig.logic.extendType(definition.type);
        }
        Twig.logic.handler[definition.type] = definition;
    };

    // Extend with built-in expressions
    while (Twig.logic.definitions.length > 0) {
        Twig.logic.extend(Twig.logic.definitions.shift());
    }

    /**
     * Compile a logic token into an object ready for parsing.
     *
     * @param {Object} raw_token An uncompiled logic token.
     *
     * @return {Object} A compiled logic token, ready for parsing.
     */
    Twig.logic.compile = function (raw_token) {
        var expression = raw_token.value.trim(),
            token = Twig.logic.tokenize.apply(this, [expression]),
            token_template = Twig.logic.handler[token.type];

        // Check if the token needs compiling
        if (token_template.compile) {
            token = token_template.compile.apply(this, [token]);
            Twig.log.trace("Twig.logic.compile: ", "Compiled logic token to ", token);
        }

        return token;
    };

    /**
     * Tokenize logic expressions. This function matches token expressions against regular
     * expressions provided in token definitions provided with Twig.logic.extend.
     *
     * @param {string} expression the logic token expression to tokenize
     *                (i.e. what's between {% and %})
     *
     * @return {Object} The matched token with type set to the token type and match to the regex match.
     */
    Twig.logic.tokenize = function (expression) {
        var token = {},
            token_template_type = null,
            token_type = null,
            token_regex = null,
            regex_array = null,
            regex = null,
            match = null;

        // Ignore whitespace around expressions.
        expression = expression.trim();

        for (token_template_type in Twig.logic.handler) {
            if (Twig.logic.handler.hasOwnProperty(token_template_type)) {
                // Get the type and regex for this template type
                token_type = Twig.logic.handler[token_template_type].type;
                token_regex = Twig.logic.handler[token_template_type].regex;

                // Handle multiple regular expressions per type.
                regex_array = [];
                if (token_regex instanceof Array) {
                    regex_array = token_regex;
                } else {
                    regex_array.push(token_regex);
                }

                // Check regular expressions in the order they were specified in the definition.
                while (regex_array.length > 0) {
                    regex = regex_array.shift();
                    match = regex.exec(expression.trim());
                    if (match !== null) {
                        token.type  = token_type;
                        token.match = match;
                        Twig.log.trace("Twig.logic.tokenize: ", "Matched a ", token_type, " regular expression of ", match);
                        return token;
                    }
                }
            }
        }

        // No regex matches
        throw new Twig.Error("Unable to parse '" + expression.trim() + "'");
    };

    /**
     * Parse a logic token within a given context.
     *
     * What are logic chains?
     *      Logic chains represent a series of tokens that are connected,
     *          for example:
     *          {% if ... %} {% else %} {% endif %}
     *
     *      The chain parameter is used to signify if a chain is open of closed.
     *      open:
     *          More tokens in this chain should be parsed.
     *      closed:
     *          This token chain has completed parsing and any additional
     *          tokens (else, elseif, etc...) should be ignored.
     *
     * @param {Object} token The compiled token.
     * @param {Object} context The render context.
     * @param {boolean} chain Is this an open logic chain. If false, that means a
     *                        chain is closed and no further cases should be parsed.
     */
    Twig.logic.parse = function (token, context, chain) {
        var output = '',
            token_template;

        context = context || { };

        Twig.log.debug("Twig.logic.parse: ", "Parsing logic token ", token);

        token_template = Twig.logic.handler[token.type];

        if (token_template.parse) {
            output = token_template.parse.apply(this, [token, context, chain]);
        }
        return output;
    };

    return Twig;

})(Twig || { });
//     Twig.js
//     Copyright (c) 2011-2013 John Roepke
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.expression.js
//
// This file handles tokenizing, compiling and parsing expressions.
var Twig = (function (Twig) {
    "use strict";

    /**
     * Namespace for expression handling.
     */
    Twig.expression = { };

    /**
     * Reserved word that can't be used as variable names.
     */
    Twig.expression.reservedWords = [
        "true", "false", "null", "_context"
    ];

    /**
     * The type of tokens used in expressions.
     */
    Twig.expression.type = {
        comma:      'Twig.expression.type.comma',
        operator: {
            unary:  'Twig.expression.type.operator.unary',
            binary: 'Twig.expression.type.operator.binary'
        },
        string:     'Twig.expression.type.string',
        bool:       'Twig.expression.type.bool',
        array: {
            start:  'Twig.expression.type.array.start',
            end:    'Twig.expression.type.array.end'
        },
        object: {
            start:  'Twig.expression.type.object.start',
            end:    'Twig.expression.type.object.end'
        },
        parameter: {
            start:  'Twig.expression.type.parameter.start',
            end:    'Twig.expression.type.parameter.end'
        },
        key: {
            period:   'Twig.expression.type.key.period',
            brackets: 'Twig.expression.type.key.brackets'
        },
        filter:     'Twig.expression.type.filter',
        _function:  'Twig.expression.type._function',
        variable:   'Twig.expression.type.variable',
        number:     'Twig.expression.type.number',
        _null:     'Twig.expression.type.null',
        context:    'Twig.expression.type.context',
        test:       'Twig.expression.type.test'
    };

    Twig.expression.set = {
        // What can follow an expression (in general)
        operations: [
            Twig.expression.type.filter,
            Twig.expression.type.operator.unary,
            Twig.expression.type.operator.binary,
            Twig.expression.type.array.end,
            Twig.expression.type.object.end,
            Twig.expression.type.parameter.end,
            Twig.expression.type.comma,
            Twig.expression.type.test
        ],
        expressions: [
            Twig.expression.type._function,
            Twig.expression.type.bool,
            Twig.expression.type.string,
            Twig.expression.type.variable,
            Twig.expression.type.number,
            Twig.expression.type._null,
            Twig.expression.type.context,
            Twig.expression.type.parameter.start,
            Twig.expression.type.array.start,
            Twig.expression.type.object.start
        ]
    };

    // Most expressions allow a '.' or '[' after them, so we provide a convenience set
    Twig.expression.set.operations_extended = Twig.expression.set.operations.concat([
                    Twig.expression.type.key.period,
                    Twig.expression.type.key.brackets]);

    // Some commonly used compile and parse functions.
    Twig.expression.fn = {
        compile: {
            push: function(token, stack, output) {
                output.push(token);
            },
            push_both: function(token, stack, output) {
                output.push(token);
                stack.push(token);
            }
        },
        parse: {
            push: function(token, stack, context) {
                stack.push(token);
            },
            push_value: function(token, stack, context) {
                stack.push(token.value);
            }
        }
    };

    // The regular expressions and compile/parse logic used to match tokens in expressions.
    //
    // Properties:
    //
    //      type:  The type of expression this matches
    //
    //      regex: One or more regular expressions that matche the format of the token.
    //
    //      next:  Valid tokens that can occur next in the expression.
    //
    // Functions:
    //
    //      compile: A function that compiles the raw regular expression match into a token.
    //
    //      parse:   A function that parses the compiled token into output.
    //
    Twig.expression.definitions = [
        {
            type: Twig.expression.type.test,
            regex: /^is\s+(not)?\s*([a-zA-Z_][a-zA-Z0-9_]*)/,
            next: Twig.expression.set.operations.concat([Twig.expression.type.parameter.start]),
            compile: function(token, stack, output) {
                token.filter   = token.match[2];
                token.modifier = token.match[1];
                delete token.match;
                delete token.value;
                output.push(token);
            },
            parse: function(token, stack, context) {
                var value = stack.pop(),
                    params = token.params && Twig.expression.parse.apply(this, [token.params, context]),
                    result = Twig.test(token.filter, value, params);

                if (token.modifier == 'not') {
                    stack.push(!result);
                } else {
                    stack.push(result);
                }
            }
        },
        {
            type: Twig.expression.type.comma,
            // Match a comma
            regex: /^,/,
            next: Twig.expression.set.expressions.concat([Twig.expression.type.array.end, Twig.expression.type.object.end]),
            compile: function(token, stack, output) {
                var i = stack.length - 1,
                    stack_token;

                delete token.match;
                delete token.value;

                // pop tokens off the stack until the start of the object
                for(;i >= 0; i--) {
                    stack_token = stack.pop();
                    if (stack_token.type === Twig.expression.type.object.start
                            || stack_token.type === Twig.expression.type.parameter.start
                            || stack_token.type === Twig.expression.type.array.start) {
                        stack.push(stack_token);
                        break;
                    }
                    output.push(stack_token);
                }
                output.push(token);
            }
        },
        {
            type: Twig.expression.type.operator.binary,
            // Match any of +, *, /, -, %, ~, <, <=, >, >=, !=, ==, **, ?, :, and, or, not
            regex: /(^[\+\-~%\?\:]|^[!=]==?|^[!<>]=?|^\*\*?|^\/\/?|^and\s+|^or\s+|^in\s+|^not in\s+|^\.\.)/,
            next: Twig.expression.set.expressions.concat([Twig.expression.type.operator.unary]),
            compile: function(token, stack, output) {
                delete token.match;

                token.value = token.value.trim();
                var value = token.value,
                    operator = Twig.expression.operator.lookup(value, token);

                Twig.log.trace("Twig.expression.compile: ", "Operator: ", operator, " from ", value);

                while (stack.length > 0 &&
                       (stack[stack.length-1].type == Twig.expression.type.operator.unary || stack[stack.length-1].type == Twig.expression.type.operator.binary) &&
                            (
                                (operator.associativity === Twig.expression.operator.leftToRight &&
                                 operator.precidence    >= stack[stack.length-1].precidence) ||

                                (operator.associativity === Twig.expression.operator.rightToLeft &&
                                 operator.precidence    >  stack[stack.length-1].precidence)
                            )
                       ) {
                     var temp = stack.pop();
                     output.push(temp);
                }

                if (value === ":") {
                    // Check if this is a ternary or object key being set
                    if (stack[stack.length - 1] && stack[stack.length-1].value === "?") {
                        // Continue as normal for a ternary
                    } else {
                        // This is not a ternary so we push the token to the output where it can be handled
                        //   when the assocated object is closed.
                        var key_token = output.pop();

                        if (key_token.type === Twig.expression.type.string ||
                                key_token.type === Twig.expression.type.variable ||
                                key_token.type === Twig.expression.type.number) {
                            token.key = key_token.value;

                        } else {
                            throw new Twig.Error("Unexpected value before ':' of " + key_token.type + " = " + key_token.value);
                        }

                        output.push(token);
                        return;
                    }
                } else {
                    stack.push(operator);
                }
            },
            parse: function(token, stack, context) {
                if (token.key) {
                    // handle ternary ':' operator
                    stack.push(token);
                } else {
                    Twig.expression.operator.parse(token.value, stack);
                }
            }
        },
        {
            type: Twig.expression.type.operator.unary,
            // Match any of not
            regex: /(^not\s+)/,
            next: Twig.expression.set.expressions,
            compile: function(token, stack, output) {
                delete token.match;

                token.value = token.value.trim();
                var value = token.value,
                    operator = Twig.expression.operator.lookup(value, token);

                Twig.log.trace("Twig.expression.compile: ", "Operator: ", operator, " from ", value);

                while (stack.length > 0 &&
                       (stack[stack.length-1].type == Twig.expression.type.operator.unary || stack[stack.length-1].type == Twig.expression.type.operator.binary) &&
                            (
                                (operator.associativity === Twig.expression.operator.leftToRight &&
                                 operator.precidence    >= stack[stack.length-1].precidence) ||

                                (operator.associativity === Twig.expression.operator.rightToLeft &&
                                 operator.precidence    >  stack[stack.length-1].precidence)
                            )
                       ) {
                     var temp = stack.pop();
                     output.push(temp);
                }

                stack.push(operator);
            },
            parse: function(token, stack, context) {
                Twig.expression.operator.parse(token.value, stack);
            }
        },
        {
            /**
             * Match a string. This is anything between a pair of single or double quotes.
             */
            type: Twig.expression.type.string,
            // See: http://blog.stevenlevithan.com/archives/match-quoted-string
            regex: /^(["'])(?:(?=(\\?))\2.)*?\1/,
            next: Twig.expression.set.operations,
            compile: function(token, stack, output) {
                var value = token.value;
                delete token.match

                // Remove the quotes from the string
                if (value.substring(0, 1) === '"') {
                    value = value.replace('\\"', '"');
                } else {
                    value = value.replace("\\'", "'");
                }
                token.value = value.substring(1, value.length-1).replace( /\\n/g, "\n" ).replace( /\\r/g, "\r" );
                Twig.log.trace("Twig.expression.compile: ", "String value: ", token.value);
                output.push(token);
            },
            parse: Twig.expression.fn.parse.push_value
        },
        {
            /**
             * Match a parameter set start.
             */
            type: Twig.expression.type.parameter.start,
            regex: /^\(/,
            next: Twig.expression.set.expressions.concat([Twig.expression.type.parameter.end]),
            compile: Twig.expression.fn.compile.push_both,
            parse: Twig.expression.fn.parse.push
        },
        {
            /**
             * Match a parameter set end.
             */
            type: Twig.expression.type.parameter.end,
            regex: /^\)/,
            next: Twig.expression.set.operations_extended,
            compile: function(token, stack, output) {
                var stack_token,
                    end_token = token;

                stack_token = stack.pop();
                while(stack.length > 0 && stack_token.type != Twig.expression.type.parameter.start) {
                    output.push(stack_token);
                    stack_token = stack.pop();
                }

                // Move contents of parens into preceding filter
                var param_stack = [];
                while(token.type !== Twig.expression.type.parameter.start) {
                    // Add token to arguments stack
                    param_stack.unshift(token);
                    token = output.pop();
                }
                param_stack.unshift(token);

                var is_expression = false;

                // Get the token preceding the parameters
                token = output[output.length-1];

                if (token === undefined ||
                    (token.type !== Twig.expression.type._function &&
                    token.type !== Twig.expression.type.filter &&
                    token.type !== Twig.expression.type.test &&
                    token.type !== Twig.expression.type.key.brackets &&
                    token.type !== Twig.expression.type.key.period)) {

                    end_token.expression = true;

                    // remove start and end token from stack
                    param_stack.pop();
                    param_stack.shift();

                    end_token.params = param_stack;

                    output.push(end_token);

                } else {
                    end_token.expression = false;
                    token.params = param_stack;
                }
            },
            parse: function(token, stack, context) {
                var new_array = [],
                    array_ended = false,
                    value = null;

                if (token.expression) {
                    value = Twig.expression.parse.apply(this, [token.params, context])
                    stack.push(value);

                } else {

                    while (stack.length > 0) {
                        value = stack.pop();
                        // Push values into the array until the start of the array
                        if (value && value.type && value.type == Twig.expression.type.parameter.start) {
                            array_ended = true;
                            break;
                        }
                        new_array.unshift(value);
                    }

                    if (!array_ended) {
                        throw new Twig.Error("Expected end of parameter set.");
                    }

                    stack.push(new_array);
                }
            }
        },
        {
            /**
             * Match an array start.
             */
            type: Twig.expression.type.array.start,
            regex: /^\[/,
            next: Twig.expression.set.expressions.concat([Twig.expression.type.array.end]),
            compile: Twig.expression.fn.compile.push_both,
            parse: Twig.expression.fn.parse.push
        },
        {
            /**
             * Match an array end.
             */
            type: Twig.expression.type.array.end,
            regex: /^\]/,
            next: Twig.expression.set.operations_extended,
            compile: function(token, stack, output) {
                var i = stack.length - 1,
                    stack_token;
                // pop tokens off the stack until the start of the object
                for(;i >= 0; i--) {
                    stack_token = stack.pop();
                    if (stack_token.type === Twig.expression.type.array.start) {
                        break;
                    }
                    output.push(stack_token);
                }
                output.push(token);
            },
            parse: function(token, stack, context) {
                var new_array = [],
                    array_ended = false,
                    value = null;

                while (stack.length > 0) {
                    value = stack.pop();
                    // Push values into the array until the start of the array
                    if (value.type && value.type == Twig.expression.type.array.start) {
                        array_ended = true;
                        break;
                    }
                    new_array.unshift(value);
                }
                if (!array_ended) {
                    throw new Twig.Error("Expected end of array.");
                }

                stack.push(new_array);
            }
        },
        // Token that represents the start of a hash map '}'
        //
        // Hash maps take the form:
        //    { "key": 'value', "another_key": item }
        //
        // Keys must be quoted (either single or double) and values can be any expression.
        {
            type: Twig.expression.type.object.start,
            regex: /^\{/,
            next: Twig.expression.set.expressions.concat([Twig.expression.type.object.end]),
            compile: Twig.expression.fn.compile.push_both,
            parse: Twig.expression.fn.parse.push
        },

        // Token that represents the end of a Hash Map '}'
        //
        // This is where the logic for building the internal
        // representation of a hash map is defined.
        {
            type: Twig.expression.type.object.end,
            regex: /^\}/,
            next: Twig.expression.set.operations_extended,
            compile: function(token, stack, output) {
                var i = stack.length-1,
                    stack_token;

                // pop tokens off the stack until the start of the object
                for(;i >= 0; i--) {
                    stack_token = stack.pop();
                    if (stack_token && stack_token.type === Twig.expression.type.object.start) {
                        break;
                    }
                    output.push(stack_token);
                }
                output.push(token);
            },
            parse: function(end_token, stack, context) {
                var new_object = {},
                    object_ended = false,
                    token = null,
                    token_key = null,
                    has_value = false,
                    value = null;

                while (stack.length > 0) {
                    token = stack.pop();
                    // Push values into the array until the start of the object
                    if (token && token.type && token.type === Twig.expression.type.object.start) {
                        object_ended = true;
                        break;
                    }
                    if (token && token.type && (token.type === Twig.expression.type.operator.binary || token.type === Twig.expression.type.operator.unary) && token.key) {
                        if (!has_value) {
                            throw new Twig.Error("Missing value for key '" + token.key + "' in object definition.");
                        }
                        new_object[token.key] = value;

                        // Preserve the order that elements are added to the map
                        // This is necessary since JavaScript objects don't
                        // guarantee the order of keys
                        if (new_object._keys === undefined) new_object._keys = [];
                        new_object._keys.unshift(token.key);

                        // reset value check
                        value = null;
                        has_value = false;

                    } else {
                        has_value = true;
                        value = token;
                    }
                }
                if (!object_ended) {
                    throw new Twig.Error("Unexpected end of object.");
                }

                stack.push(new_object);
            }
        },

        // Token representing a filter
        //
        // Filters can follow any expression and take the form:
        //    expression|filter(optional, args)
        //
        // Filter parsing is done in the Twig.filters namespace.
        {
            type: Twig.expression.type.filter,
            // match a | then a letter or _, then any number of letters, numbers, _ or -
            regex: /^\|\s?([a-zA-Z_][a-zA-Z0-9_\-]*)/,
            next: Twig.expression.set.operations_extended.concat([
                    Twig.expression.type.parameter.start]),
            compile: function(token, stack, output) {
                token.value = token.match[1];
                output.push(token);
            },
            parse: function(token, stack, context) {
                var input = stack.pop(),
                    params = token.params && Twig.expression.parse.apply(this, [token.params, context]);

                stack.push(Twig.filter.apply(this, [token.value, input, params]));
            }
        },
        {
            type: Twig.expression.type._function,
            // match any letter or _, then any number of letters, numbers, _ or - followed by (
            regex: /^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/,
            next: Twig.expression.type.parameter.start,
            transform: function(match, tokens) {
                return '(';
            },
            compile: function(token, stack, output) {
                var fn = token.match[1];
                token.fn = fn;
                // cleanup token
                delete token.match;
                delete token.value;

                output.push(token);
            },
            parse: function(token, stack, context) {
                var params = token.params && Twig.expression.parse.apply(this, [token.params, context]),
                    fn     = token.fn,
                    value;

                if (Twig.functions[fn]) {
                    // Get the function from the built-in functions
                    value = Twig.functions[fn].apply(this, params);

                } else if (typeof context[fn] == 'function') {
                    // Get the function from the user/context defined functions
                    value = context[fn].apply(context, params);

                } else {
                    throw new Twig.Error(fn + ' function does not exist and is not defined in the context');
                }

                stack.push(value);
            }
        },

        // Token representing a variable.
        //
        // Variables can contain letters, numbers, underscores and
        // dashes, but must start with a letter or underscore.
        //
        // Variables are retrieved from the render context and take
        // the value of 'undefined' if the given variable doesn't
        // exist in the context.
        {
            type: Twig.expression.type.variable,
            // match any letter or _, then any number of letters, numbers, _ or -
            regex: /^[a-zA-Z_][a-zA-Z0-9_]*/,
            next: Twig.expression.set.operations_extended.concat([
                    Twig.expression.type.parameter.start]),
            compile: Twig.expression.fn.compile.push,
            validate: function(match, tokens) {
                return (Twig.indexOf(Twig.expression.reservedWords, match[0]) < 0);
            },
            parse: function(token, stack, context) {
                // Get the variable from the context
                var value = Twig.expression.resolve(context[token.value], context);
                stack.push(value);
            }
        },
        {
            type: Twig.expression.type.key.period,
            regex: /^\.([a-zA-Z0-9_]+)/,
            next: Twig.expression.set.operations_extended.concat([
                    Twig.expression.type.parameter.start]),
            compile: function(token, stack, output) {
                token.key = token.match[1];
                delete token.match;
                delete token.value;

                output.push(token);
            },
            parse: function(token, stack, context) {
                var params = token.params && Twig.expression.parse.apply(this, [token.params, context]),
                    key = token.key,
                    object = stack.pop(),
                    value;

                if (object === null || object === undefined) {
                    if (this.options.strict_variables) {
                        throw new Twig.Error("Can't access a key " + key + " on an null or undefined object.");
                    } else {
                        return null;
                    }
                }

                var capitalize = function(value) {return value.substr(0, 1).toUpperCase() + value.substr(1);};

                // Get the variable from the context
                if (typeof object === 'object' && key in object) {
                    value = object[key];
                } else if (object["get"+capitalize(key)] !== undefined) {
                    value = object["get"+capitalize(key)];
                } else if (object["is"+capitalize(key)] !== undefined) {
                    value = object["is"+capitalize(key)];
                } else {
                    value = null;
                }
                stack.push(Twig.expression.resolve(value, object, params));
            }
        },
        {
            type: Twig.expression.type.key.brackets,
            regex: /^\[([^\]]*)\]/,
            next: Twig.expression.set.operations_extended.concat([
                    Twig.expression.type.parameter.start]),
            compile: function(token, stack, output) {
                var match = token.match[1];
                delete token.value;
                delete token.match;

                // The expression stack for the key
                token.stack = Twig.expression.compile({
                    value: match
                }).stack;

                output.push(token);
            },
            parse: function(token, stack, context) {
                // Evaluate key
                var params = token.params && Twig.expression.parse.apply(this, [token.params, context]),
                    key = Twig.expression.parse.apply(this, [token.stack, context]),
                    object = stack.pop(),
                    value;

                if (object === null || object === undefined) {
                    if (this.options.strict_variables) {
                        throw new Twig.Error("Can't access a key " + key + " on an null or undefined object.");
                    } else {
                        return null;
                    }
                }

                // Get the variable from the context
                if (typeof object === 'object' && key in object) {
                    value = object[key];
                } else {
                    value = null;
                }
                stack.push(Twig.expression.resolve(value, object, params));
            }
        },
        {
            /**
             * Match a null value.
             */
            type: Twig.expression.type._null,
            // match a number
            regex: /^null/,
            next: Twig.expression.set.operations,
            compile: function(token, stack, output) {
                delete token.match;
                token.value = null;
                output.push(token);
            },
            parse: Twig.expression.fn.parse.push_value
        },
        {
            /**
             * Match the context
             */
            type: Twig.expression.type.context,
            regex: /^_context/,
            next: Twig.expression.set.operations_extended.concat([
                    Twig.expression.type.parameter.start]),
            compile: Twig.expression.fn.compile.push,
            parse: function(token, stack, context) {
                stack.push(context);
            }
        },
        {
            /**
             * Match a number (integer or decimal)
             */
            type: Twig.expression.type.number,
            // match a number
            regex: /^\-?\d+(\.\d+)?/,
            next: Twig.expression.set.operations,
            compile: function(token, stack, output) {
                token.value = Number(token.value);
                output.push(token);
            },
            parse: Twig.expression.fn.parse.push_value
        },
        {
            /**
             * Match a boolean
             */
            type: Twig.expression.type.bool,
            regex: /^(true|false)/,
            next: Twig.expression.set.operations,
            compile: function(token, stack, output) {
                token.value = (token.match[0] == "true");
                delete token.match;
                output.push(token);
            },
            parse: Twig.expression.fn.parse.push_value
        }
    ];

    /**
     * Resolve a context value.
     *
     * If the value is a function, it is executed with a context parameter.
     *
     * @param {string} key The context object key.
     * @param {Object} context The render context.
     */
    Twig.expression.resolve = function(value, context, params) {
        if (typeof value == 'function') {
            return value.apply(context, params || []);
        } else {
            return value;
        }
    };

    /**
     * Registry for logic handlers.
     */
    Twig.expression.handler = {};

    /**
     * Define a new expression type, available at Twig.logic.type.{type}
     *
     * @param {string} type The name of the new type.
     */
    Twig.expression.extendType = function (type) {
        Twig.expression.type[type] = "Twig.expression.type." + type;
    };

    /**
     * Extend the expression parsing functionality with a new definition.
     *
     * Token definitions follow this format:
     *  {
     *      type:     One of Twig.expression.type.[type], either pre-defined or added using
     *                    Twig.expression.extendType
     *
     *      next:     Array of types from Twig.expression.type that can follow this token,
     *
     *      regex:    A regex or array of regex's that should match the token.
     *
     *      compile: function(token, stack, output) called when this token is being compiled.
     *                   Should return an object with stack and output set.
     *
     *      parse:   function(token, stack, context) called when this token is being parsed.
     *                   Should return an object with stack and context set.
     *  }
     *
     * @param {Object} definition A token definition.
     */
    Twig.expression.extend = function (definition) {
        if (!definition.type) {
            throw new Twig.Error("Unable to extend logic definition. No type provided for " + definition);
        }
        Twig.expression.handler[definition.type] = definition;
    };

    // Extend with built-in expressions
    while (Twig.expression.definitions.length > 0) {
        Twig.expression.extend(Twig.expression.definitions.shift());
    }

    /**
     * Break an expression into tokens defined in Twig.expression.definitions.
     *
     * @param {string} expression The string to tokenize.
     *
     * @return {Array} An array of tokens.
     */
    Twig.expression.tokenize = function (expression) {
        var tokens = [],
            // Keep an offset of the location in the expression for error messages.
            exp_offset = 0,
            // The valid next tokens of the previous token
            next = null,
            // Match information
            type, regex, regex_array,
            // The possible next token for the match
            token_next,
            // Has a match been found from the definitions
            match_found, invalid_matches = [], match_function;

        match_function = function () {
            var match = Array.prototype.slice.apply(arguments),
                string = match.pop(),
                offset = match.pop();

            Twig.log.trace("Twig.expression.tokenize",
                           "Matched a ", type, " regular expression of ", match);

            if (next && Twig.indexOf(next, type) < 0) {
                invalid_matches.push(
                    type + " cannot follow a " + tokens[tokens.length - 1].type +
                           " at template:" + exp_offset + " near '" + match[0].substring(0, 20) +
                           "...'"
                );
                // Not a match, don't change the expression
                return match[0];
            }

            // Validate the token if a validation function is provided
            if (Twig.expression.handler[type].validate &&
                    !Twig.expression.handler[type].validate(match, tokens)) {
                return match[0];
            }

            invalid_matches = [];

            tokens.push({
                type:  type,
                value: match[0],
                match: match
            });

            match_found = true;
            next = token_next;
            exp_offset += match[0].length;

            // Does the token need to return output back to the expression string
            // e.g. a function match of cycle( might return the '(' back to the expression
            // This allows look-ahead to differentiate between token types (e.g. functions and variable names)
            if (Twig.expression.handler[type].transform) {
                return Twig.expression.handler[type].transform(match, tokens);
            }
            return '';
        };

        Twig.log.debug("Twig.expression.tokenize", "Tokenizing expression ", expression);

        while (expression.length > 0) {
            expression = expression.trim();
            for (type in Twig.expression.handler) {
                if (Twig.expression.handler.hasOwnProperty(type)) {
                    token_next = Twig.expression.handler[type].next;
                    regex = Twig.expression.handler[type].regex;
                    // Twig.log.trace("Checking type ", type, " on ", expression);
                    if (regex instanceof Array) {
                        regex_array = regex;
                    } else {
                        regex_array = [regex];
                    }

                    match_found = false;
                    while (regex_array.length > 0) {
                        regex = regex_array.pop();
                        expression = expression.replace(regex, match_function);
                    }
                    // An expression token has been matched. Break the for loop and start trying to
                    //  match the next template (if expression isn't empty.)
                    if (match_found) {
                        break;
                    }
                }
            }
            if (!match_found) {
                if (invalid_matches.length > 0) {
                    throw new Twig.Error(invalid_matches.join(" OR "));
                } else {
                    throw new Twig.Error("Unable to parse '" + expression + "' at template position" + exp_offset);
                }
            }
        }

        Twig.log.trace("Twig.expression.tokenize", "Tokenized to ", tokens);
        return tokens;
    };

    /**
     * Compile an expression token.
     *
     * @param {Object} raw_token The uncompiled token.
     *
     * @return {Object} The compiled token.
     */
    Twig.expression.compile = function (raw_token) {
        var expression = raw_token.value,
            // Tokenize expression
            tokens = Twig.expression.tokenize(expression),
            token = null,
            output = [],
            stack = [],
            token_template = null;

        Twig.log.trace("Twig.expression.compile: ", "Compiling ", expression);

        // Push tokens into RPN stack using the Sunting-yard algorithm
        // See http://en.wikipedia.org/wiki/Shunting_yard_algorithm

        while (tokens.length > 0) {
            token = tokens.shift();
            token_template = Twig.expression.handler[token.type];

            Twig.log.trace("Twig.expression.compile: ", "Compiling ", token);

            // Compile the template
            token_template.compile && token_template.compile(token, stack, output);

            Twig.log.trace("Twig.expression.compile: ", "Stack is", stack);
            Twig.log.trace("Twig.expression.compile: ", "Output is", output);
        }

        while(stack.length > 0) {
            output.push(stack.pop());
        }

        Twig.log.trace("Twig.expression.compile: ", "Final output is", output);

        raw_token.stack = output;
        delete raw_token.value;

        return raw_token;
    };


    /**
     * Parse an RPN expression stack within a context.
     *
     * @param {Array} tokens An array of compiled expression tokens.
     * @param {Object} context The render context to parse the tokens with.
     *
     * @return {Object} The result of parsing all the tokens. The result
     *                  can be anything, String, Array, Object, etc... based on
     *                  the given expression.
     */
    Twig.expression.parse = function (tokens, context) {
        var that = this;

        // If the token isn't an array, make it one.
        if (!(tokens instanceof Array)) {
            tokens = [tokens];
        }

        // The output stack
        var stack = [],
            token_template = null;

        Twig.forEach(tokens, function (token) {
            token_template = Twig.expression.handler[token.type];

            token_template.parse && token_template.parse.apply(that, [token, stack, context]);
        });

        // Pop the final value off the stack
        return stack.pop();
    };

    return Twig;

})( Twig || { } );
//     Twig.js
//     Copyright (c) 2011-2013 John Roepke
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.expression.operator.js
//
// This file handles operator lookups and parsing.
var Twig = (function (Twig) {
    "use strict";

    /**
     * Operator associativity constants.
     */
    Twig.expression.operator = {
        leftToRight: 'leftToRight',
        rightToLeft: 'rightToLeft'
    };

    var containment = function(a, b) {
        if (b.indexOf !== undefined) {
            // String
            return a === b || a !== '' && b.indexOf(a) > -1;

        } else {
            var el;
            for (el in b) {
                if (b.hasOwnProperty(el) && b[el] === a) {
                    return true;
                }
            }
            return false;
        }
    };

    /**
     * Get the precidence and associativity of an operator. These follow the order that C/C++ use.
     * See http://en.wikipedia.org/wiki/Operators_in_C_and_C++ for the table of values.
     */
    Twig.expression.operator.lookup = function (operator, token) {
        switch (operator) {
            case "..":
            case 'not in':
            case 'in':
                token.precidence = 20;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case ',':
                token.precidence = 18;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            // Ternary
            case '?':
            case ':':
                token.precidence = 16;
                token.associativity = Twig.expression.operator.rightToLeft;
                break;

            case 'or':
                token.precidence = 14;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case 'and':
                token.precidence = 13;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case '==':
            case '!=':
                token.precidence = 9;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case '<':
            case '<=':
            case '>':
            case '>=':
                token.precidence = 8;
                token.associativity = Twig.expression.operator.leftToRight;
                break;


            case '~': // String concatination
            case '+':
            case '-':
                token.precidence = 6;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case '//':
            case '**':
            case '*':
            case '/':
            case '%':
                token.precidence = 5;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case 'not':
                token.precidence = 3;
                token.associativity = Twig.expression.operator.rightToLeft;
                break;

            default:
                throw new Twig.Error(operator + " is an unknown operator.");
        }
        token.operator = operator;
        return token;
    };

    /**
     * Handle operations on the RPN stack.
     *
     * Returns the updated stack.
     */
    Twig.expression.operator.parse = function (operator, stack) {
        Twig.log.trace("Twig.expression.operator.parse: ", "Handling ", operator);
        var a, b, c;
        switch (operator) {
            case ':':
                // Ignore
                break;

            case '?':
                c = stack.pop(); // false expr
                b = stack.pop(); // true expr
                a = stack.pop(); // conditional
                if (a) {
                    stack.push(b);
                } else {
                    stack.push(c);
                }
                break;

            case '+':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(a + b);
                break;

            case '-':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(a - b);
                break;

            case '*':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(a * b);
                break;

            case '/':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(a / b);
                break;

            case '//':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(parseInt(a / b));
                break;

            case '%':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(a % b);
                break;

            case '~':
                b = stack.pop();
                a = stack.pop();
                stack.push( (a !== undefined ? a.toString() : "")
                          + (b !== undefined ? b.toString() : "") );
                break;

            case 'not':
            case '!':
                stack.push(!stack.pop());
                break;

            case '<':
                b = stack.pop();
                a = stack.pop();
                stack.push(a < b);
                break;

            case '<=':
                b = stack.pop();
                a = stack.pop();
                stack.push(a <= b);
                break;

            case '>':
                b = stack.pop();
                a = stack.pop();
                stack.push(a > b);
                break;

            case '>=':
                b = stack.pop();
                a = stack.pop();
                stack.push(a >= b);
                break;

            case '===':
                b = stack.pop();
                a = stack.pop();
                stack.push(a === b);
                break;

            case '==':
                b = stack.pop();
                a = stack.pop();
                stack.push(a == b);
                break;

            case '!==':
                b = stack.pop();
                a = stack.pop();
                stack.push(a !== b);
                break;

            case '!=':
                b = stack.pop();
                a = stack.pop();
                stack.push(a != b);
                break;

            case 'or':
                b = stack.pop();
                a = stack.pop();
                stack.push(a || b);
                break;

            case 'and':
                b = stack.pop();
                a = stack.pop();
                stack.push(a && b);
                break;

            case '**':
                b = stack.pop();
                a = stack.pop();
                stack.push(Math.pow(a, b));
                break;


            case 'not in':
                b = stack.pop();
                a = stack.pop();
                stack.push( !containment(a, b) );
                break;

            case 'in':
                b = stack.pop();
                a = stack.pop();
                stack.push( containment(a, b) );
                break;

            case '..':
                b = stack.pop();
                a = stack.pop();
                stack.push( Twig.functions.range(a, b) );
                break;

            default:
                throw new Twig.Error(operator + " is an unknown operator.");
        }
    };

    return Twig;

})( Twig || { } );
//     Twig.js
//     Copyright (c) 2011-2013 John Roepke
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.filters.js
//
// This file handles parsing filters.
var Twig = (function (Twig) {

    // Determine object type
    function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }

    Twig.filters = {
        // String Filters
        upper:  function(value) {
            if ( typeof value !== "string" ) {
               return value;
            }

            return value.toUpperCase();
        },
        lower: function(value) {
            if ( typeof value !== "string" ) {
               return value;
            }

            return value.toLowerCase();
        },
        capitalize: function(value) {
            if ( typeof value !== "string" ) {
                 return value;
            }

            return value.substr(0, 1).toUpperCase() + value.substr(1);
        },
        title: function(value) {
            if ( typeof value !== "string" ) {
               return value;
            }

            return value.replace( /(^|\s)([a-z])/g , function(m, p1, p2){
                return p1 + p2.toUpperCase();
            });
        },
        length: function(value) {
            if (value instanceof Array || typeof value === "string") {
                return value.length;
            } else if (value instanceof Object) {
                if (value._keys === undefined) {
                    return Object.keys(value).length;
                } else {
                    return value._keys.length;
                }
            } else {
                return 0;
            }
        },

        // Array/Object Filters
        reverse: function(value) {
            if (is("Array", value)) {
                return value.reverse();
            } else if (is("String", value)) {
                return value.split("").reverse().join("");
            } else if (value instanceof Object) {
                var keys = value._keys || Object.keys(value).reverse();
                value._keys = keys;
                return value;
            }
        },
        sort: function(value) {
            if (is("Array", value)) {
                return value.sort();
            } else if (value instanceof Object) {
                // Sorting objects isn't obvious since the order of
                // returned keys isn't guaranteedin JavaScript.
                // Because of this we use a "hidden" key called _keys to
                // store the keys in the order we want to return them.

                delete value._keys;
                var keys = Object.keys(value),
                    sorted_keys = keys.sort(function(a, b) {
                        return value[a] > value[b];
                    });
                value._keys = sorted_keys;
                return value;
            }
        },
        keys: function(value) {
            if (value === undefined || value === null){
                return;
           }

            var keyset = value._keys || Object.keys(value),
                output = [];

            Twig.forEach(keyset, function(key) {
                if (key === "_keys") return; // Ignore the _keys property
                if (value.hasOwnProperty(key)) {
                    output.push(key);
                }
            });
            return output;
        },
        url_encode: function(value) {
            if (value === undefined || value === null){
                return;
            }

            return encodeURIComponent(value);
        },
        join: function(value, params) {
            if (value === undefined || value === null){
                return;
            }

            var join_str = "",
                output = [],
                keyset = null;

            if (params && params[0]) {
                join_str = params[0];
            }
            if (value instanceof Array) {
                output = value;
            } else {
                keyset = value._keys || Object.keys(value);
                Twig.forEach(keyset, function(key) {
                    if (key === "_keys") return; // Ignore the _keys property
                    if (value.hasOwnProperty(key)) {
                        output.push(value[key]);
                    }
                });
            }
            return output.join(join_str);
        },
        "default": function(value, params) {
            if (params === undefined || params.length !== 1) {
                throw new Twig.Error("default filter expects one argument");
            }
            if (value === undefined || value === null || value === '' ) {
                return params[0];
            } else {
                return value;
            }
        },
        json_encode: function(value) {
            if (value && value.hasOwnProperty( "_keys" ) ) {
                delete value._keys;
            }
            if(value === undefined || value === null) {
                return "null";
            }
            return JSON.stringify(value);
        },
        merge: function(value, params) {
            var obj = [],
                arr_index = 0,
                keyset = [];

            // Check to see if all the objects being merged are arrays
            if (!(value instanceof Array)) {
                // Create obj as an Object
                obj = { };
            } else {
                Twig.forEach(params, function(param) {
                    if (!(param instanceof Array)) {
                        obj = { };
                    }
                });
            }
            if (!(obj instanceof Array)) {
                obj._keys = [];
            }

            if (value instanceof Array) {
                Twig.forEach(value, function(val) {
                    if (obj._keys) obj._keys.push(arr_index);
                    obj[arr_index] = val;
                    arr_index++;
                });
            } else {
                keyset = value._keys || Object.keys(value);
                Twig.forEach(keyset, function(key) {
                    obj[key] = value[key];
                    obj._keys.push(key);

                    // Handle edge case where a number index in an object is greater than
                    //   the array counter. In such a case, the array counter is increased
                    //   one past the index.
                    //
                    // Example {{ ["a", "b"]|merge({"4":"value"}, ["c", "d"])
                    // Without this, d would have an index of "4" and overwrite the value
                    //   of "value"
                    var int_key = parseInt(key, 10);
                    if (!isNaN(int_key) && int_key >= arr_index) {
                        arr_index = int_key + 1;
                    }
                });
            }

            // mixin the merge arrays
            Twig.forEach(params, function(param) {
                if (param instanceof Array) {
                    Twig.forEach(param, function(val) {
                        if (obj._keys) obj._keys.push(arr_index);
                        obj[arr_index] = val;
                        arr_index++;
                    });
                } else {
                    keyset = param._keys || Object.keys(param);
                    Twig.forEach(keyset, function(key) {
                        if (!obj[key]) obj._keys.push(key);
                        obj[key] = param[key];

                        var int_key = parseInt(key, 10);
                        if (!isNaN(int_key) && int_key >= arr_index) {
                            arr_index = int_key + 1;
                        }
                    });
                }
            });
            if (params.length === 0) {
                throw new Twig.Error("Filter merge expects at least one parameter");
            }

            return obj;
        },
        date: function(value, params) {
            if (value === undefined||value === null){
                return;
            }

            var date = Twig.functions.date(value);
            return Twig.lib.formatDate(date, params[0]);
        },

        date_modify: function(value, params) {
            if (value === undefined || value === null) {
                return;
            }
            if (params === undefined || params.length !== 1) {
                throw new Twig.Error("date_modify filter expects 1 argument");
            }

            var modifyText = params[0], time;

            if (Twig.lib.is("Date", value)) {
                time = Twig.lib.strtotime(modifyText, value.getTime() / 1000);
            }
            if (Twig.lib.is("String", value)) {
                time = Twig.lib.strtotime(modifyText, Twig.lib.strtotime(value));
            }
            if (Twig.lib.is("Number", value)) {
                time = Twig.lib.strtotime(modifyText, value);
            }

            return new Date(time * 1000);
        },

        replace: function(value, params) {
            if (value === undefined||value === null){
                return;
            }

            var pairs = params[0],
                tag;
            for (tag in pairs) {
                if (pairs.hasOwnProperty(tag) && tag !== "_keys") {
                    value = Twig.lib.replaceAll(value, tag, pairs[tag]);
                }
            }
            return value;
        },

        format: function(value, params) {
            if (value === undefined || value === null){
                return;
            }

            return Twig.lib.vsprintf(value, params);
        },

        striptags: function(value) {
            if (value === undefined || value === null){
                return;
            }

            return Twig.lib.strip_tags(value);
        },

        escape: function(value) {
            if (value === undefined|| value === null){
                return;
            }
            return value.toString().replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#039;");
        },

        /* Alias of escape */
        "e": function(value) {
            return Twig.filters.escape(value);
        },

        nl2br: function(value) {
            if (value === undefined || value === null){
                return;
            }
            var linebreak_tag = "BACKSLASH_n_replace",
                br = "<br />" + linebreak_tag;

            value = Twig.filters.escape(value)
                        .replace(/\r\n/g, br)
                        .replace(/\r/g, br)
                        .replace(/\n/g, br);

            return Twig.lib.replaceAll(value, linebreak_tag, "\n");
        },

        /**
         * Adapted from: http://phpjs.org/functions/number_format:481
         */
        number_format: function(value, params) {
            var number = value,
                decimals = (params && params[0]) ? params[0] : undefined,
                dec      = (params && params[1] !== undefined) ? params[1] : ".",
                sep      = (params && params[2] !== undefined) ? params[2] : ",";

            number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
            var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                s = '',
                toFixedFix = function (n, prec) {
                    var k = Math.pow(10, prec);
                    return '' + Math.round(n * k) / k;
                };
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
            }
            if ((s[1] || '').length < prec) {
                s[1] = s[1] || '';
                s[1] += new Array(prec - s[1].length + 1).join('0');
            }
            return s.join(dec);
        },

        trim: function(value, params) {
            if (value === undefined|| value === null){
                return;
            }

            var str = Twig.filters.escape( '' + value ),
                whitespace;
            if ( params && params[0] ) {
                whitespace = '' + params[0];
            } else {
                whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
            }
            for (var i = 0; i < str.length; i++) {
                if (whitespace.indexOf(str.charAt(i)) === -1) {
                    str = str.substring(i);
                    break;
                }
            }
            for (i = str.length - 1; i >= 0; i--) {
                if (whitespace.indexOf(str.charAt(i)) === -1) {
                    str = str.substring(0, i + 1);
                    break;
                }
            }
            return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
        },

        slice: function(value, params) {
            if (value === undefined || value === null) {
                return;
            }
            if (params === undefined || params.length < 1) {
                throw new Twig.Error("slice filter expects at least 1 argument");
            }

            // default to start of string
            var start = params[0] || 0;
            // default to length of string
            var length = params.length > 1 ? params[1] : value.length;
            // handle negative start values
            var startIndex = start >= 0 ? start : Math.max( value.length + start, 0 );

            if (Twig.lib.is("Array", value)) {
                var output = [];
                for (var i = startIndex; i < startIndex + length && i < value.length; i++) {
                    output.push(value[i]);
                }
                return output;
            } else if (Twig.lib.is("String", value)) {
                return value.substr(startIndex, length);
            } else {
                throw new Twig.Error("slice filter expects value to be an array or string");
            }
        },

        abs: function(value) {
            if (value === undefined || value === null) {
                return;
            }

            return Math.abs(value);
        },

        first: function(value) {
            if (value instanceof Array) {
                return value[0];
            } else if (value instanceof Object) {
                if ('_keys' in value) {
                    return value[value._keys[0]];
                }
            } else if ( typeof value === "string" ) {
                return value.substr(0, 1);
            }

            return;
        },

        split: function(value, params) {
            if (value === undefined || value === null) {
                return;
            }
            if (params === undefined || params.length < 1 || params.length > 2) {
                throw new Twig.Error("split filter expects 1 or 2 argument");
            }
            if (Twig.lib.is("String", value)) {
                var delimiter = params[0],
                    limit = params[1],
                    split = value.split(delimiter);

                if (limit === undefined) {

                    return split;

                } else if (limit < 0) {

                    return value.split(delimiter, split.length + limit);

                } else {

                    var limitedSplit = [];

                    if (delimiter == '') {
                        // empty delimiter
                        // "aabbcc"|split('', 2)
                        //     -> ['aa', 'bb', 'cc']

                        while(split.length > 0) {
                            var temp = "";
                            for (var i=0; i<limit && split.length > 0; i++) {
                                temp += split.shift();
                            }
                            limitedSplit.push(temp);
                        }

                    } else {
                        // non-empty delimiter
                        // "one,two,three,four,five"|split(',', 3)
                        //     -> ['one', 'two', 'three,four,five']

                        for (var i=0; i<limit-1 && split.length > 0; i++) {
                            limitedSplit.push(split.shift());
                        }

                        if (split.length > 0) {
                            limitedSplit.push(split.join(delimiter));
                        }
                    }

                    return limitedSplit;
                }

            } else {
                throw new Twig.Error("split filter expects value to be a string");
            }
        },
        last: function(value) {
            if (Twig.lib.is('Object', value)) {
                var keys;

                if (value._keys === undefined) {
                    keys = Object.keys(value);
                } else {
                    keys = value._keys;
                }

                return value[keys[keys.length - 1]];
            }

            // string|array
            return value[value.length - 1];
        }
    };

    Twig.filter = function(filter, value, params) {
        if (!Twig.filters[filter]) {
            throw "Unable to find filter " + filter;
        }
        return Twig.filters[filter].apply(this, [value, params]);
    };

    Twig.filter.extend = function(filter, definition) {
        Twig.filters[filter] = definition;
    };

    return Twig;

})(Twig || { });
//     Twig.js
//     Copyright (c) 2011-2013 John Roepke
//                   2012 Hadrien Lanneau
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.functions.js
//
// This file handles parsing filters.
var Twig = (function (Twig) {

    // Determine object type
    function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }

    Twig.functions = {
        //  attribute, block, constant, date, dump, parent, random,.

        // Range function from http://phpjs.org/functions/range:499
        // Used under an MIT License
        range: function (low, high, step) {
            // http://kevin.vanzonneveld.net
            // +   original by: Waldo Malqui Silva
            // *     example 1: range ( 0, 12 );
            // *     returns 1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            // *     example 2: range( 0, 100, 10 );
            // *     returns 2: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
            // *     example 3: range( 'a', 'i' );
            // *     returns 3: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
            // *     example 4: range( 'c', 'a' );
            // *     returns 4: ['c', 'b', 'a']
            var matrix = [];
            var inival, endval, plus;
            var walker = step || 1;
            var chars = false;

            if (!isNaN(low) && !isNaN(high)) {
                inival = parseInt(low, 10);
                endval = parseInt(high, 10);
            } else if (isNaN(low) && isNaN(high)) {
                chars = true;
                inival = low.charCodeAt(0);
                endval = high.charCodeAt(0);
            } else {
                inival = (isNaN(low) ? 0 : low);
                endval = (isNaN(high) ? 0 : high);
            }

            plus = ((inival > endval) ? false : true);
            if (plus) {
                while (inival <= endval) {
                    matrix.push(((chars) ? String.fromCharCode(inival) : inival));
                    inival += walker;
                }
            } else {
                while (inival >= endval) {
                    matrix.push(((chars) ? String.fromCharCode(inival) : inival));
                    inival -= walker;
                }
            }

            return matrix;
        },
        cycle: function(arr, i) {
            var pos = i % arr.length;
            return arr[pos];
        },
        dump: function() {
            var EOL = '\n',
            	indentChar = '  ',
            	indentTimes = 0,
            	out = '',
				args = Array.prototype.slice.call(arguments),
				indent = function(times) {
                	var ind	 = '';
                    while (times > 0) {
                        times--;
                        ind += indentChar;
                    }
                    return ind;
                },
				displayVar = function(variable) {
                    out += indent(indentTimes);
                    if (typeof(variable) === 'object') {
                        dumpVar(variable);
                    } else if (typeof(variable) === 'function') {
                        out += 'function()' + EOL;
                    } else if (typeof(variable) === 'string') {
                        out += 'string(' + variable.length + ') "' + variable + '"' + EOL;
                    } else if (typeof(variable) === 'number') {
                        out += 'number(' + variable + ')' + EOL;
                    } else if (typeof(variable) === 'boolean') {
                        out += 'bool(' + variable + ')' + EOL;
                    }
                },
             	dumpVar = function(variable) {
					var	i;
	                if (variable === null) {
	                    out += 'NULL' + EOL;
	                } else if (variable === undefined) {
	                    out += 'undefined' + EOL;
	                } else if (typeof variable === 'object') {
	                    out += indent(indentTimes) + typeof(variable);
	                    indentTimes++;
	                    out += '(' + (function(obj) {
	                        var size = 0, key;
	                        for (key in obj) {
	                            if (obj.hasOwnProperty(key)) {
	                                size++;
	                            }
	                        }
	                        return size;
	                    })(variable) + ') {' + EOL;
	                    for (i in variable) {
	                        out += indent(indentTimes) + '[' + i + ']=> ' + EOL;
	                        displayVar(variable[i]);
	                    }
	                    indentTimes--;
	                    out += indent(indentTimes) + '}' + EOL;
	                } else {
	                    displayVar(variable);
	                }
	            };

			// handle no argument case by dumping the entire render context
			if (args.length == 0) args.push(this.context);

			Twig.forEach(args, function(variable) {
				dumpVar(variable);
			});

            return out;
        },
        date: function(date, time) {
            var dateObj;
            if (date === undefined) {
                dateObj = new Date();
            } else if (Twig.lib.is("Date", date)) {
                dateObj = date;
            } else if (Twig.lib.is("String", date)) {
                dateObj = new Date(Twig.lib.strtotime(date) * 1000);
            } else if (Twig.lib.is("Number", date)) {
                // timestamp
                dateObj = new Date(date * 1000);
            } else {
                throw new Twig.Error("Unable to parse date " + date);
            }
            return dateObj;
        },
        block: function(block) {
            return this.blocks[block];
        },
        parent: function() {
            // Add a placeholder
            return Twig.placeholders.parent;
        },
        attribute: function(object, method, params) {
            if (object instanceof Object) {
                if (object.hasOwnProperty(method)) {
                    if (typeof object[method] === "function") {
                        return object[method].apply(undefined, params);
                    }
                    else {
                        return object[method];
                    }
                }
            }
            // Array will return element 0-index
            return object[method] || undefined;
        }
    };

    Twig._function = function(_function, value, params) {
        if (!Twig.functions[_function]) {
            throw "Unable to find function " + _function;
        }
        return Twig.functions[_function](value, params);
    };

    Twig._function.extend = function(_function, definition) {
        Twig.functions[_function] = definition;
    };

    return Twig;

})(Twig || { });
//     Twig.js
//     Copyright (c) 2011-2013 John Roepke
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.tests.js
//
// This file handles expression tests. (is empty, is not defined, etc...)
var Twig = (function (Twig) {
    "use strict";
    Twig.tests = {
        empty: function(value) {
            if (value === null || value === undefined) return true;
            // Handler numbers
            if (typeof value === "number") return false; // numbers are never "empty"
            // Handle strings and arrays
            if (value.length && value.length > 0) return false;
            // Handle objects
            for (var key in value) {
                if (value.hasOwnProperty(key)) return false;
            }
            return true;
        },
        odd: function(value) {
            return value % 2 === 1;
        },
        even: function(value) {
            return value % 2 === 0;
        },
        divisibleby: function(value, params) {
            return value % params[0] === 0;
        },
        defined: function(value) {
            return value !== undefined;
        },
        none: function(value) {
            return value === null;
        },
        'null': function(value) {
            return this.none(value); // Alias of none
        },
        sameas: function(value, params) {
            return value === params[0];
        }
        /*
        constant ?
         */
    };

    Twig.test = function(test, value, params) {
        if (!Twig.tests[test]) {
            throw "Test " + test + " is not defined.";
        }
        return Twig.tests[test](value, params);
    };

    Twig.test.extend = function(test, definition) {
        Twig.tests[test] = definition;
    };

    return Twig;
})( Twig || { } );
//     Twig.js
//     Copyright (c) 2011-2013 John Roepke
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.exports.js
//
// This file provides extension points and other hooks into the twig functionality.

var Twig = (function (Twig) {
    "use strict";
    Twig.exports = {
        VERSION: Twig.VERSION
    };

    /**
     * Create and compile a twig.js template.
     *
     * @param {Object} param Paramteres for creating a Twig template.
     *
     * @return {Twig.Template} A Twig template ready for rendering.
     */
    Twig.exports.twig = function twig(params) {
        'use strict';
        var id = params.id,
            options = {
                strict_variables: params.strict_variables || false,
                allowInlineIncludes: params.allowInlineIncludes || false,
                rethrow: params.rethrow || false
            };

        if (id) {
            Twig.validateId(id);
        }

        if (params.debug !== undefined) {
            Twig.debug = params.debug;
        }
        if (params.trace !== undefined) {
            Twig.trace = params.trace;
        }

        if (params.data !== undefined) {
            return new Twig.Template({
                data: params.data,
                module: params.module,
                id:   id,
                options: options
            });

        } else if (params.ref !== undefined) {
            if (params.id !== undefined) {
                throw new Twig.Error("Both ref and id cannot be set on a twig.js template.");
            }
            return Twig.Templates.load(params.ref);

        } else if (params.href !== undefined) {
            return Twig.Templates.loadRemote(params.href, {
                id: id,
                method: 'ajax',
                base: params.base,
                module: params.module,
                precompiled: params.precompiled,
                async: params.async,
                options: options

            }, params.load, params.error);

        } else if (params.path !== undefined) {
            return Twig.Templates.loadRemote(params.path, {
                id: id,
                method: 'fs',
                base: params.base,
                module: params.module,
                precompiled: params.precompiled,
                async: params.async,
                options: options

            }, params.load, params.error);
        }
    };

    // Extend Twig with a new filter.
    Twig.exports.extendFilter = function(filter, definition) {
        Twig.filter.extend(filter, definition);
    };

    // Extend Twig with a new function.
    Twig.exports.extendFunction = function(fn, definition) {
        Twig._function.extend(fn, definition);
    };

    // Extend Twig with a new test.
    Twig.exports.extendTest = function(test, definition) {
        Twig.test.extend(test, definition);
    };

    // Extend Twig with a new definition.
    Twig.exports.extendTag = function(definition) {
        Twig.logic.extend(definition);
    };

    // Provide an environment for extending Twig core.
    // Calls fn with the internal Twig object.
    Twig.exports.extend = function(fn) {
        fn(Twig);
    };


    /**
     * Provide an extension for use with express 2.
     *
     * @param {string} markup The template markup.
     * @param {array} options The express options.
     *
     * @return {string} The rendered template.
     */
    Twig.exports.compile = function(markup, options) {
        var id = options.filename,
            path = options.filename,
            template;

        // Try to load the template from the cache
        template = new Twig.Template({
            data: markup,
            path: path,
            id: id,
            options: options.settings['twig options']
        }); // Twig.Templates.load(id) ||

        return function(context) {
            return template.render(context);
        };
    };

    /**
     * Provide an extension for use with express 3.
     *
     * @param {string} path The location of the template file on disk.
     * @param {Object|Function} The options or callback.
     * @param {Function} fn callback.
     */

    Twig.exports.renderFile = function(path, options, fn) {
        // handle callback in options
        if ('function' == typeof options) {
            fn = options;
            options = {};
        }

        options = options || {};

        var params = {
                path: path,
                base: options.settings['views'],
                load: function(template) {
                    // render and return template
                    fn(null, template.render(options));
                }
            };

        // mixin any options provided to the express app.
        var view_options = options.settings['twig options'];

        if (view_options) {
            for (var option in view_options) if (view_options.hasOwnProperty(option)) {
                params[option] = view_options[option];
            }
        }

        Twig.exports.twig(params);
    };

    // Express 3 handler
    Twig.exports.__express = Twig.exports.renderFile;

    /**
     * Shoud Twig.js cache templates.
     * Disable during development to see changes to templates without
     * reloading, and disable in production to improve performance.
     *
     * @param {boolean} cache
     */
    Twig.exports.cache = function(cache) {
        Twig.cache = cache;
    }

    return Twig;
}) (Twig || { });

//     Twig.js
//     Copyright (c) 2011-2013 John Roepke
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.compiler.js
//
// This file handles compiling templates into JS
var Twig = (function (Twig) {
    /**
     * Namespace for compilation.
     */
    Twig.compiler = {
        module: {}
    };

    // Compile a Twig Template to output.
    Twig.compiler.compile = function(template, options) {
        // Get tokens
        var tokens = JSON.stringify(template.tokens)
            , id = template.id
            , output;

        if (options.module) {
            if (Twig.compiler.module[options.module] === undefined) {
                throw new Twig.Error("Unable to find module type " + options.module);
            }
            output = Twig.compiler.module[options.module](id, tokens, options.twig);
        } else {
            output = Twig.compiler.wrap(id, tokens);
        }
        return output;
    };

    Twig.compiler.module = {
        amd: function(id, tokens, pathToTwig) {
            return 'define(["' + pathToTwig + '"], function (Twig) {\n\tvar twig, templates;\ntwig = Twig.twig;\ntemplates = ' + Twig.compiler.wrap(id, tokens) + '\n\treturn templates;\n});';
        }
        , node: function(id, tokens) {
            return 'var twig = require("twig").twig;\n'
                + 'exports.template = ' + Twig.compiler.wrap(id, tokens)
        }
        , cjs2: function(id, tokens, pathToTwig) {
            return 'module.declare([{ twig: "' + pathToTwig + '" }], function (require, exports, module) {\n'
                        + '\tvar twig = require("twig").twig;\n'
                        + '\texports.template = ' + Twig.compiler.wrap(id, tokens)
                    + '\n});'
        }
    };

    Twig.compiler.wrap = function(id, tokens) {
        return 'twig({id:"'+id.replace('"', '\\"')+'", data:'+tokens+', precompiled: true});\n';
    };

    return Twig;
})(Twig || {});
//     Twig.js
//     Copyright (c) 2011-2013 John Roepke
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.module.js
// Provide a CommonJS/AMD/Node module export.

if (typeof module !== 'undefined' && module.declare) {
    // Provide a CommonJS Modules/2.0 draft 8 module
    module.declare([], function(require, exports, module) {
        // Add exports from the Twig exports
        for (key in Twig.exports) {
            if (Twig.exports.hasOwnProperty(key)) {
                exports[key] = Twig.exports[key];
            }
        }
    });
} else if (typeof define == 'function' && define.amd) {
    define(function() {
        return Twig.exports;
    });
} else if (typeof module !== 'undefined' && module.exports) {
    // Provide a CommonJS Modules/1.1 module
    module.exports = Twig.exports;
} else {
    // Export for browser use
    window.twig = Twig.exports.twig;
    window.Twig = Twig.exports;
}

