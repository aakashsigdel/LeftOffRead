self.port.on("data-avail", function(entryData) {
	var titleDiv = document.getElementById('title');
	titleDiv.innerHTML = entryData.title;

	var displayDiv = document.getElementById('savedSeletedDisplay');
	displayDiv.innerHTML = entryData.selectedText;

	var contentLink = document.getElementById('content-link');
	var contentLinkAttr = document.createAttribute('href');
	contentLinkAttr.value = entryData.currentURL;
	contentLink.setAttributeNode(contentLinkAttr);
	contentLink.innerHTML = "Click Here To Read The Whole Article";
});

window.addEventListener('click', function(event) {
	var t = event.target;
	event.preventDefault();
	if(t.id == 'content-link') 
		self.port.emit('content-link', t.href);
});