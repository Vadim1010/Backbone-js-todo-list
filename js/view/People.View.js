var PeopleView = Backbone.View.extend({
    tagName: 'div',
    className: 'item__body',

    initialize: function () {
        this.collection.on('add', this.addOne ,this);
        this.collection.on('reset', this.render ,this);
    },

    addOne: function (person) {
        var personView = new PersonView({model: person});
        this.$el.append(personView.render().el);
    },

    render: function () {
        this.$el.empty();
        this.collection.forEach(this.addOne, this);
        return this;
    }

});