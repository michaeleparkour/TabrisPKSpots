var scaleFactor = tabris.device.get("scaleFactor");
function getIcon(name, size, color) {
    var path = 'www/img/icons/' + scaleFactor + 'x/';
    size = size || '24';
    color = color || 'white';
    return path + 'ic_'+ name + '_'+ color + '_' + size + 'dp' + '.png';
}
function getIconSrc(name, size, color) {
    size = size || '24';
    color = color || 'white';
    var uri = getIcon(name, size, color);
    return {src: uri, scale: 1}
}
module.exports = {
    getIcon : getIcon,
    getIconSrc: getIconSrc
};