Titanium.UI.setBackgroundColor('#333');

//Criamos a Tab Bar (nome no iPhone), ou Tab Group (nome no Titanium)
var tabGroup = Titanium.UI.createTabGroup();

Ti.API.info(Ti.Platform.osname);

//Criamos a tela winHome usando CommonJS
var winHome = Titanium.UI.createWindow({
	navBarHidden : true,
	tabBarHidden : true,
	url : 'winHome.js'
});

//Criamos a aba que agrupará a winHome
var tabHome = Titanium.UI.createTab({
	window : winHome
});

//Adicionamos as abas no tabGroup
tabGroup.addTab(tabHome);

//Abrimos o tabGroup
tabGroup.open(); 