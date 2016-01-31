exports.create = function () {
    var page = tabris.create("Page", {
        title: "Главная",
        topLevel: true
    }).once('appear', createMainPage);

    function createMainPage() {
        function showSpots(data) {
            for (i = 0; i < data.length; i++) {
                data[i].distance = myUtils.latlng2Distance(global.location.lat, global.location.lng, data[i].lat, data[i].lng)
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
            PKSpots.API.getSpotsByLocationAndRadius(global.location.lat, global.location.lng, global.location.radius).then(function (response) {
                return response.json()
            }).then(function (data) {
                if (data && data.length < 1) {
                    navigator.notification.alert(
                        'Не найдено спотов в радиусе ' + global.location.radius + 'км',
                        null,
                        'Сообщение',
                        'OK'
                    );
                } else {
                    showSpots(data);
                }
            }).catch(function (ex) {
                console.log('parsing failed', ex)
            });
        }

        function loadItems() {
            around.set({
                refreshIndicator: true,
                refreshMessage: "loading..."
            });
            myUtils.getPosition().then(function (location) {
                var lat = parseFloat(location[0]);
                var lng = parseFloat(location[1]);
                global.location = {lat: lat, lng: lng, radius: 500000};
                console.log(lat, lng);
                lat && lng && getSpots();
            }).catch(function () {
                myUtils.getPositionByIp().then(function (data) {
                    data = JSON.parse(data._bodyInit);
                    var lat = parseFloat(data.geoplugin_latitude);
                    var lng = parseFloat(data.geoplugin_longitude);
                    global.location = {lat: lat, lng: lng, radius: 2000};
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