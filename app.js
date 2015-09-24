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
    initializeCell: function(cell) {
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
        cell.on("change:item", function(widget, item) {
            imageView.set("image", {
                src: 'http://pkspots.com/uploads/images/spots/' + item.id + '/small/' + item.image_name
            });
            item.name ? textView.set("text", item.name) : textView.set("text", 'No Title');
            animateInFromRight(widget, 200);
        });
    }
}).on("refresh", function() {
    loadItems();
}).appendTo(page);

function loadItems() {
    view.set({
        refreshIndicator: true,
        refreshMessage: "loading..."
    });
    fetch("http://pkspots.com/API/spots").then(function(response) {
        return response.json();
    }).then(function(json){
        if (json) {
            view.set({
                items: json,
                refreshIndicator: false,
                refreshMessage: "Refreshed"
            });
        } else {
            navigator.notification.alert('Nothing found with', null, 'Result');
            view.set({
                refreshIndicator: false,
                refreshMessage: "Refreshed"
            });
        }
    }).catch(function(ex) {
        console.log('parsing failed', ex)
    });
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
