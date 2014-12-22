var ss = require("sdk/simple-storage"),
	{ ToggleButton } = require('sdk/ui/button/toggle'),
	panels = require('sdk/panel'),
	self = require('sdk/self'),
	cm = require('sdk/context-menu');
	
ss.storage.selectedString = "";







//Toggle Addon Button
var button = ToggleButton({
	id : "my-button",
	label : "My Aakash Button",
	icon : {
		"16" : "./icon-16.png",
		"32" : "./icon-32.png",
		"64" : "./icon-64.png"
	},
	onChange : handleChange
});

function handleChange(state) {
	if(state.checked) {
		panel.show({
			position : button
		});
	}
}







//Panel
var panel = panels.Panel({
	contentURL : self.data.url('panel.html'),
	contentScriptFile : self.data.url('PushData.js'),
	onHide : handleHide
});

function handleHide() {
	button.state('window', {checked : false});
}







//Context-menu
var clickScript = 'self.on("click", function(node, data) {' +
				'var selectedText = "";' +
				'selectedText = window.getSelection().toString();' + 
				'self.postMessage(selectedText);' +
				'});';

cm.Item({
	label : "Aakash Context Menu",
	context : cm.SelectionContext(),
	contentScript : clickScript,
	onMessage : function(selectedText) {
		displayMessage(selectedText);
	}
});

function displayMessage(selectedText) {
	ss.storage.selectedString = selectedText;
	panel.port.emit("display", ss.storage.selectedString);
	panel.show({
		position : button
	});
}