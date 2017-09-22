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

getJSON(URL, saveData);

function saveData (err, data) {
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