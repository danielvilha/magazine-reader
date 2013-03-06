function createThumbnailViewer(props) {

	var that = {};
	var xhr = Titanium.Network.createHTTPClient();

	var photosWindow = Titanium.UI.createWindow({
		fullscreen : false,
		backgroundColor : '#333',
		title : props.title
	});
	that.window = photosWindow;

	var refreshButton = Ti.UI.createButton({
		title : 'Refresh',
		width : 40,
		height : 30
	});
	var photosContainer = Titanium.UI.createView();

	var imageUrlLists = [];
	var index = -1;
	var total = 0;

	var heightSpacer = 12;
	var widthSpacer = 17;
	var topOffset = heightSpacer;
	var imageDim = 170;
	var pageSize = 20;
	for (var i = 0, count = pageSize; i < count; i += 4) {
		var leftOffset = widthSpacer;
		for (var j = 0; j < 4; j++) {
			var photoView = Ti.UI.createImageView({
				top : topOffset,
				left : leftOffset,
				height : imageDim,
				width : imageDim
			});
			photosContainer.add(photoView);
			leftOffset += imageDim + widthSpacer;
		}
		topOffset += imageDim + heightSpacer;
	}

	photosWindow.add(photosContainer);

	var flexSpace = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	var previousButton = Ti.UI.createButton({
		title : 'Prev',
		width : 50,
		height : 10
	});
	previousButton.addEventListener('click', function() {
		previous();
	});
	var nextButton = Ti.UI.createButton({
		title : 'Next',
		width : 50,
		height : 10
	});
	nextButton.addEventListener('click', function() {
		next();
	});
	var nativespinner = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.SPINNER
	});

	var labelContainer = Ti.UI.createView({
		width : 100,
		height : 20
	});

	var label = Ti.UI.createLabel({
		color : '#fff'
	});

	labelContainer.add(label);

	photosWindow.toolbar = [previousButton, flexSpace, labelContainer, flexSpace, nextButton];

	refreshButton.addEventListener('click', function() {
		that.start();
	});

	that.start = function() {
		index = -1;
		imageUrlLists = [];
		total = 0;
		next();
	}

	photosWindow.rightNavButton = refreshButton;

	function next() {
		index++;
		if (index >= imageUrlLists.length) {
			load();
		} else {
			applyImageUrls();
		}
	}

	function previous() {
		index--;
		if (index >= 0) {
			applyImageUrls();
		}
	}

	function applyImageUrls() {
		var imageUrlList = imageUrlLists[index];
		label.text = (index * pageSize + imageUrlList.length) + " of " + total;
		var photos = photosContainer.children;
		var i = 0, count = imageUrlList.length;
		while (i < count) {
			photos[i].image = imageUrlList[i];
			i++;
		}
		if (count < pageSize) {
			while (i < pageSize) {
				photos[i].image = null;
				i++;
			}
		}
		previousButton.enabled = index > 0;
		nextButton.enabled = imageUrlLists.length * pageSize <= total;
	}

	function load() {
		xhr.onload = function() {
			var json = JSON.parse(this.responseText);
			var list = json.List;
			total = json.CollectionCount;
			var imageUrlList = [];
			var i = 0, count = list.length;
			while (i < count) {
				imageUrlList[i] = list[i].ThumbnailUrl;
				i++;
			}
			imageUrlLists[index] = imageUrlList;
			photosWindow.toolbar = [previousButton, flexSpace, labelContainer, flexSpace, nextButton];
			applyImageUrls();
		};
		previousButton.enabled = false;
		nextButton.enabled = false;
		photosWindow.toolbar = [previousButton, flexSpace, nativespinner, flexSpace, nextButton];
		var url = "http://api.plixi.com/api/tpapi.svc/json/users/" + props.plixiUserId + "/photos?getcount=true&ps=" + pageSize + "&ind=" + (index * pageSize);
		Ti.API.info("Calling url  = " + url);
		xhr.open("GET", url);
		xhr.send();
	}

	return that;
}

var thumbnailViewer = createThumbnailViewer({
	plixiUserId : '6236650',
	title : 'Aresenio Hall'
});

var navGroup = Ti.UI.iPhone.createNavigationGroup({
	window : thumbnailViewer.window
});

var main = Ti.UI.createWindow();
main.add(navGroup);
main.open();

thumbnailViewer.start();