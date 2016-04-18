exports.create = function (page, formData) {
    var imageComposite = new tabris.Composite({
        layoutData: {top: 0, left: 0, right: 0, height: 260}
    }).appendTo(page);
    var image = new tabris.ImageView({
        layoutData: {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        },
        image: '../img/placeholder-image.gif',
        background: '#ccc'
    }).appendTo(imageComposite);
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