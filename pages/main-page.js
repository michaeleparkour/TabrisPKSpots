exports.create = function() {
    return tabris.create("Page", {
        title: "Home",
        topLevel: true
    }).once("appear", createExample);
};

function createExample(page) {
    var tabFolder = tabris.create("TabFolder", {
        layoutData: {left: 0, top: 0, right: 0, bottom: 0},
        paging: true
    }).appendTo(page);

    var createTab = function(title) {
        var tab = tabris.create("Tab", {
            title: title
        }).appendTo(tabFolder);
        tabris.create("TextView", {
            layoutData: {centerX: 0, centerY: 0},
            text: "Content of Tab " + title
        }).appendTo(tab);
    };

    createTab("Вокруг");
    createTab("Лучшие");
    createTab("Новости");

}