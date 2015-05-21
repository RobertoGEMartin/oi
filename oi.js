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