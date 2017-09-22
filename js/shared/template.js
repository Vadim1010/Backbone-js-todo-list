function template (id) {
    return _.template($('#' + id).html());
}

function changeLocalStorage(data) {
    localStorage.removeItem('data');
    localStorage.setItem("data", JSON.stringify(data));
}