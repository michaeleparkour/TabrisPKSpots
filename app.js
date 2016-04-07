validate = require("./node_modules/validate.js/");
require("./scripts/utils.js");
getIconSrc = require("./scripts/icons.js").getIconSrc;
getIcon = require("./scripts/icons.js").getIcon;
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
tabris.ui.set('displayMode', 'fullscreen');
var drawer = new tabris.Drawer({
    layoutData: {
        width: 50
    },
    background: "rgb(220, 220, 220)"
});
function initUser() {
    userComp = new tabris.Composite({
        layoutData: {top: 0, height: 136, left: 0, right: 0}
    }).appendTo(drawer);
    var imageView = new tabris.ImageView({
        image: 'img/user_background.jpg',
        background: "rgb(220, 220, 220)",
        scaleMode: 'fill',
        layoutData: {top: 0, bottom: 0, right: 0, left: 0},
        elevation: 8,
        cornerRadius: 100
    }).appendTo(userComp);
    var user = JSON.parse(localStorage.getItem('user'));
    var avatar_source = user && user.avatar ? 'http://pkspots.com/uploads/users/' + user.id + '/small-' + user.avatar : 'img/profile_noimage.gif';
    var avatar = new tabris.ImageView({
        layoutData: {
            centerY: 0,
            left: 10,
            width: 76
        },
        image: avatar_source,
        scaleMode: "fill",
        cornerRadius: 50
    }).appendTo(userComp);
    var logIn = new tabris.Button({
        classname: "",
        layoutData: {centerY: 0, centerX:0},
        font: "16px",
        background: "#2962FF",
        textColor: "#FFFFFF",
        text: "Войти"
    }).appendTo(userComp);
    userComp.on('tap', function(){
        drawer.close();
        require("./pages/login-page.js").create().open();
    });
}
initUser();
tabris.app.on('user:updated', initUser);
var pageSelector = new tabris.PageSelector({layoutData: {top: userComp}}).appendTo(drawer);
var main_page = require("./pages/main-page.js").create().open();
var map_page = require("./pages/gen-map.js").create();
var add_spot_page = require("./pages/add-spot-page.js").create();
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
