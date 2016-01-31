window.myUtils = {
    extend: function(obj, src) {
        Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
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
    getPosition: function() { return new Promise(function(resolve, reject) {
            if (window.plugins && window.plugins.GPSLocator){
                window.plugins.GPSLocator.getLocation(function (location) {
                    resolve(location);
                }, function (err) {
                    reject(err);
                });
            } else {
                reject(false);
            }
        })},
    getPositionByIp: function(){
        return fetch('http://www.geoplugin.net/json.gp');
    }
};
window.PKSpots = {
    API: {
        getSpotsByLocationAndRadius : function (lat, lng, rad) {
            return fetch('http://pkspots.com/API/spots/loc-and-radius/' + lat + '&' + lng + '&' + rad);
        }
    }
};