var PersonView = Backbone.View.extend({
    tagName: 'div',
    className: 'item__name',

    template: template('perconaTemplate'),

    initialize: function() {
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
        this.model.on('filter', this.remove, this);

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

        changeLocalStorage(data);
    },

    deleteModal: function () {
        var data = JSON.parse(localStorage.getItem("data"));

        this.model.destroy();

        data.friends.forEach(function (elem, index, data) {
            if (elem.id === this.model.get('id')) {
                data.splice(index, 1);
            }
        }, this);

        if (data.friends.length === 0) {
            // this.collection.render({
            //     name: 'No Name',
            //     firstName: 'No Name',
            //     lastName: 'No Name',
            //     id: -1
            // })

            console.log(this);
        }

        changeLocalStorage(data);
    },

    mouseoverItem: function () {
        this.el.style.border = '1px solid blue';
    },

    mouseoutItem: function () {
        this.el.style.border = '1px solid #ccc';
    }
});