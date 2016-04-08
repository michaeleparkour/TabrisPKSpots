module.exports = function(context) {

    var pluginlist = ["cordova-plugin-mapbox --variable ACCESS_TOKEN="+process.env.ACCESS_TOKEN];

    var sys = require('sys');
    var exec = require('child_process').exec;

    function puts(error, stdout, stderr) {
        sys.puts(stdout)
    }

    pluginlist.forEach(function(plug) {
        exec("cordova plugin add " + plug, puts);
    });
};