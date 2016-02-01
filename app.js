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
//AndroidFullScreen.immersiveMode();
tabris.ui.set('background', '#2962FF');
var drawer = tabris.create("Drawer", {
    layoutData: {
        width: 100
    }
});
var userComp = tabris.create('Composite',{
    layoutData: {top: 0, height: 136, left: 0, right: 0}
}).appendTo(drawer);
var imageView = tabris.create("ImageView", {
    image: '/img/user_background.jpg',
    background: "rgb(220, 220, 220)",
    scaleMode: 'fill',
    layoutData: {top: 0, bottom: 0, right: 0, left: 0}
}).appendTo(userComp);
var logIn = tabris.create("Button", {
    classname: "",
    layoutData: {centerY: 0, centerX:0},
    font: "16px",
    background: "#2962FF",
    textColor: "#FFFFFF",
    text: "Войти"
}).appendTo(userComp);
logIn.on('select', function(){
    drawer.close();
    require("./pages/login-page.js").create().open();
});
tabris.create("PageSelector",{layoutData: {top: userComp}}).appendTo(drawer);
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
