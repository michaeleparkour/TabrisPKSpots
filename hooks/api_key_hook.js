module.exports = function(context) {
    var cordova_util = context.requireCordovaModule("cordova-lib/src/cordova/util");
    var ConfigParser = context.requireCordovaModule("cordova-lib/src/configparser/ConfigParser");
    var projectRoot = cordova_util.isCordova();
    var xml = cordova_util.projectConfig(projectRoot);
    var cfg = new ConfigParser(xml);

    cfg.doc
        .findall("plugin/[@name=https://github.com/Telerik-Verified-Plugins/Mapbox']")[0]
        .findall("variable/[@name='ACCESS_TOKEN']")[0]
        .set("value", process.env.ACCESS_TOKEN);

    console.log(
        "Setting ACCESS_TOKEN to: " +
        cfg.doc
            .findall("plugin/[@name='https://github.com/Telerik-Verified-Plugins/Mapbox']")[0]
            .findall("variable/[@name='ACCESS_TOKEN']")[0]
            .get("value")
    );

    cfg.write();
};