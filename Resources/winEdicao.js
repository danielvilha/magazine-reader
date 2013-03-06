function winEdicao() {

	var self = Titanium.UI.createWindow({
		backgroundColor : '#333',
		navBarHidden : true
	});

	var flexSpace = Ti.UI.createButton({
		systemButton : Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	var titleLabel = Ti.UI.createLabel({
		text : 'Edicao',
		font : {
			fontSize : 20,
			fontWeight : 'bold'
		},
		color : '#ffffff',
		textAlign : 'center',
		width : 400,
	});

	var topToolbar = Titanium.UI.iOS.createToolbar({
		top : 0,
		borderTop : false,
		borderBottom : true,
		translucent : false,
		backgroundColor : 'black',
		barColor : '#000',
		zIndex : 50
	});

	topToolbar.hide();

	self.add(topToolbar);
	//-----------------------------------------------------------------------------------------------------------------------------//
	//                                                                                                                             //
	//********************************************BLOCO DE CÓDIGOS DA REVISTA******************************************************//
	//                                                                                                                             //
	//-----------------------------------------------------------------------------------------------------------------------------//
	var currentPage;
	var data = [];
	var path = "";
	var img = [];

	var dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "files");
	path = Ti.Filesystem.applicationDataDirectory + "files";
	
	var file = Titanium.Filesystem.getFile(path, "edicao.json");

	if (file.exists()) {
		var json = file.read();
		var d = JSON.parse(json);
		json = null;
		data = d.paginas;

	}

	var scrollableView = Titanium.UI.createScrollableView({
		layout : 'center'
	});

	var scrollView = Titanium.UI.createScrollView({
		maxZoomScale : 3.0,
		minZoomScale : 1.0,
		disableBounce : true,
		layout : 'center',
		x : 0,
		y : 0
	});

	// Passar por todos os arquivos no repositório
	for (var i = 0; i < data.length; i++) {
		var imgApp = data[i].imagem_app;
		imgApp = imgApp.split("/");
		imgApp.reverse();

		// Ti.API.info(path + "/" + imgApp[0]);

		img.push(Titanium.UI.createImageView({
			image : path + "/" + imgApp[0]
		}));

		Ti.API.info(img[i].image);
	};

	scrollableView.views = img;

	scrollView.addEventListener('doubletap', function(e) {
		if (scrollView.zoomScale === 1.0) {
			scrollView.zoomScale = 3.0;
		} else {
			scrollView.zoomScale = 1.0;
		}
	});

	scrollView.add(scrollableView);

	// Construção do SELF
	self.add(scrollView);

	return self;
}

module.exports = winEdicao;
