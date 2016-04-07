exports.create = function (item) {
    var page = tabris.create("Page", {title: item.name});
    var gallery_slides = [{
        src: 'http://pkspots.com/uploads/images/spots/' + item.id + '/raw/' + item.image_name,
        msrc: 'http://pkspots.com/uploads/images/spots/' + item.id + '/medium/' + item.image_name,
        title: item.img_descr
    }];
    for (var i = 0; i < item.gall_images.length; i++) {
        var gallery_item = {
            src: 'http://pkspots.com/uploads/images/spots/' + item.id + '/raw/' + item.gall_images[i].image_name,
            msrc: 'http://pkspots.com/uploads/images/spots/' + item.id + '/medium/' + item.gall_images[i].image_name,
            title: item.gall_images[i].img_descr
        };
        gallery_slides.push(gallery_item);
    }
    var scrollView = tabris.create("ScrollView", {
        left: 0, right: 0, top: 0, bottom: 0,
        direction: "vertical",
        background: "#fff"
    }).appendTo(page);
    var Gallery = require("../partials/carousel.js").create({
        slides: gallery_slides,
        height: 260,
        overscrollDist: 0
    }).appendTo(scrollView);
    var detailsInfoCard = tabris.create("Composite", {
        layoutData: {
            left: 0,
            top: [Gallery, 56],
            right: 0,
            bottom: 0
        }
    }).appendTo(scrollView);
    var topInfoBar = tabris.create("Composite", {
        layoutData: {
            left: 0,
            top: 260,
            right: 0,
            height: 56
        },
        background: "#fff"
    }).appendTo(scrollView);
    var rating = tabris.create("Composite", {
        layoutData: {
            top: 0,
            left: 0,
            width: 56,
            bottom: 0
        },
        background: "#2962FF"
    }).appendTo(topInfoBar);
    var ratingVal = tabris.create("TextView", {
        layoutData: {
            left: 0,
            top: 5,
            right: 0
        },
        alignment: "center",
        font: "14px bold Roboto, sans-serif",
        textColor: "#ffffff",
        text: item.rating
    }).appendTo(rating);
    var peopleRated = tabris.create("TextView", {
        layoutData: {
            left: 0,
            bottom: 5,
            right: 0
        },
        alignment: "center",
        font: "12px Roboto, sans-serif",
        textColor: "#ffffff",
        text: item.people_rated + 'чел.'
    }).appendTo(rating);
    var spotTitle = tabris.create("TextView", {
        layoutData: {
            left: [rating, 16],
            centerY: 0
        },
        alignment: "left",
        font: "bold 18px",
        text: item.name
    }).appendTo(topInfoBar);
    var border = tabris.create("Composite", {
        layoutData: {
            top: 57,
            left: 0,
            right: 0,
            height: 1
        },
        background: "#e9e9e9"
    }).appendTo(topInfoBar);
    var detailsList = require("../partials/spot-details-list.js").create(item).appendTo(detailsInfoCard);
    var description = tabris.create("TextView", {
        layoutData: {
            top: [detailsList, 16],
            left: 16,
            right:16,
            bottom: 16
        },
        maxLines: 1,
        alignment: "left",
        font: "16px",
        markupEnabled: true,
        text: item.description
    }).appendTo(detailsInfoCard).on('tap', function(widget){
        var multiline = widget.get('maxLines') == 1 ? 1000 : 1;
        widget.set('maxLines', multiline);
    });
    var topInfoBarY = 0;
    scrollView.on("scroll", function(widget, offset) {
        Gallery.set("transform", {translationY: Math.max(0, offset.y * 0.2)});
        topInfoBar.set("transform", {translationY: Math.max(0, offset.y - topInfoBarY)});
    });
    scrollView.on("resize", function(widget, bounds) {
        var topInfoBarHeight = topInfoBar.get("height");
        topInfoBarY = Math.min(260 + topInfoBarHeight, 260);
        topInfoBar.set("top", topInfoBarY)
    });
    return page;
};