exports.create = function () {
    var page = tabris.create("Page", {
        title: "Map",
        topLevel: true
    }).once('appear', createMapPage);
    function createMapPage() {
        var webview = tabris.create("WebView", {
            layoutData: {left: 0, top: 0, right: 0, bottom: 0},
            url: tabris.app.getResourceLocation('./pages/general-map.html') + '?' + new Date().getTime()
        }).on("load", function (widget) {

        }).on("navigate", function(wid, e){
            e.preventDefault();
            wid.dispose();
            page.close();
            var o = {
                lat: myUtils.getParameterFromUrl(e.url, 'lat'),
                lng: myUtils.getParameterFromUrl(e.url, 'lng'),
                address: myUtils.getParameterFromUrl(e.url, 'address')
            };
            console.log(o)
        }).on('resize', function () {

        }).appendTo(page);
        var script = "window.user_location = " + JSON.stringify(window.global.location,function(key, value) {
                if (typeof value === 'number') {
                    return ''+ value;
                }
                return value;
            });
        webview._nativeCall("evaluate", {script: script});
    }
};
