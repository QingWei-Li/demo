function addLoadEvent (func) {
		var oldonload = window.onload;
		if (typeof oldonload != 'function') {
			window.onload = func;
		}else{
			window.onload = function () {
				oldonload();
				func();
			}
		}
}
function insertAfter (newElement, targetElement) {
		var parent = targetElement.parentNode;
		if (parent.lastChild == targetElement) {
			parent.appendChild(newElement);
		}else{
			parent.insertBefore(newElement,targetElement.nextSibling);
		}
}
function addClass(element, value){
		if(!element.calssName){
			element.className = value;
		}else{
			newClassName = element.className;
			newClassName += " ";
			newClassName += value;
			element.calssName = newClassName;
		}
}
function highlightPage () {
	if (!document.getElementsByTagName) return false;
	if (!document.getElementById) return false;
	var headers = document.getElementsByTagName('header');
	if (headers.length == 0) return false;
	var navs = headers[0].getElementsByTagName('nav');
	if (navs.length == 0) return false;

	//取得导航链接
	var links = navs[0].getElementsByTagName('a');
	var linkurl;
	for (var i = 0; i < links.length; i++) {
		linkurl = links[i].getAttribute('href');
		//取得与当前页面链接一致的导航链接
		if(window.location.href.indexOf(linkurl) != -1){
			links[i].className = "here";
			//为当前页面的body添加id
			var linktext = links[i].lastChild.nodeValue.toLowerCase();
			document.body.setAttribute('id',linktext);
		}
	}
}
addLoadEvent(highlightPage);