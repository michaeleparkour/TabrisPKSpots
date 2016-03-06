window.myUtils = {
    extend: function (obj, src) {
        Object.keys(src).forEach(function (key) {
            obj[key] = src[key];
        });
        return obj;
    },
    latlng2Distance: function (lat1, long1, lat2, long2) {
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
    },
    getPosition: function () {
        return new Promise(function (resolve, reject) {
            if (window.plugins && window.plugins.GPSLocator){
                window.plugins.GPSLocator.getLocation(function (location) {
                    resolve({coords:{latitude: location[0], longitude: location[1]}});
                }, function (err) {
                    reject(err);
                });
            } else if(global.location.latitude && global.location.longitude) {
                resolve(true);
            } else {
                reject(false);
            }
        })
    },
    getPositionByIp: function () {
        return fetch('http://www.geoplugin.net/json.gp');
    }
};
window.PKSpots = {
    API: {
        getSpotsByLocationAndRadius: function (lat, lng, rad) {
            return fetch('http://pkspots.com/API/spots/loc-and-radius/' + lat + '&' + lng + '&' + rad);
        },
        checkAuth: function (user) {
            return fetch('https://pkspots.com/API/user/check-auth', {method: 'post', body: user});
        },
        getShortUserInfo: function (user_id) {
            return fetch('http://pkspots.com/API/user/short-info/' + user_id);
        },
        getMarkersByRegion: function (bounds) {
            return fetch('http://pkspots.com/API/spots/location', {method: 'post', body: JSON.stringify(bounds)});
        },

        getSpotsByUser: function (id) {
            return fetch('http://pkspots.com/API//spots/user/' + id);
        },
        registerUser: function (user) {
            return fetch('https://pkspots.com/API/user/register', {method: 'post', body: user});
        },
        loginUser: function (user) {
            return fetch('https://pkspots.com/API/user/login', {method: 'post', body: user});
        },
        updateUser: function (user) {
            return fetch('https://pkspots.com/API/user/update', {method: 'post', body: user});
        },
        getDefCategories: function () {
            return fetch('http://pkspots.com/API/getdefaultcategories');
        },
        getSpotRating: function (spot_id) {
            return fetch('http://pkspots.com/API/get-rating/' + spot_id);
        },
        getSpotTraining: function (spot_id) {
            return fetch('http://pkspots.com/API/get-training/' + spot_id);
        },
        getSpotRatingByUser: function (spot_id, user_id) {
            return fetch('http://pkspots.com/API/get-rating/' + spot_id + '/' + user_id);
        },
        getSpotTrainingByUser: function (spot_id, user_id) {
            return fetch('http://pkspots.com/API/get-training/' + spot_id + '/' + user_id);
        },
        addSpotRating: function (review) {
            return fetch('https://pkspots.com/API/add-rating', {method: 'post', body: review});
        },
        addSpotTraining: function (training) {
            return fetch('https://pkspots.com/API/add-training', {method: 'post', body: training});
        },
        addSpot: function (formData) {
            return fetch('https://pkspots.com/API/addspot', {method: 'post', body: formData});
        },
        getCityName: function (url) {
            return fetch(url);
        },
        getSpotsByCity: function (city) {
            return fetch('http://pkspots.com/API/spots/search/' + city);
        },
        addSpotImage: function (formData) {
            return fetch('http://pkspots.com/API/spot/add-spot-img', {method: 'post', body: formData});
        }
    }
};