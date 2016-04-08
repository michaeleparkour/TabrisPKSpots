module.exports = function(context) {

    var pluginlist = ["https://github.com/michaeleparkour/Mapbox.git --variable ACCESS_TOKEN="+process.env.ACCESS_TOKEN];

    var sys = require('sys');
    var exec = require('child_process').exec;

    function puts(error, stdout, stderr) {
        sys.puts(stdout)
    }

    pluginlist.forEach(function(plug) {
        exec("cordova plugin add " + plug, puts);
        console.log('plugin added:')
    });
};