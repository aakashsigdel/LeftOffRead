self.port.on("display", function(selectedString) {
	var node = document.createElement("LI");
	var textnode = document.createTextNode(selectedString);
	node.appendChild(textnode);
	var firstChild = document.getElementById("content_list").firstChild;
	document.getElementById("content_list").insertBefore(node, firstChild);
});