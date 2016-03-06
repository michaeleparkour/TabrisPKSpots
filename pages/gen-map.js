exports.create = function () {
    var page = tabris.create("Page", {
        title: "Map",
        topLevel: true
    }).once('appear', createMapPage);
    function createMapPage() {
        var webview = tabris.create("WebView", {
            layoutData: {left: 0, top: 0, right: 0, bottom: 0},
            url: tabris.app.getResourceLocation('pages/general-map.html') + '?' + new Date().getTime()
        }).on("load", function (widget) {
            var height = parseInt(screen.height-76);
            var script = '(function() {document.body.style.height = "' + height + 'px";'+
            'L.mapbox.accessToken = "pk.eyJ1IjoibWljaGFlbGVwYXJrb3VyIiwiYSI6ImNpanYyN2l0NDAwMjB1OW00NTBkY3F4Y3gifQ.Pom1NlIj8kR-U8WGNaWcrA";'+
            'var map = L.mapbox.map("map", "mapbox.streets").setView(['+global.location.latitude+', '+global.location.longitude+'], 14);var marker = L.userMarker(['+global.location.latitude+', '+global.location.longitude+'],{pulsing:true, accuracy:100, smallIcon:true}).addTo(map);'+
                'init(map)}())';
            this._nativeCall("evaluate", {script: script});
        }).appendTo(page);
    }
};
