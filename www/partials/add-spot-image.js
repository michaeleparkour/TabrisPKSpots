exports.create = function (page, formData) {
    var imageComposite = new tabris.Composite({
        layoutData: {top: 0, left: 0, right: 0, bottom: 0},
        transform: {translationX: 300},
        opacity: 0
    }).appendTo(page);
    var image_form = new tabris.Composite({
        layoutData: {top: 50, left: 30, right: 30}
    }).appendTo(imageComposite);
    new tabris.TextView({
        alignment: "center",
        text: formData.spot_name,
        font: "bold 24px",
        class: "full-width"
    }).appendTo(imageComposite);
    return imageComposite;
};