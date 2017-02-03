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
        console.log(xhr.statusText + xhr.status);
        return;
    }
    var usersList = JSON.parse(xhr.responseText);
    for (var i = 0; i < usersList.length; i++) {
        var tr = document.createElement("tr"),
            nameTd = document.createElement("td"),
            profTd = document.createElement("td"),
            sInfoTd = document.createElement("td"),
            optionsTd = document.createElement("td"),
            removeBtn = document.createElement("a"),
            editBtn = document.createElement("a");

        removeBtn.textContent = "Remove";
        editBtn.textContent = "Edit";

        nameTd.textContent = usersList[i].fullName;
        profTd.textContent = usersList[i].profession;
        sInfoTd.textContent = usersList[i].shortInfo;
        optionsTd.appendChild(removeBtn);
        optionsTd.appendChild(editBtn);

        tr.appendChild(nameTd);
        tr.appendChild(profTd);
        tr.appendChild(sInfoTd);
        tr.appendChild(optionsTd);
        table.appendChild(tr);
        addRemoveHandler(removeBtn, i, usersList);
    }

});

xhr.send();

var createBtn = document.getElementById("create"),
    formEdit = document.forms["users-edit"],
    cancelBtn = document.getElementById("cancel");

createBtn.addEventListener("click", function () {
    formEdit.classList.remove("users-edit-hidden");
    for (var i = 0; i < formEdit.elements.length; i++) {
        formEdit.elements[i].value = "";
    }
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
        
    });
    xhr.send(json);
});

cancelBtn.addEventListener("click", function () {
    formEdit.classList.add("users-edit-hidden");
});

function addRemoveHandler(btn, index, allUsers) {
    btn.addEventListener("click", function (e) {
        var xhrRemove = new XMLHttpRequest();
        xhrRemove.open("DELETE", "/user?id=" + allUsers[index].id);
        xhrRemove.addEventListener("readystatechange", function () {
            if (xhrRemove.readyState != 4) {
                console.log("Error" + xhrRemove.statusText + xhrRemove.status);
                return;
            }
            table.removeChild(e.target.parentNode.parentNode);
        });
        xhrRemove.send();
    });
}



