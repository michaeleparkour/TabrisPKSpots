exports.create = function (settings) {
    function extend(obj, src) {
        Object.keys(src).forEach(function (key) {
            obj[key] = src[key];
        });
        return obj;
    }

    var default_settings = {
        slides: [],
        height: 250,
        overscrollDist: 25,
        imageMode: "fill"
    };
    settings = extend(default_settings, settings);
    if (!settings.slides || !settings.slides.length) {
        return false;
    } else {
        var Gallery = tabris.create("Composite", {
            layoutData: {
                top: 0,
                left: 0,
                right: 0,
                height: settings.height
            },
            background: "#eee"
        });
        var galleryState = "right", slide_images = [], slides = settings.slides.length - 1, active_slide = 0, dragOffset, lastPosition = 0, slide_width = Gallery.get('bounds').width;
        var galleryWrapper = tabris.create("Composite", {
            layoutData: {
                top: 0,
                left: 0,
                width: slide_width * settings.slides.length,
                bottom: 0
            },
            background: "#eee"
        }).appendTo(Gallery);
        makeSlides();
        function makeSlides() {
            var prev_slide = false;
            settings.slides.forEach(function (slide, i) {
                var left = 0;
                if (prev_slide) left = [prev_slide, 0];
                prev_slide = tabris.create("ImageView", {
                    layoutData: {
                        top: 0,
                        left: left,
                        bottom: 0,
                        width: slide_width
                    },
                    image: slide.msrc,
                    scaleMode: settings.imageMode
                }).appendTo(galleryWrapper);
                prev_slide.on('tap', function (widget) {
                    console.log(widget.get('image').src);
                    cordova.plugins.fileOpener2.open(
                        widget.get('image').src,
                        'image/jpeg', {
                            error: function (e) {
                                console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                            },
                            success: function () {
                                console.log('file opened successfully');
                            }
                        }
                    );
                });
                slide_images.push(prev_slide);
            });

        }

        Gallery.on("pan:horizontal", function (widget, event) {
            if (event.state === "start" && (galleryState === "right" || galleryState === "left")) {
                galleryState = "dragging";
                dragOffset = galleryWrapper.get("transform").translationX + event.translation.x;
            }
            if (galleryState === "dragging") {
                var offsetX = Math.min(Math.max(event.translation.x + dragOffset, -widget.get('bounds').width * slides - settings.overscrollDist), settings.overscrollDist);
                galleryWrapper.set("transform", {translationX: offsetX});
            }
            if (event.state === "end" && galleryState === "dragging") {
                positionSlideState(event.velocity.x)
            }
        });
        Gallery.on("resize", function (widget, event) {
            var width = slide_width = widget.get('bounds').width;
            galleryWrapper.set('width', width * settings.slides.length);
            slide_images.forEach(function (slide) {
                slide.set('width', slide_width);
            });
            if (galleryState === "dragging") {
                positionSlideState(2000);
            } else {
                galleryWrapper.set("transform", {translationX: -slide_width * active_slide});
            }
        });
        function positionSlideState(velocity) {
            galleryState = "animating";
            var width = Gallery.get('bounds').width;
            var translationX = velocity > 0 ? width + lastPosition : lastPosition - width;
            translationX = Math.min(Math.max(translationX, -width * slides), 0);
            var options = {
                duration: Math.min(Math.abs(width / velocity * 1000), 800),
                easing: Math.abs(velocity) >= 1000 ? "ease-out" : "ease-in-out"
            };
            galleryWrapper.once("animationend", function () {
                galleryState = velocity > 0 ? "right" : "left";
                if (galleryState == 'left') {
                    active_slide++;
                } else {
                    active_slide--;
                }
                active_slide = Math.min(Math.max(active_slide, 0), slides);
                lastPosition = galleryWrapper.get("transform").translationX;
            }).animate({
                transform: {translationX: translationX}
            }, options);
        }

        Gallery.on("tap", function () {
            console.log(active_slide, lastPosition, galleryWrapper.get('bounds').width);
        });
        return Gallery;
    }
};