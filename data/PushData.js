self.port.on("display", function(selectedString, noOfEntriesCounter) {
	console.log('headphones    ' + noOfEntriesCounter);
	var linkNode = document.createElement("A");
	var linkNodeAttr = document.createAttribute("href");
	linkNodeAttr.value = '#' + (noOfEntriesCounter + 1);
	linkNode.setAttributeNode(linkNodeAttr);
	var textnode = document.createTextNode(selectedString);
	linkNode.appendChild(textnode);
	
	var tdNode = document.createElement("TD");
	tdNode.appendChild(linkNode);

	var trNode = document.createElement("TR");
	trNode.appendChild(tdNode);

	var firstChild = document.getElementById("content-table").firstChild;
	document.getElementById("content-table").insertBefore(trNode, firstChild);
});

//Listen to link clicked on panel
window.addEventListener('click', function(event) {
	var t = event.target;
	if(t.nodeName == 'A') {
		self.port.emit('click-link', t.toString());
	}
}, false);