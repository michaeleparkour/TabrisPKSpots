exports.create = function (item) {
    var items = [{name: 'address', text: item.address}, {name: 'category', text: item.category}, {name: 'author', text: item.first_name + ' ' + item.last_name}];
    var detailsList = tabris.create("Composite", {
        layoutData: {
            height: 140
        },
        background: "#ECEFF1"
    });
    new tabris.CollectionView({
        layoutData: {
            left: 16,
            top: 10,
            bottom: 10,
            right: 16
        },
        itemHeight: 40,
        items: items,
        initializeCell: function (cell) {
            var li = new tabris.Composite({
                layoutData: {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }
            }).appendTo(cell);
            var icon = new tabris.ImageView({
                layoutData: {
                    height: 24,
                    centerY: 0
                }
            }).appendTo(li);
            var text = new tabris.TextView({
                layoutData: {
                    left: [icon, 16],
                    centerY: 0
                },
                alignment: "left",
                textColor: "#000",
                text: item.text,
                maxLines: 1
            }).appendTo(li);
            var border = tabris.create("Composite", {
                layoutData: {
                    left: 0,
                    right: 0,
                    height: 1,
                    bottom: 0
                },
                background: "#e9e9e9"
            });
            cell.on("change:item", function (widget, item) {
                icon.set('image',  getIconSrc('home', '48', 'black'));
                text.set('text', item.text);
                if(item.name != 'author') border.appendTo(li);
            })
        }
    }).appendTo(detailsList);
    return detailsList;
};
