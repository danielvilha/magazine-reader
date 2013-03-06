var self = Titanium.UI.currentWindow;
self.orientationModes = [Ti.UI.PORTRAIT];

var Compression = require('ti.compression');
var source = 'https://dl.dropbox.com/u/19460864/app-revista/data5.zip';

//-----------------------------------------------------------------------------------------------------------------

//Criar botões e seus eventListeners
//---------------------------------------------------------
var pb = Ti.UI.createProgressBar({
	width : '50%',
	top : '10%',
	height : 'auto',
	min : 0,
	max : 100,
	value : 0,
	color : '#fff',
	message : 'Downloading',
	font : {
		fontSize : 14,
		fontWeight : 'bold'
	},
	visible : false
});

self.add(pb);

var downloadBt = Ti.UI.createButton({
	title : 'DOWNLOAD',
	height : 90,
	width : 200
});

downloadBt.addEventListener('click', function(e) {
	if (Ti.Network.online) {
		pb.visible = true;
		downloadBt.visible = false;
		deleteFile();
		loadFile();
	} else {
		alert("Verifique sua conexão com a internet e tente fazer o download novamente.");
	}
});

self.add(downloadBt);

var abrirBt = Ti.UI.createButton({
	title : 'ABRIR',
	height : 90,
	width : 200,
	visible : false
});

abrirBt.addEventListener('click', function(e) {
	var Edicao = require('winEdicao');
	var edicao = new Edicao();

	var listener = function() {
		edicao.removeEventListener('close', listener);
		edicao = Ti.UI.createWindow();
		edicao = null;
		listener = null;
		Edicao = null;
		delete Edicao;
	}

	edicao.open();

	edicao.addEventListener('close', listener);
});

self.add(abrirBt);
//---------------------------------------------------------

//Funções
//-----------------------------------------------------------------------------------------------------------------

function loadFile() {
	var xhr = Titanium.Network.createHTTPClient();

	xhr.onload = function() {
		var dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "files");

		if (! dir.exists()) {
			dir.createDirectory();
		}

		var f = Ti.Filesystem.getFile(dir.resolve(), "file.zip");
		f.write(this.responseData);

		var outputDirectory = Ti.Filesystem.applicationDataDirectory + 'files/';

		var zipFileName = outputDirectory + 'file.zip';
		var result = Compression.unzip(outputDirectory, zipFileName, true);

		f.deleteFile();

		abrirBt.visible = true;
		pb.visible = false;

		dir = null;
		f = null;
	};

	xhr.ondatastream = function(e) {
		pb.value = e.progress * 100;
	}
	//TODO: Criar uma função que quando a conexão cai, apresentar na tela uma mensagem de erro.
	xhr.onerror = function(e) {
		Ti.API.debug(e.error);
		alert('Erro ao carregar arquivo, verifique a conexão e tente novamente.');
		downloadBt.visible = true;
		pb.visible = false;
	}

	xhr.open('GET', source);
	xhr.send();
}

function deleteFile() {
	var dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, Ti.Filesystem.separator + "files");

	if (dir.exists()) {
		dir.deleteDirectory(true);
	}

	abrirBt.visible = false;
	// downloadBt.visible = true;

	dir = null;
}