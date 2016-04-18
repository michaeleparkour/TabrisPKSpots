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
        spot_form.on('next-section', function (data) {
            formData = myUtils.extend(formData, data);
            nextSection();
        });
        function nextSection() {

        }
    }
    return page;
};