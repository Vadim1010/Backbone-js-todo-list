var AddPeople = Backbone.View.extend({
    el: '#addFriend',

    initialize: function() {
    },

    events: {
        'submit': 'submit'
    },

    submit: function (e) {
        e.preventDefault();
        var data = JSON.parse(localStorage.getItem("data")),
            firstName = $(e.currentTarget).find('input[name=first-name]').val(),
            lastName = $(e.currentTarget).find('input[name=last-name]').val(),
            numberLastFriend = data.friends.length - 1,
            idFriend;

        firstName = $.trim(firstName);
        lastName = $.trim(lastName);

        if(firstName.length === 0 || lastName.length === 0) {
            return
        }

        if (numberLastFriend < 0 ) {
            idFriend = -1;
        } else {
            idFriend = data.friends[numberLastFriend].id
        }

        var newFriend = {
            id: idFriend + 1,
            name: firstName + ' ' +  lastName,
            firstName: firstName,
            lastName: lastName
        };

        data.friends.push(newFriend);

        var newModelFriend = new Person (newFriend);

        this.collection.add(newModelFriend);

        changeLocalStorage(data);

        $(e.currentTarget).find('input[name=last-name]').val("");
        $(e.currentTarget).find('input[name=first-name]').val("");

    }

});