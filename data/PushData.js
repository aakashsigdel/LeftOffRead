self.port.on("display", function(selectedString, noOfEntriesCounter) {
	var linkNode = document.createElement("A");
	var linkNodeAttr = document.createAttribute("href");
	linkNodeAttr.value = '#' + noOfEntriesCounter + 1;
	linkNode.setAttributeNode(linkNodeAttr);
	var textnode = document.createTextNode(selectedString);
	linkNode.appendChild(textnode);
	
	var node = document.createElement("LI");
	node.appendChild(linkNode);
	var firstChild = document.getElementById("content_list").firstChild;
	document.getElementById("content_list").insertBefore(node, firstChild);
});

//Listen to link clicked on panel
window.addEventListener('click', function(event) {
	var t = event.target;
	if(t.nodeName == 'A')
		self.port.emit('click-link', t.toString());
}, false);
