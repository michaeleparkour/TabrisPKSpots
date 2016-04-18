exports.create = function (icon) {
    icon = icon || 'home';
    var fab = new tabris.Composite({
        width: 56,
        height: 56,
        elevation: 6,
        highlightOnTouch: true
    }).on("touchstart", function (widget) {
        widget.animate({transform: {translationZ: 6}}, {duration: 100, easing: "ease-out"});
    }).on("touchend", function (widget) {
        widget.animate({transform: {translationZ: 0}}, {duration: 100, easing: "ease-out"});
    });
    new tabris.ImageView({
        width: 56,
        height: 56,
        centerX: 0,
        centerY:0,
        image: {src: 'img/icons/fab3x.png', scale: 1}
    }).appendTo(fab);
    new tabris.ImageView({
        width: 24,
        height: 24,
        centerX: 0,
        centerY:0,
        image: getIconSrc(icon, '24', 'white')
    }).appendTo(fab);
    return fab;
};