var ss = require("sdk/simple-storage"),
	{ ToggleButton } = require('sdk/ui/button/toggle'),
	panels = require('sdk/panel'),
	self = require('sdk/self'),
	tabs = require('sdk/tabs'),
	cm = require('sdk/context-menu');
	const {Cu} = require('chrome');

//Read and write to a file
const {TextDecoder, TextEncoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});
var decoder = new TextDecoder();
var encoder = new TextEncoder();
var filePath = OS.Path.join('D:', 'file.txt');
var noOfEntriesCounter = 0;
var allJSONGlobal;







ss.storage.selectedString = "";

if(!ss.storage.storedTitle)
	ss.storage.titleStore = [];

if(!ss.storage.allStore)
	ss.storage.allStore = [];

if(!ss.storage.allURL)
	ss.storage.allURL = [];

publishContentOnLoad();







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
				'var selectedTitle = prompt("Input Title For Your Content", selectedText.slice(0, 10));' +
				'self.postMessage({"selectedTitle" : selectedTitle, "selectedText" : selectedText, "docURL" : document.URL});' +
				'});';

cm.Item({
	label : "Left Off Read",
	context : cm.SelectionContext(),
	contentScript : clickScript,
	onMessage : function(selectedTextAndURL) {
		displayTitleInPanel(selectedTextAndURL.selectedTitle);
		storeOnJSON(selectedTextAndURL.selectedTitle, selectedTextAndURL.selectedText, selectedTextAndURL.docURL);
	}
});

//Display message on the Panel
function displayTitleInPanel(selectedText) {
	ss.storage.selectedString = selectedText;
	panel.port.emit("display", selectedText, noOfEntriesCounter);
	++noOfEntriesCounter;
	panel.show({
		position : button
	});
}

//store everything on JSON on file
function storeOnJSON(selectedTitle, selectedText, currentURL) {
	//JSON to be saved on file.txt
	var allTextJSON = {
		"title" : selectedTitle,
		"currentURL" : currentURL,
		"selectedText" : selectedText
	};
	
	allJSONGlobal.allData.push(allTextJSON);

	allTextJSON = JSON.stringify(allTextJSON);

	//Writing JSON to file.txt
	let promiseFileExists = OS.File.exists(filePath);
	promiseFileExists.then(
		function onSuccess( aExists) {
			let promise = OS.File.open(filePath, {write : true, append : false});
			promise.then(
			function onSuccess(myfile) {
				if(aExists) {
					//console.log('yayyy');
					myfile.setPosition(-2, OS.File.POS_END);
					allTextJSON = ',' + allTextJSON + ']}';
					var	array = encoder.encode(allTextJSON);
					myfile.write(array);
					myfile.close();	
				} else {
					//console.log('booo');
					allTextJSON = '{"allData":[' + allTextJSON + ']}';
					var	array = encoder.encode(allTextJSON);
					myfile.write(array);
					myfile.close();
				}
			});
		});
}






//publishing content to the panel when browser starts
function publishContentOnLoad() {
	let promiseFileExists = OS.File.exists(filePath);
	promiseFileExists.then(
		function onSuccess(aExists) {
			if(aExists) {
				//remove existing panel.html file
				OS.File.remove('data/panel.html');
				
				//read file.txt and write its content to panel.html
				let promise = OS.File.read(filePath);
				promise.then(
					function onSuccess(myfile) {
						var readJSON = JSON.parse(decoder.decode(myfile));
						allJSONGlobal = readJSON;
						noOfEntriesCounter = readJSON.allData.length - 1;

						let promisePanel = OS.File.open('data/panel.html', {write : true, append : false});
						promisePanel.then(
							function onSuccess(myPanelfile) {
								var htmlData = '<html>\n' +
												'	<head>\n' +
												'		<link href="skeleton.css" rel="stylesheet" type="text/css" />\n' +
												'		<link href="normalize.css" rel="stylesheet" type="text/css" />\n' +
												'		<link href="style.css" rel="stylesheet" type="text/css" />\n' +
												'	</head>\n' +
												'	<body>\n' +
												'\n' +
												'		<div class="container">\n' +
												'			<table id="content-table" class="u-full-width">\n';

								myPanelfile.write(encoder.encode(htmlData));

								var listData = ' ';
								var data;
								for(data in readJSON.allData) {
									listData = listData + '				<tr>\n' +
															'					<td><A id="'+ ((readJSON.allData.length - 1) - data) + 
																					'" href="#'+ ((readJSON.allData.length - 1) - data) + '">' + 
																					readJSON.allData[(readJSON.allData.length - 1) - data].title +
																					 '</A></td>\n' +
															'				</tr>\n';
								}

								myPanelfile.write(encoder.encode(listData));
								htmlData = '\n' +
											'			</table>\n' +
											'		</div>\n' + 
											'	</body>\n' +
											'</html>';
								myPanelfile.write(encoder.encode(htmlData));
								myPanelfile.close();
							});
					});
			} else {
				OS.File.remove('data/panel.html');
				let promisePanel = OS.File.open('data/panel.html', {write : true, append : false});
				promisePanel.then(
					function onSuccess(myPanelfile) {
						console.log('\n\nAttuJhattu---:--  ');
						myPanelfile.close();
					}
				);
			}
		}
	);
}







//Opening a popup for reading the saved text 
var popupPanel = panels.Panel({
	contentURL : self.data.url('PopupPanel.html'),
	contentScriptFile : self.data.url('DisplayDataInPopup.js')
});

//Send JSON of whole text of the given JSON index
panel.port.on('click-link', function(JSONIndex) {
	JSONIndex = Number(JSONIndex.slice(JSONIndex.indexOf('#') + 1));
	popupPanel.port.emit('data-avail', allJSONGlobal.allData[JSONIndex]);
	popupPanel.show();
});








//Opening a new tab for continue reading
popupPanel.port.on('content-link', function(docURL) {
	tabs.open(docURL);
	tabs.on('ready', function(tab) {
		//TO DO: Scroll to the text
	});
});