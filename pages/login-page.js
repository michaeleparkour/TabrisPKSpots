exports.create = function () {
    var page = tabris.create("Page", {
        title: "Вход"
    }).once('appear', createLoginPage);

    function createLoginPage() {
        var scrollComp = tabris.create("ScrollView", {
            id: "scrollForm",
            layoutData: {top: 0, bottom: 0, left: 0, right: 0}
        }).appendTo(page);
        var form = tabris.create("Composite", {
            id: "form",
            layoutData: {top: 50, left: 30, right: 30}
        }).appendTo(scrollComp);
        tabris.create("TextView", {
            id: "loginHeader",
            alignment: "center",
            text: "Войти",
            font: "bold 24px",
            layoutData: {left: 0, right: 0}
        }).appendTo(form);
        tabris.create("TextView", {
            id: "userEmailLabel",
            alignment: "left",
            text: "Email:"
        }).appendTo(form);
        tabris.create("TextInput", {
            id: "userEmailInput",
            message: "name@domain.com"
        }).appendTo(form);
        tabris.create("TextView", {
            id: "userPassLabel",
            alignment: "left",
            text: "Password:"
        }).appendTo(form);
        tabris.create("TextInput", {
            id: "userPassInput",
            type: "password",
            message: "Passphrase"
        }).appendTo(form);
        tabris.create("Button", {
            id: "loginFormSubmit",
            text: "Sumbit",
            background: "#2962FF",
            highlightOnTouch: true,
            textColor: "white"
        }).on("select", function() {

        }).appendTo(form);
        page.apply({
            "#userEmailLabel": {layoutData: {top: "#loginHeader 50", left: 0, right: 0}},
            "#userEmailInput": {layoutData: {top: "#userEmailLabel 10", left: 0, right: 0}},
            "#userPassLabel": {layoutData: {top: "#userEmailInput 10", left: 0, right: 0}},
            "#userPassInput": {layoutData: {top: "#userPassLabel 10", left: 0, right: 0}},
            "#loginFormSubmit": {layoutData: {top: "#userPassInput 10", left: 0, right: 0}}
        });
    }

    return page
};