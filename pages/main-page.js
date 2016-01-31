exports.create = function () {
    var page = tabris.create("Page", {
        title: "Главная",
        topLevel: true
    }).once('appear', createMainPage);

    function createMainPage() {
        function showSpots(data) {
            for (i = 0; i < data.length; i++) {
                data[i].distance = myUtils.latlng2Distance(global.location.latitude, global.location.longitude, data[i].lat, data[i].lng)
            }
            around.set({
                items: data.sort(function (item1, item2) {
                    return item1.distance - item2.distance;
                }),
                refreshIndicator: false
            });
            best.set({
                items: data.sort(function (item1, item2) {
                    return item1.rating - item2.rating;
                })
            })
        }

        function getSpots() {
            console.log(global.location.latitude, global.location.longitude, global.location.radius);
            PKSpots.API.getSpotsByLocationAndRadius(global.location.latitude, global.location.longitude, global.location.radius).then(function (response) {
                return response.json()
            }).then(function (data) {
                if (data && data.length < 1) {
                    navigator.notification.alert(
                        'Не найдено спотов в радиусе ' + global.location.radius + 'км',
                        null,
                        'Сообщение',
                        'OK'
                    );
                    around.set({
                        refreshIndicator: false
                    });
                } else {
                    showSpots(data);
                }
            }).catch(function (ex) {
                console.log('parsing failed bb', ex);
                around.set({
                    refreshIndicator: false
                });
            });
        }

        function loadItems() {
            around.set({
                refreshIndicator: true,
                refreshMessage: "loading..."
            });
            myUtils.getPosition().then(function () {
                getSpots();
            }).catch(function () {
                myUtils.getPositionByIp().then(function (data) {
                    data = JSON.parse(data._bodyInit);
                    var lat = parseFloat(data.geoplugin_latitude);
                    var lng = parseFloat(data.geoplugin_longitude);
                    global.location.latitude = lat;
                    global.location.longitude = lng;
                    global.location.radius= 500000;
                    getSpots();
                }).catch(function (err) {
                    console.log(err)
                })
            })
        }

        var tabFolder = tabris.create("TabFolder", {
            id: "mainTab",
            layoutData: {left: 0, top: 0, right: 0, bottom: 0},
            paging: true,
            tabBarLocation: 'top',
            background: "#2962FF",
            textColor: "#ffffff"
        }).appendTo(page);
        var createTab = function (title) {
            return tabris.create("Tab", {
                title: title,
                background: "#eee"
            }).appendTo(tabFolder);
        };
        var around = require("../partials/spots-around.js").create().appendTo(createTab("Вокруг"));
        around.on('refresh', loadItems);
        var best = require("../partials/spots-around.js").create().appendTo(createTab("Лучшие"));
        best.set('refreshEnabled', false);
        createTab("Новости");
        setTimeout(loadItems, 200);
    }

    return page
};