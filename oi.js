Products = new Mongo.Collection('products');


if (Meteor.isClient) {

    Template.fridge.helpers({
        products: function () {
            return Products.find({place: 'fridge'});
        }
    });

    Template.productList.helpers({
        products: function () {
            return Products.find({place: 'supermarket'});
        }
    });
    /*
     The HTML5 dataset API specifies, that every element in the DOM may hold additional attributes with a data- prefix.
     It is very useful to attach meta information to any element on a page.
     In combination with newer jQuery versions (starting with 1.4.3)
     there is no need to access the attribute via attr('data-id') but data('id').
     Accessing the data-id attribute for a product is therefore done via: $(ui.draggable).data('id')
     We can even further shorten the code by dropping the surrounding $() so that only the ui object remains:
     ui.draggable.data('id')
     */
    Template.fridge.rendered = function() {
        var templateInstance = this;
        templateInstance.$('#fridge').droppable({
            drop: function (evt, ui) {
                //#A Get the database ID from the HTML attribute data-id.
                var query = {_id: ui.draggable.data('id')};
                // #B Set the update statement to set place to fridge.
                var changes = {$set: {place: 'fridge'}};
                // #C Perform the database update.
                Products.update(query, changes);
            }
        });
    };

    /*
     #A productList is the template name used by Meteor.
     #B supermarket is the div ID.
     #C Set the place attribute to supermarket when products are dropped.
     */
    Template.productList.rendered = function() {
        var templateInstance = this;
        templateInstance.$('#supermarket').droppable({
            drop: function (evt, ui) {
                var query = {_id: ui.draggable.data('id')};
                var changes = {$set: {place: 'supermarket'}};
                Products.update(query, changes);
            }
        });
    };

    Template.productListItem.rendered = function() {
        var templateInstance = this;
        templateInstance.$('.draggable').draggable({
            cursor: 'move',
            helper: 'clone'
        });
    };

    //Events & //The template life-cycle callbacks
    Template.container.events({
        'click button': function (event, template) {
            //#A This stops the event from bubbling up the DOM.
            event.stopImmediatePropagation();
            //Template.instance() contains an object that represents the current template
            var templateInstance = this;

            var _body = $('body');
            var colorR = Math.floor((Math.random() * 255) + 1);
            var colorG = Math.floor((Math.random() * 255) + 1);
            var colorB = Math.floor((Math.random() * 255) + 1);
            var rgb = 'rgb' + '(' + colorR + ',' + colorG + ',' + colorB + ')';
            _body.css("background-color", rgb);

            //The template life-cycle callbacks
            Template.instance().lastCallback = 'rendered and clicked';
            console.log('container.clicked', this);
            console.log('container.clicked.tplInstance', template);
        }
    });


    //The template life-cycle callbacks
    Template.container.created = function () {
        // #A Prints out the instance of the profile template.
        // You can set variables to the template instance like this.foo = 'bar' that you could use later.
        // You can also read the data context, but you can’t set it here.
        this.lastCallback = 'created';
        console.log('container.created', this);
    };
    Template.container.rendered = function () {
        // #A Prints out the instance of the profile template.
        // You can set variables to the template instance like this.foo = 'bar' that you could use later.
        // You can also read the data context, but you can’t set it here.
        this.lastCallback = 'rendered';
        console.log('container.rendered', this);
    };
    Template.container.destroyed = function () {
        // #A Prints out the instance of the profile template.
        // You can set variables to the template instance like this.foo = 'bar' that you could use later.
        // You can also read the data context, but you can’t set it here.
        this.lastCallback = 'destroyed';
        console.log('container.destroyed', this);
    };
    Template.container.helpers({
        placeholder: function () {
            //#B Prints out only the data context.
            // You have no access to the template instance via this.
            console.log('container.placeholder', this);
            //#C You can still access the template instance in a template helpers and events.
            console.log('container.tplInstance', Template.instance().lastCallback);
            //In the event handlers you don’t need Template.instance()
            // because the template instance is passed as the second parameter directly.
            return 'This is the {{placeholder}} helper';
        }
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {

      Products.remove({});

      Products.insert({
          name: 'Milk',
          img: '/milk.png',
          place: 'supermarket'
      });

      Products.insert({
          name: 'Bread',
          img: '/bread.png',
          place: 'supermarket'
      });

      Products.insert({
          name: 'Juice',
          img: '/juice.png',
          place: 'supermarket'
      });

      Products.insert({
          name: 'Banana',
          img: '/banana.png',
          place: 'supermarket'
      });
  });
}