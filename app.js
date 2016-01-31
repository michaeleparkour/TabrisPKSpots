Promise = require("promise");
require("whatwg-fetch");
require("./scripts/utils.js");
window.global = {location:{radius: 500000}};
var callbackFn = function(location) {
    console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
    myUtils.extend(global.location, location);
    backgroundGeoLocation.finish();
};
var failureFn = function(error) {
    console.log('BackgroundGeoLocation error');
};
backgroundGeoLocation.configure(callbackFn, failureFn, {
    desiredAccuracy: 1000,
    notificationIconColor: '#4CAF50',
    notificationTitle: 'Background tracking',
    notificationText: 'ENABLED',
    notificationIcon: 'notification_icon',
    debug: false,
    stopOnTerminate: true,
    interval: 30000,
    fastestInterval: 60000
});
backgroundGeoLocation.start();
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
/*
var options = {
    date: new Date(),
    titleText: 'Trololo',
    mode: 'datetime',
    is24Hour: true,
    androidTheme: 5
};

function onSuccess(date) {
    console.log('Selected date: ' + date);
}

function onError(error) { // Android only
    console.log('Error: ' + error);
}

datePicker.show(options, onSuccess, onError);*/
