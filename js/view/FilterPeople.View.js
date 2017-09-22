var FilterPeople = Backbone.View.extend({
    el: '#filterPeople',

    initialize: function() {
    },

    events: {
        'change': 'filter',
        'keyup': 'filter'
    },

    filter: function (e) {
        e.preventDefault();
        var data = JSON.parse(localStorage.getItem("data")),
            select = $(e.currentTarget).find('select').val(),
            value = $(e.currentTarget).find('input').val().toLowerCase();


        if (value === "" ) {
            this.collection.reset(data.friends);
            return;
        }

        var filter = data.friends.filter(function (elem) {
            var name = elem[select].toLowerCase(),
                number = name.indexOf(value);

            if (number !== -1){
                return true;
            }else {
                return false
            }

        });

        if(filter.length === 0) {
            this.collection.reset({
                name: 'No Name',
                firstName: 'No Name',
                lastName: 'No Name',
                id: -1
            });

            return;
        }

        this.collection.reset(filter);
    }
});