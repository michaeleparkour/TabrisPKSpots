exports.create = function () {
    var page = new tabris.Page({
        title: "Добавить спот",
        topLevel: true
    }).once('appear', createAddSpotPage);

    function createAddSpotPage() {
        var user = JSON.parse(localStorage.getItem('user'));
        if (!user) return false;
        var formData = {
            user_id: user.id,
            api_key: user.api_key
        };
        var spot_form = require("../partials/add-spot-form.js").create(page, formData);
        var spot_image = require("../partials/add-spot-image.js");
        spot_form.on('next-section', function (data) {
            formData = myUtils.extend(formData, data);
            nextSection();
        });
        function nextSection() {
            console.log(formData);
            spot_image = spot_image.create(page, formData);
            spot_form.animate({
                opacity: 0,
                transform: {translationX: -300}
            }, {
                duration: 500,
                delay: 0,
                easing: "ease-in-out"
            });
            spot_image.animate({
                opacity: 1,
                transform: {translationX: 0}
            }, {
                duration: 500,
                delay: 0,
                easing: "ease-in-out"
            });
        }
    }

    return page;
};