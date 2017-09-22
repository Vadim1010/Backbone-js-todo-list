

var backbone = function () {

    var person = new Person();

    var peopleCollection = new PeopleCollection(JSON.parse(localStorage.getItem("data")).friends);

    var peopleView = new PeopleView({collection: peopleCollection});

    var addPeople = new AddPeople({collection: peopleCollection});

    var filterPeople = new FilterPeople({collection: peopleCollection});

    $('#containerTemplate').append(peopleView.render().el);
};

