Promise = require("promise");
require("whatwg-fetch");
var global = {};
tabris.ui.set('background', '#2962FF');
var drawer = tabris.create("Drawer");
var page = tabris.create("Page", {
    title: "Главная",
    topLevel: true
});
var tabFolder = tabris.create("TabFolder", {
    layoutData: {left: 0, top: 0, right: 0, bottom: 0},
    paging: true,
    background: "#2962FF",
    textColor: "#ffffff"
}).appendTo(page);

var createTab = function (title) {
    return tabris.create("Tab", {
        title: title,
        background: "#eee"
    }).appendTo(tabFolder);
};

var view = tabris.create("CollectionView", {
    layoutData: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    },
    itemHeight: 150,
    refreshEnabled: true,
    initializeCell: function (cell) {
        var card = tabris.create("Composite", {
            layoutData: {
                top: 10,
                left: 10,
                right: 10,
                bottom: 5
            },
            background: "#fff",
            margin: 10
        }).appendTo(cell);
        var imageView = tabris.create("ImageView", {
            layoutData: {
                top: 0,
                left: 0,
                bottom: 0,
                right: "70%"
            },
            scaleMode: 'fill'
        }).appendTo(card);
        var card_info = tabris.create("Composite", {
            layoutData: {
                top: 0,
                left: [imageView, 16],
                right: 0
            },
            font: "14px Roboto, sans-serif",
            textColor: "#333"
        });
        var title = tabris.create("TextView", {
            layoutData: {
                left: 0,
                top: 5,
                right: 0
            },
            alignment: "left",
            font: "bold 18px",
            textColor: "#000"
        }).appendTo(card_info);
        var category = tabris.create("TextView", {
            layoutData: {
                left: 0,
                top: [title, 5],
                right: 0
            },
            alignment: "left",
            textColor: "#444"
        }).appendTo(card_info);
        var author = tabris.create("TextView", {
            layoutData: {
                left: 0,
                top: [category, 5],
                right: 0
            },
            alignment: "left",
            textColor: "#444"
        }).appendTo(card_info);
        var card_border = tabris.create("Composite", {
            layoutData: {
                top: [card_info, 8],
                left: [imageView, 0],
                right: 0,
                height: 1
            },
            background: "#eee"
        }).appendTo(card);
        var bottom_bar = tabris.create("Composite", {
            layoutData: {
                left: [imageView, 16],
                top: [card_border, 0],
                right: 16,
                bottom: 0
            }
        }).appendTo(card);
        var distance = tabris.create("TextView", {
            layoutData: {centerY: 0},
            alignment: "left",
            font: "16px",
            textColor: "#333"
        }).appendTo(bottom_bar);
        var more = tabris.create("TextView", {
            layoutData: {centerY: 0, right: 0},
            alignment: "right",
            font: "16px",
            textColor: "#FFA636",
            text: "ПОДРОБНЕЕ"
        }).appendTo(bottom_bar);
        card_info.appendTo(card);
        cell.on("change:item", function (widget, item) {
            imageView.set("image", {
                src: 'http://pkspots.com/uploads/images/spots/' + item.id + '/small/' + item.image_name
            });
            item.name ? title.set("text", item.name) : title.set("text", 'No Title');
            item.category ? category.set("text", item.category) : category.set("text", 'No Category');
            item.first_name ? author.set("text", item.first_name + ' ' + item.last_name) : author.set("text", 'nobody');
            distance.set("text", latlng2Distance(global.location.lat, global.location.lng, item.lat, item.lng)+ ' км');
            animateInFromBottom(widget, 200);
        });
    }
}).on("refresh", function () {
    loadItems();
}).appendTo(createTab("Вокруг"));
createTab("Лучшие");
createTab("Новости");
function getPosition() {
    fetch('http://www.geoplugin.net/json.gp').then(function (data) {
        data = JSON.parse(data._bodyInit);
        var lat = parseFloat(data.geoplugin_latitude);
        var lng = parseFloat(data.geoplugin_longitude);
        global.location = {lat: lat, lng: lng};
        getSpotsByLocation(lat, lng);
    })
}
var latlng2Distance = function (lat1, long1, lat2, long2) {
    var R = 6372795;
    lat1 *= Math.PI / 180;
    lat2 *= Math.PI / 180;
    long1 *= Math.PI / 180;
    long2 *= Math.PI / 180;
    var cl1 = Math.cos(lat1);
    var cl2 = Math.cos(lat2);
    var sl1 = Math.sin(lat1);
    var sl2 = Math.sin(lat2);
    var delta = long2 - long1;
    var cdelta = Math.cos(delta);
    var sdelta = Math.sin(delta);
    var y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
    var x = sl1 * sl2 + cl1 * cl2 * cdelta;
    var ad = Math.atan2(y, x);
    return (ad * R / 1000).toFixed(3);
};
function getSpotsByLocation(lat, lng) {
    var rad = 5000000;
    fetch('http://pkspots.com/API/spots/loc-and-radius/' + lat + '&' + lng + '&' + rad).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data)
        if (data && data.length < 1) {
            navigator.notification.alert(
                '?? ??????? ?????? ? ??????? ' + rad + '?',  // message
                null,         // callback
                '????',            // title
                'OK'               // buttonName
            );
        }
        else {
            for (i = 0; i < data.length; i++) {
                data[i].distance = latlng2Distance(lat, lng, data[i].lat, data[i].lng)
            }
            view.set({
                items: data,
                refreshIndicator: false,
                refreshMessage: "Refreshed"
            });
        }
    }).catch(function (ex) {
        console.log('parsing failed', ex)
    });
}
function loadItems() {
    view.set({
        refreshIndicator: true,
        refreshMessage: "loading..."
    });
    getPosition();
}
function animateInFromBottom(widget, delay) {
    widget.set({
        opacity: 0.0,
        transform: {translationY: 232}
    });
    widget.animate({
        opacity: 1.0,
        transform: {translationY: 0}
    }, {
        duration: 500,
        delay: delay,
        easing: "ease-out"
    });
}
loadItems();
tabris.create("PageSelector").appendTo(drawer);
page.open();
