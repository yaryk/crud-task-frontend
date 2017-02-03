/**
 * Created by Slavik on 2/1/2017.
 */
var table = document.getElementById("users-table"),
    xhr = new XMLHttpRequest(),
    countiesRequest = new XMLHttpRequest();
countiesRequest.open("GET", "/countries");
countiesRequest.addEventListener("readystatechange", function () {
    if (countiesRequest.readyState != 4) {
        return;
    }

    var arrOfCountries = JSON.parse(countiesRequest.responseText),
        selectCountries = document.getElementById("country");
    for (var i = 0; i < arrOfCountries.length; i++) {
        var option = document.createElement("option");
        option.textContent = arrOfCountries[i];
        selectCountries.appendChild(option);
    }
});
countiesRequest.send();

xhr.open("GET", "/user");
xhr.addEventListener("readystatechange", function () {
    if (xhr.readyState != 4) {
        return;
    }
    var usersList = JSON.parse(xhr.responseText);
    for (var i = 0; i < usersList.length; i++) {
        addTableRow(usersList[i]);
    }

});
xhr.send();

var createBtn = document.getElementById("create"),
    formEdit = document.forms["users-edit"],
    cancelBtn = document.getElementById("cancel");

createBtn.addEventListener("click", function () {
    formEdit.classList.remove("users-edit-hidden");
    clearFormFields();
});

formEdit.addEventListener("submit", function (e) {
    e.preventDefault();
    var body = {
        fullName: this.fullname.value,
        birthday: this.birthday.value,
        profession: this.profession.value,
        email: null,
        address: this.address.value,
        country: this.country.value,
        shortInfo: this["short-info"].value,
        fullInfo: this["full-info"].value
    };
    var json = JSON.stringify(body);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "user/");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState != 4) {
            return;
        }
        var newUser = JSON.parse(xhr.responseText);
        addTableRow(newUser);
    });
    xhr.send(json);
    clearFormFields();
});

cancelBtn.addEventListener("click", function () {
    formEdit.classList.add("users-edit-hidden");
});

function addTableRow(user){
    var tr = document.createElement("tr"),
            nameTd = document.createElement("td"),
            profTd = document.createElement("td"),
            sInfoTd = document.createElement("td"),
            optionsTd = document.createElement("td"),
            removeBtn = document.createElement("a"),
            editBtn = document.createElement("a");
    removeBtn.textContent = "Remove";
    editBtn.textContent = "Edit";
    nameTd.textContent = user.fullName;
    profTd.textContent = user.profession;
    sInfoTd.textContent = user.shortInfo;
    optionsTd.appendChild(removeBtn);
    optionsTd.appendChild(editBtn);

    tr.appendChild(nameTd);
    tr.appendChild(profTd);
    tr.appendChild(sInfoTd);
    tr.appendChild(optionsTd);
    table.appendChild(tr);
    addRemoveHandler(removeBtn, user);
}
function addRemoveHandler(btn, user) {
    btn.addEventListener("click", function (e) {
        var xhrRemove = new XMLHttpRequest();
        xhrRemove.open("DELETE", "/user?id=" + user.id);
        xhrRemove.addEventListener("readystatechange", function () {
            if (xhrRemove.readyState != 4) {
                return;
            }
            table.removeChild(e.target.parentNode.parentNode);
        });
        xhrRemove.send();
    });
}
function clearFormFields(){
    for (var i = 0; i < formEdit.elements.length; i++) {
        formEdit.elements[i].value = "";
    }
}

