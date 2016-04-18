exports.create = function (page) {
    var scrollComp = new tabris.ScrollView({
        id: "scrollForm",
        layoutData: {top: 0, bottom: 0, left: 0, right: 0}
    }).appendTo(page);
    var imageComposite = new tabris.Composite({
        layoutData: {top: 0, left: 0, right: 0, height: 230}
    }).appendTo(scrollComp);
    var spot_image = new tabris.ImageView({
        layoutData: {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        },
        image: '../img/placeholder-image.gif',
        scaleMode: 'fill',
        background: '#ccc'
    }).appendTo(imageComposite);
    var fab = require("../partials/fab-button.js").create();
    fab.set('layoutData', {top:[imageComposite, -28], right: 16}).on("tap",function () {
        takePic();
    }).appendTo(scrollComp);
    if (navigator.camera) {
        var takePic = function () {
            var options = {
                quality: 75,
                destinationType: 1,
                sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
                targetWidth: 1200,
                targetHeight: 1600,
                correctOrientation: true,
                encodingType: 0     // 0=JPG 1=PNG
            };
            navigator.camera.getPicture(onSuccess, onFail, options);
        };
        var takeFromGallery = function () {
            var options = {
                quality: 75,
                destinationType: 2,
                sourceType: 2,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
                correctOrientation: true,
                encodingType: 0     // 0=JPG 1=PNG
            };
            navigator.camera.getPicture(onSuccess, onFail, options);
        };
    }
    var onSuccess = function (DATA_URL) {
        console.log(tabris.app.getResourceLocation(DATA_URL))
        spot_image.set('image', DATA_URL)
    };
    var onFail = function (e) {
        navigator.notification.alert(
            'Ошибка: ' + e,  // message
            null,         // callback
            'Ошибка',            // title
            'OK'                  // buttonName
        );
        console.log("Ошибка: " + e);
    };
    var formComposite = new tabris.Composite({
        layoutData: {top: [imageComposite, 10], left: 0, right: 0}
    }).appendTo(scrollComp);
    var form = new tabris.Composite({
        id: "form",
        layoutData: {top: 0, left: 30, right: 30}
    }).appendTo(formComposite);
    new tabris.TextView({
        id: "spotNameLabel",
        alignment: "left",
        layoutData: {
            top: "prev() 20"
        },
        text: "Spot Title:"
    }).appendTo(form);
    var spot_name = new tabris.TextInput({
        id: "spotNameInput",
        class: "full-width",
        message: "Spot title",
        keyboard: "default"
    }).appendTo(form);
    var spot_name_message = new tabris.TextView({
        id: "spotNameMessage",
        class: "full-width",
        alignment: "center",
        text: "",
        font: "10px"
    }).appendTo(form);
    new tabris.TextView({
        id: "spotCategoryLabel",
        layoutData: {
            top: "prev() 50"
        },
        alignment: "left",
        text: "Spot Category:"
    }).appendTo(form);
    var spot_category = new tabris.Picker({
        id: "spotCategoryInput",
        class: "full-width",
        itemText: function (item) {
            return item.name;
        }
    }).appendTo(form);
    new tabris.TextView({
        id: "spotDescrLabel",
        layoutData: {
            top: "prev() 50"
        },
        alignment: "left",
        text: "Spot Description:"
    }).appendTo(form);
    var spot_descr = new tabris.TextInput({
        id: "spotDescrInput",
        class: "full-width",
        message: "Few words about spot",
        keyboard: "default",
        type: "multiline"
    }).appendTo(form);
    var spot_descr_message = new tabris.TextView({
        id: "spotDescrMessage",
        class: "full-width",
        alignment: "center",
        text: "",
        font: "10px"
    }).appendTo(form);
    var formData = {};
    var submitButton = new tabris.Button({
        class: "full-width",
        text: "Next",
        disabled: true,
        background: "rgba(41, 98, 255, 0.6)",
        startBackground: "#2962FF",
        textColor: "white"
    }).on("select", function (widget) {
        if (widget.get('disabled')) return false;
        widget.set('background', 'rgba(41, 98, 255, 0.6)');
        window.setTimeout(function () {
            widget.set('background', widget.get('startBackground'));
        }, 100);
        scrollComp.trigger('next-section', formData);
    }).appendTo(form);
    page.apply({
        ".full-width": {layoutData: {top: "prev() 5", left: 0, right: 0}}
    });
    var validateForm = function () {
        var constraints = {
            spot_name: {
                presence: true,
                length: {
                    minimum: 5,
                    tooShort: "needs to have %{count} characters or more"
                }
            },
            spot_description: {
                presence: true,
                length: {
                    minimum: 5,
                    tooShort: "needs to have %{count} characters or more"
                }
            }
        };
        formData = {
            spot_name: spot_name.get('text'),
            spot_description: spot_descr.get('text')
        };
        var validation = validate(formData, constraints);
        if (validation && validation.spot_name) {
            spot_name.set('background', '#ff0000');
            spot_name_message.set('text', validation.spot_name);
        } else {
            spot_name.set('background', '#00cccc');
            spot_name_message.set('text', '');
        }
        if (validation && validation.spot_description) {
            spot_descr.set('background', '#ff0000');
            spot_descr_message.set('text', validation.spot_description);
        } else {
            spot_descr.set('background', '#00cccc');
            spot_descr_message.set('text', '');
        }
        if (validation) {
            if (validation.spot_name || validation.spot_description) {
                submitButton.set('disabled', true);
                submitButton.set('background', "rgba(41, 98, 255, 0.6)");
            }
        } else {
            submitButton.set('disabled', false);
            submitButton.set('background', submitButton.get('startBackground'));
        }
    };
    spot_name.on('change:text', validateForm);
    spot_descr.on('change:text', validateForm);
    spot_category.on('select', function (widget, selection) {
        formData.spot_category = selection.id;
    });
    spot_name.on('blur', validateForm);
    spot_descr.on('blur', validateForm);
    PKSpots.API.getDefCategories().then(function (response) {
        return response.json();
    }).then(function (data) {
        spot_category.set('items', data);
    });
    validateForm();
/*    var formCompositeY = 0;
    scrollComp.on("scroll", function(widget, offset) {
        imageComposite.set("transform", {translationY: Math.max(0, offset.y * 0.2)});
        formComposite.set("transform", {translationY: Math.max(0, offset.y - formCompositeY)});
    });
    scrollComp.on("resize", function(widget, bounds) {
        var formCompositeHeight = formComposite.get("height");
        formCompositeY = Math.min(260 + formCompositeHeight, 260);
        formComposite.set("top", formCompositeY)
    });*/
    return scrollComp;
};