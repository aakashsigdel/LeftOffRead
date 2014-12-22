var ss = require("sdk/simple-storage"),
	{ ToggleButton } = require('sdk/ui/button/toggle'),
	panels = require('sdk/panel'),
	self = require('sdk/self'),
	cm = require('sdk/context-menu');
	const {Cu} = require('chrome');

//Read and write to a file
const {TextDecoder, TextEncoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});
var decoder = new TextDecoder();
var encoder = new TextEncoder();









ss.storage.selectedString = "";

if(!ss.storage.storedTitle)
	ss.storage.titleStore = [];

if(!ss.storage.allStore)
	ss.storage.allStore = [];

if(!ss.storage.allURL)
	ss.storage.allURL = [];









//Toggle Addon Button
var button = ToggleButton({
	id : "my-button",
	label : "Left Off Read",
	icon : {
		"16" : "./icon-16.png",
		"32" : "./icon-32.png",
		"64" : "./icon-64.png"
	}
,	onChange : handleChange
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
				'self.postMessage({"selectedText" : selectedText, "docURL" : document.URL});' +
				'});';

cm.Item({
	label : "Left Off Read",
	context : cm.SelectionContext(),
	contentScript : clickScript,
	onMessage : function(selectedTextAndURL) {
		displayTitleInPanel(selectedTextAndURL.selectedText);
		storeOnJSON(selectedTextAndURL.selectedText, selectedTextAndURL.selectedText, selectedTextAndURL.docURL);
	}
});

//Display message on the Panel
function displayTitleInPanel(selectedText) {
	ss.storage.selectedString = selectedText;
	panel.port.emit("display", selectedText);
	panel.show({
		position : button
	});
	
}

//store everything on JSON on file
function storeOnJSON(selectedTitle, selectedText, currentURL) {
	var allTextJSON = {
		"title" : selectedTitle,
		"currentURL" : currentURL,
		"selectedText" : selectedText
	};
	allTextJSON = JSON.stringify(allTextJSON);
	let promiseFileExists = OS.File.exists(OS.Path.join('D:', 'file.txt'));
	promiseFileExists.then(
		function onSuccess() {
			let promise = OS.File.open(OS.Path.join('D:', 'file.txt'), {write : true, append : false});
			promise.then(
			function onSuccess(myfile) {
				myfile.setPosition(-2, OS.File.POS_END);
				allTextJSON = ',' + allTextJSON;
				var	array = encoder.encode(allTextJSON);
				myfile.write(array);		
			});
		},
		function onFailure(aRejectReason) {
			let promise = OS.File.open(OS.Path.join('D:', 'file.txt'), {write : true, append : false});
			promise.then(
			function onSuccess(myfile) {
				allTextJSON = '{"allData":[' + allTextJSON;
				var	array = encoder.encode(allTextJSON);
				myfile.write(array);		
			});
		});
/*
	let promise = OS.File.open(OS.Path.join('D:', 'file.txt'), {write : true, append : false});
	let promise = promise.then(
		function onSuccess(myfile) {
			var	array = encoder.encode(JSON.stringify(allTextJSON));
			myfile.setPosition(-2, OS.File.POS_END);
			myfile.write(array);		
		});*/
}