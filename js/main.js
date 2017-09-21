var URL = 'http://www.json-generator.com/api/json/get/cgmZpkYnYi?indent=2';

function getJSON (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };
    xhr.send();
}

getJSON(URL,
    function(err, data) {
        if (err != null) {
            alert('Something went wrong: ' + err);
        } else {
            data.forEach(function (item){

                if (item.isActive === true) {
                    item.friends.forEach(function (elem) {
                        var fullName = elem.name.split(' ');
                        elem.firstName = fullName[0];
                        elem.lastName = fullName[1];
                    });

                    if (!localStorage.getItem("data")){
                        localStorage.setItem("data", JSON.stringify(item));
                    }


                    backbone();
                }
            });
        }
    }
);


var backbone = function () {
    function template (id) {
        return _.template($('#' + id).html());
    }

    var Person = Backbone.Model.extend({
        defaults: {
            name: 'No Name',
            firstName: 'No Name',
            lastName: 'No Name',
            id: -1
        }
    });

    var person = new Person();

    var PeopleCollection = Backbone.Collection.extend({
        model: Person,
        url: "#"
    });

    var PeopleView = Backbone.View.extend({
        tagName: 'div',
        className: 'item__body',

        initialize: function () {
            this.collection.on('add', this.addOne ,this)
        },

        addOne: function (person) {
            var personView = new PersonView({model: person});
                    this.$el.append(personView.render().el);
        },

        render: function () {
            this.collection.forEach(this.addOne, this);
            return this;
        }
    });

    var FilterPeople = Backbone.View.extend({
       el: '#filterPeople',

        initialize: function() {
        },

        events: {
            'change': 'submit',
            'keyup': 'submit'
        },

        submit: function (e) {
            e.preventDefault();

            var data = JSON.parse(localStorage.getItem("data")),
                select = $(e.currentTarget).find('select').val(),
                value = $(e.currentTarget).find('input').val().toLowerCase();

            if(!value){
                return;
            }

            this.collection.models.forEach(function (model) {
                var name = model.get(select).toLowerCase(),
                number = name.indexOf(value);

                if(number === -1) {
                    model.className = 'a';
                    console.log(model)
                }

            })

        }
    });

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

            localStorage.removeItem('data');
            localStorage.setItem("data", JSON.stringify(data));

            $(e.currentTarget).find('input[name=last-name]').val("");
            $(e.currentTarget).find('input[name=first-name]').val("");
        }

    });

    var PersonView = Backbone.View.extend({
        tagName: 'div',
        className: 'item__name',

        template: template('perconaTemplate'),

        initialize: function() {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
        },

        render: function() {
            this.$el.html( this.template( this.model.toJSON() ) );

            return this;
        },

        remove: function () {
            this.$el.remove();
        },

        events: {
            'mouseover': 'mouseoverItem',
            'mouseout': 'mouseoutItem',
            'click .btn-template--edit': 'editModal',
            'click .btn-template--add': 'addModal',
            'click .btn-template--delete': 'deleteModal'

        },

        editModal: function () {
           var data = JSON.parse(localStorage.getItem("data")),
               newName = prompt('Write New name', this.model.get('name')),
               splitName;

            newName = $.trim(newName);

            if (!newName){
                return
            }

            splitName = newName.split(' ');

            if(splitName.length !== 2) {
                alert('Wrong Name');
                return;
            }

            this.model.set('name', newName);
            this.model.set('firstName', splitName[0]);
            this.model.set('lastName', splitName[1]);

            data.friends.forEach(function (elem) {
                if (elem.id === this.model.get('id')){
                    elem.name = newName;
                    elem.firstName = splitName[0];
                    elem.lastName = splitName[1];
                }
            },this);

            localStorage.removeItem('data');
            localStorage.setItem("data", JSON.stringify(data));
        },

        deleteModal: function () {
            var data = JSON.parse(localStorage.getItem("data"));

            this.model.destroy();

          data.friends.forEach(function (elem, index, data) {
              if (elem.id === this.model.get('id')) {
                  data.splice(index, 1);
              }
          }, this);

            localStorage.removeItem('data');
            localStorage.setItem("data", JSON.stringify(data));
        },

        mouseoverItem: function () {
            this.el.style.border = '1px solid blue';
        },

        mouseoutItem: function () {
            this.el.style.border = '1px solid #ccc';
        }
    });



    var peopleCollection = new PeopleCollection(JSON.parse(localStorage.getItem("data")).friends);

    var peopleView = new PeopleView({collection: peopleCollection});

    var addPeople = new AddPeople({collection: peopleCollection});

    var filterPeople = new FilterPeople({collection: peopleCollection});

    $('#containerTemplate').append(peopleView.render().el);
};

