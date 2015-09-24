Promise = require("promise");
require("whatwg-fetch");

var page = tabris.create("Page", {
    title: "PKSpots",
    topLevel: true
});
var mapPage = require("./pages/general-map");
mapPage.create();
var calendarPage = require("./pages/calendar");
calendarPage.create();
var drawer = tabris.create("Drawer");
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
        var imageView = tabris.create("ImageView", {
            layoutData: {
                top: 0,
                left: 0,
                width: 100,
                bottom: 0
            },
            scaleMode: 'fill'
        }).appendTo(cell);
        var textView = tabris.create("TextView", {
            layoutData: {
                left: [imageView, 30],
                top: [cell, 5],
                right: 30
            },
            alignment: "center",
            font: "16px Roboto, sans-serif",
            textColor: "#000"
        }).appendTo(cell);
        cell.on("change:item", function (widget, item) {
            imageView.set("image", {
                src: 'http://pkspots.com/uploads/images/spots/' + item.id + '/small/' + item.image_name
            });
            item.name ? textView.set("text", item.name) : textView.set("text", 'No Title');
            animateInFromRight(widget, 200);
        });
    }
}).on("refresh", function () {
    loadItems();
}).appendTo(page);
function getPosition() {
    navigator.geolocation.getCurrentPosition(function (location) {
        var lat = parseFloat(location.coords.latitude);
        var lng = parseFloat(location.coords.longitude);
        console.log(lat, lng);
        getSpotsByLocation(lat, lng);
    }, function (err) {
        navigator.notification.alert(
            'Не удалось определить местоположение: ' + JSON.stringify(err),  // message
            null,         // callback
            'Ошибка',            // title
            'OK'                  // buttonName
        );
    });
}
var latlng2Distance = function (lat1, long1, lat2, long2) {
    //радиус Земли
    var R = 6372795;

    //перевод коордитат в радианы
    lat1 *= Math.PI / 180;
    lat2 *= Math.PI / 180;
    long1 *= Math.PI / 180;
    long2 *= Math.PI / 180;

    //вычисление косинусов и синусов широт и разницы долгот
    var cl1 = Math.cos(lat1);
    var cl2 = Math.cos(lat2);
    var sl1 = Math.sin(lat1);
    var sl2 = Math.sin(lat2);
    var delta = long2 - long1;
    var cdelta = Math.cos(delta);
    var sdelta = Math.sin(delta);

    //вычисления длины большого круга
    var y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
    var x = sl1 * sl2 + cl1 * cl2 * cdelta;
    var ad = Math.atan2(y, x);
    return (ad * R / 1000).toFixed(3); //расстояние между двумя координатами в метрах
};
function getSpotsByLocation(lat, lng) {
    var rad = 3000;
    fetch('http://pkspots.com/API/spots/loc-and-radius/' + lat + '&' + lng + '&' + rad).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data)
        if (data && data.length < 1) {
            navigator.notification.alert(
                'Не найдено спотов в радиусе ' + rad + 'м',  // message
                null,         // callback
                'Инфо',            // title
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
    console.log(navigator)
    //getPosition();
}

function animateInFromRight(widget, delay) {
    widget.set({
        opacity: 0.0,
        transform: {translationX: 132}
    });
    widget.animate({
        opacity: 1.0,
        transform: {translationX: 0}
    }, {
        duration: 500,
        delay: delay,
        easing: "ease-out"
    });
}

loadItems();
tabris.create("PageSelector").appendTo(drawer);
page.open();
