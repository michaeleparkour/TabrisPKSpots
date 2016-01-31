exports.create = function() {
    var animateInFromBottom = function (widget) {
        widget.set({
            opacity: 0.0,
            transform: {translationY: 232}
        });
        widget.animate({
            opacity: 1.0,
            transform: {translationY: 0}
        }, {
            duration: 500,
            delay: widget.get('itemIndex')*100+200,
            easing: "ease-in-out"
        });
    };
    return tabris.create("CollectionView", {
        layoutData: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        },
        itemHeight: 150,
        refreshEnabled: true,
        initializeCell: function (cell) {
            var cell_back = tabris.create("Composite", {
                layoutData: {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                },
                background: "#eee"
            }).appendTo(cell);
            var card = tabris.create("Composite", {
                layoutData: {
                    top: 5,
                    left: 10,
                    right: 10,
                    bottom: 5
                },
                background: "#fff"
            }).appendTo(cell_back);
            var imageView = tabris.create("ImageView", {
                layoutData: {
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: "70%"
                },
                scaleMode: 'fill'
            }).appendTo(card);
            var card_info = tabris.create("Composite", {
                layoutData: {
                    top: 0,
                    left: [imageView, 16],
                    right: 0
                },
                font: "14px Roboto, sans-serif",
                textColor: "#333"
            });
            var title = tabris.create("TextView", {
                layoutData: {
                    left: 0,
                    top: 5,
                    right: 0
                },
                alignment: "left",
                font: "bold 18px",
                textColor: "#000"
            }).appendTo(card_info);
            var category = tabris.create("TextView", {
                layoutData: {
                    left: 0,
                    top: [title, 5],
                    right: 0
                },
                alignment: "left",
                textColor: "#444"
            }).appendTo(card_info);
            var author = tabris.create("TextView", {
                layoutData: {
                    left: 0,
                    top: [category, 5],
                    right: 0
                },
                alignment: "left",
                textColor: "#444"
            }).appendTo(card_info);
            var card_border = tabris.create("Composite", {
                layoutData: {
                    top: [card_info, 8],
                    left: [imageView, 0],
                    right: 0,
                    height: 1
                },
                background: "#eee"
            }).appendTo(card);
            var bottom_bar = tabris.create("Composite", {
                layoutData: {
                    left: [imageView, 16],
                    top: [card_border, 0],
                    right: 6,
                    bottom: 0
                }
            }).appendTo(card);
            var distance = tabris.create("TextView", {
                layoutData: {centerY: 0},
                alignment: "left",
                font: "16px",
                textColor: "#333"
            }).appendTo(bottom_bar);
            var more = tabris.create("Button", {
                classname: "",
                layoutData: {centerY: 0, right: 0},
                font: "16px",
                background: "transparent",
                textColor: "#FFA636",
                text: "ПОДРОБНЕЕ"
            }).appendTo(bottom_bar);
            var ripple = tabris.create('Composite', {
                layoutData: {
                    width: 1000,
                    height: 1000,
                    centerY: 0,
                    centerX: 0
                },
                background: "rgba(0, 0, 200, 0.2)",
                transform: {scaleX: 0, scaleY: 0}
            });
            ripple.appendTo(cell);
            ripple.on('animationend', function(widget){
                widget.set('transform', {scaleX: 0, scaleY: 0});
            });
            more.on('select', function(){
                require("../pages/spot-page.js").create(cell.get('item')).open();
            });
            cell.on('tap', function(){
                ripple.animate({
                    transform: {scaleX: 1, scaleY: 1}
                }, {
                    duration: 500,
                    delay: 0,
                    easing: "ease-in-out"
                });
            })
            card_info.appendTo(card);
            cell.on("change:item", function (widget, item) {
                imageView.set("image", {
                    src: 'http://pkspots.com/uploads/images/spots/' + item.id + '/small/' + item.image_name
                });
                item.name ? title.set("text", item.name) : title.set("text", 'No Title');
                item.category ? category.set("text", item.category) : category.set("text", 'No Category');
                item.first_name ? author.set("text", item.first_name + ' ' + item.last_name) : author.set("text", 'nobody');
                distance.set("text", myUtils.latlng2Distance(global.location.lat, global.location.lng, item.lat, item.lng)+ ' км');
                animateInFromBottom(widget);
            });
        }
    });
};