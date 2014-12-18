var ss = require("sdk/simple-storage");

ss.storage.myNum = 1;

ss.storage.myNum = ss.storage.myNum + 1;

var myScript = 'document.getElementById("para").innerHTML ="' + ss.storage.myString + '"';
console.log(ss.storage.myString);

var { ToggleButton} = require('sdk/ui/button/toggle');
var	panels = require('sdk/panel');
var	self = require('sdk/self');


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