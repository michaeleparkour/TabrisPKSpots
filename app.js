Promise = require("promise");
require("whatwg-fetch");
require("./scripts/utils.js");
window.global = {};
tabris.ui.set('background', '#2962FF');
var drawer = tabris.create("Drawer", {
    layoutData: {
        width: 200
    },
    background: "#333",
    font: "14px Roboto, sans-serif",
    textColor: "#ffffff"
});
tabris.create("PageSelector").appendTo(drawer);
var main_page = require("./pages/main-page.js").create().open();
console.log(drawer.find('CollectionView')[0].set('textColor', '#ffffff'))
