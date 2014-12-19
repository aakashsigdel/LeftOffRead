var ss = require("sdk/simple-storage");

if(ss.storage.myNum1 != 5)
	ss.storage.myNum1 = 5;
else
	ss.storage.myNum1 = 1;

//ss.storage.myNum = ss.storage.myNum + 1;

var myScript = 'document.getElementById("para").innerHTML ="' + ss.storage.myNum1 + '"';

var clickScript = 'self.on("click", function(node, data) {' +
				'var selectedText = ""' +
				'selectedText = window.getSelection().toString();' + 
				'self.postMessage(selectedText);' +
				'});';

var { ToggleButton} = require('sdk/ui/button/toggle');
var	panels = require('sdk/panel');
var	self = require('sdk/self');
var cm = require('sdk/context-menu');

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

var panel = panels.Panel({
	contentURL : self.data.url('panel.html'),
	contentScript : myScript,
	onHide : handleHide
});

cm.Item({
	label : "Aakash Context Menu",
	context : cm.SelectionContext(),
	contentScript : clickScript,
	onMessage : function(selectedText) {
		conosle.log(selectedText);
	}
});


function handleChange(state) {
	if(state.checked) {
		panel.show({
			position : button
		});
	}
}

function handleHide() {
	button.state('window', {checked : false});
}