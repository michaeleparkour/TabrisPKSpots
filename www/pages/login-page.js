exports.create = function () {
    var page = new tabris.Page({
        title: "Вход"
    }).once('appear', createLoginPage);

    function createLoginPage() {
        var scrollComp = new tabris.ScrollView({
            id: "scrollForm",
            layoutData: {top: 0, bottom: 0, left: 0, right: 0}
        }).appendTo(page);
        var checkLogin = function () {
            var user = JSON.parse(localStorage.getItem('user'));
            user && console.log(user.id);
            if (user) {
                if (user.id && user.api_key) {
                    page.find('#form').length && page.find('#form')[0].dispose();
                    createProfile(user);
                    tabris.app.trigger('user:updated');
                }
                else {
                    localStorage.removeItem('user');
                    tabris.app.trigger('user:updated');
                    page.find('#profile').length && page.find('#profile')[0].dispose();
                    createForm();
                }
            }
            else {
                localStorage.removeItem('user');
                tabris.app.trigger('user:updated');
                page.find('#profile').length && page.find('#profile')[0].dispose();
                createForm();
            }
        };
        var createForm = function () {
            var formData = {};
            var form = new tabris.Composite({
                id: "form",
                layoutData: {top: 50, left: 30, right: 30}
            }).appendTo(scrollComp);
            new tabris.TextView({
                id: "loginHeader",
                alignment: "center",
                text: "Войти",
                font: "bold 24px",
                layoutData: {left: 0, right: 0}
            }).appendTo(form);
            new tabris.TextView({
                id: "userEmailLabel",
                alignment: "left",
                text: "Email:"
            }).appendTo(form);
            var user_email = new tabris.TextInput({
                id: "userEmailInput",
                message: "name@domain.com",
                keyboard: "email"
            }).appendTo(form);
            var email_message = new tabris.TextView({
                id: "emailMessage",
                alignment: "center",
                text: "",
                font: "10px",
                layoutData: {top: [user_email, 5], left: 0, right: 0}
            }).appendTo(form);
            new tabris.TextView({
                id: "userPassLabel",
                alignment: "left",
                text: "Password:"
            }).appendTo(form);
            var user_pass = new tabris.TextInput({
                id: "userPassInput",
                type: "password",
                message: "Passphrase"
            }).appendTo(form);
            var pass_message = new tabris.TextView({
                id: "passMessage",
                alignment: "center",
                text: "",
                font: "10px",
                layoutData: {top: [user_pass, 5], left: 0, right: 0}
            }).appendTo(form);

            function submitForm() {
                var register_user = {
                    user_email: user_email.get('text'),
                    pass: user_pass.get('text')
                };
                if (!already_signed.get('selection')) {
                    PKSpots.API.registerUser(JSON.stringify(register_user)).then(function (response) {
                        return response.json();
                    }).then(function (data) {
                        if (data.user && data.user.api_key) {
                            localStorage.setItem('user', JSON.stringify(data.user));
                            checkLogin();
                            if (window.plugins.toast && data.text) {
                                window.plugins.toast.showShortCenter(data.text);
                            }
                        } else if (data.error) {
                            navigator.notification.alert(
                                data.message,  // message
                                null,         // callback
                                'Ошибка',            // title
                                'OK'                  // buttonName
                            );
                        } else {
                            console.log(data)
                        }
                    }).catch(function (error) {
                        console.log(error.message)
                        navigator.notification.alert(
                            error.message,  // message
                            null,         // callback
                            'Ошибка',            // title
                            'OK'                  // buttonName
                        );
                    });
                } else {
                    PKSpots.API.loginUser(JSON.stringify(register_user)).then(function (response) {
                        return response.json();
                    }).then(function (data) {
                        if (data.user && data.user.api_key) {
                            localStorage.setItem('user', JSON.stringify(data.user));
                            checkLogin();
                            if (window.plugins.toast && data.text) {
                                window.plugins.toast.showShortCenter(data.text);
                            }
                            console.log(data.user);
                        } else if (data.error) {
                            navigator.notification.alert(
                                data.message,  // message
                                null,         // callback
                                'Ошибка',            // title
                                'OK'                  // buttonName
                            );
                        } else {
                            console.log(data)
                        }
                    }).catch(function (error) {
                        console.log(error.message)
                        navigator.notification.alert(
                            error.message,  // message
                            null,         // callback
                            'Ошибка',            // title
                            'OK'                  // buttonName
                        );
                    });
                }
            }

            var submitButton = new tabris.Button({
                id: "loginFormSubmit",
                text: "Sumbit",
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
                submitForm();
            }).appendTo(form);
            var already_signed = new tabris.CheckBox({
                id: "alreadySigned",
                text: "Already signed?"
            }).appendTo(form);
            page.apply({
                "#userEmailLabel": {layoutData: {top: "#loginHeader 50", left: 0, right: 0}},
                "#userEmailInput": {layoutData: {top: "#userEmailLabel 10", left: 0, right: 0}},
                "#userPassLabel": {layoutData: {top: "#emailMessage 5", left: 0, right: 0}},
                "#userPassInput": {layoutData: {top: "#userPassLabel 10", left: 0, right: 0}},
                "#loginFormSubmit": {layoutData: {top: "#passMessage 10", left: 0, right: 0}},
                "#alreadySigned": {layoutData: {top: "#loginFormSubmit 10", left: 0, right: 0}}
            });
            var validateForm = function () {
                var constraints = {
                    email: {
                        presence: true,
                        email: true
                    },
                    password: {
                        presence: true,
                        length: {
                            minimum: 6,
                            message: "must be at least 6 characters"
                        }
                    }
                };
                formData = {
                    email: user_email.get('text'),
                    password: user_pass.get('text')
                };
                var validation = validate(formData, constraints);
                if (validation && validation.email) {
                    user_email.set('background', '#ff0000');
                    email_message.set('text', validation.email);
                } else {
                    user_email.set('background', '#00ffcc');
                    email_message.set('text', '');
                }
                if (validation && validation.password) {
                    user_pass.set('background', '#ff0000');
                    pass_message.set('text', validation.password);
                } else {
                    user_pass.set('background', '#00cccc');
                    pass_message.set('text', '');
                }
                if (validation) {
                    if (validation.email || validation.password) {
                        submitButton.set('disabled', true);
                        submitButton.set('background', "rgba(41, 98, 255, 0.6)");
                    }
                } else {
                    submitButton.set('disabled', false);
                    submitButton.set('background', submitButton.get('startBackground'));
                }
            };
            user_email.on('change:text', validateForm);
            user_pass.on('change:text', validateForm);
            validateForm();
        };
        var createProfile = function (user) {
            if (user) {
                var avatar_source = user.avatar ? 'http://pkspots.com/uploads/users/' + user.id + '/small-' + user.avatar : 'img/profile_noimage.gif';
                var userForm = {
                    first_name: user.first_name ? user.first_name : '',
                    last_name: user.last_name ? user.last_name : '',
                    login: user.login ? user.login : ''
                };
                if (!page.find('#profile').length) {
                    var profile = new tabris.Composite({
                        id: "profile",
                        layoutData: {top: 50, left: 30, right: 30}
                    }).appendTo(scrollComp);
                    var avatar = new tabris.ImageView({
                        layoutData: {
                            centerX: 0,
                            width: 76
                        },
                        image: avatar_source,
                        scaleMode: "fill"
                    }).appendTo(profile);
                    var userFNLabel = new tabris.TextView({
                        alignment: "left",
                        text: "Имя",
                        layoutData: {top: [avatar, 15], left: 0, right: 0}
                    }).appendTo(profile);
                    var user_first_name = new tabris.TextInput({
                        id: "userFirstName",
                        text: userForm.first_name,
                        editable: false,
                        layoutData: {top: [userFNLabel, 10], left: 0, right: 0}
                    }).appendTo(profile);
                    var userLNLabel = new tabris.TextView({
                        alignment: "left",
                        text: "Фамилия",
                        layoutData: {top: [user_first_name, 10], left: 0, right: 0}
                    }).appendTo(profile);
                    var user_last_name = new tabris.TextInput({
                        id: "userLastName",
                        text: userForm.last_name,
                        editable: false,
                        layoutData: {top: [userLNLabel, 10], left: 0, right: 0}
                    }).appendTo(profile);
                    var userLoginLabel = new tabris.TextView({
                        alignment: "left",
                        text: "Логин",
                        layoutData: {top: [user_last_name, 10], left: 0, right: 0}
                    }).appendTo(profile);
                    var user_login = new tabris.TextInput({
                        id: "userLogin",
                        text: userForm.login,
                        editable: false,
                        layoutData: {top: [userLoginLabel, 10], left: 0, right: 0}
                    }).appendTo(profile);
                    new tabris.Button({
                        id: "logoutSubmit",
                        text: "Logout",
                        background: "#2962FF",
                        startBackground: "#2962FF",
                        textColor: "white",
                        layoutData: {top: [user_login, 10], left: 0, right: 0}
                    }).on("select", function (widget) {
                        localStorage.removeItem('user');
                        widget.set('background', 'rgba(41, 98, 255, 0.6)');
                        window.setTimeout(function () {
                            widget.set('background', widget.get('startBackground'));
                            checkLogin();
                        }, 100)
                    }).appendTo(profile);
                } else {
                    avatar.set('image', avatar_source);
                    user_first_name.set('text', userForm.first_name);
                    user_last_name.set('text', userForm.last_name);
                    user_login.set('text', userForm.login);
                }
            }
        };
        checkLogin();
    }

    return page;
};