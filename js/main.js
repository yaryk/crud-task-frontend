
function Request() {};
Request.execute = function (url, callback, method, data) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState != 4) {
            return;
        }
        callback(xhr.response);
    });
    var dataToSend = null;
    if (data) {
        dataToSend = JSON.stringify(data);
    }
    xhr.send(dataToSend);
}

Request.get = function (url, callback) {
    Request.execute(url, callback, "GET");
}
Request.post = function (url, callback, data) {
    Request.execute(url, callback, "POST", data);
}
Request.delete = function (url, callback) {
    Request.execute(url, callback, "DELETE");
}
Request.put = function (url, callback, data) {
    Request.execute(url, callback, "PUT", data);
}

var table = document.getElementById("users-table");

Request.get("/countries", function (arrOfCountries) {
    var selectCountries = document.getElementById("country");
    for (var i = 0, len =  arrOfCountries.length; i < len; i++) {
        var option = document.createElement("option");
        option.textContent = arrOfCountries[i];
        selectCountries.appendChild(option);
    }
});

Request.get("/user", function (usersList) {
    for (var i = 0, len = usersList.length; i < len; i++) {
        addTableRow(usersList[i]);
    }
});

var createBtn = document.getElementById("create"),
    formEdit = document.forms["users-edit"],
    cancelBtn = document.getElementById("cancel");

createBtn.addEventListener("click", function () {
    formEdit.classList.remove("users-edit-hidden");
    clearFormFields();

});

formEdit.addEventListener("submit", function (e) {
    e.preventDefault();
    if (formEdit.id.value.length == 0) {
        submitCreateUser();
    }
    else {
        submitEditUser();
    }
    formEdit.classList.add("users-edit-hidden");
});

cancelBtn.addEventListener("click", function () {
    formEdit.classList.add("users-edit-hidden");
});

function addTableRow(user) {
    var tr = document.createElement("tr");
    addTableCell(tr, user.fullName);
    addTableCell(tr, user.profession);
    addTableCell(tr, user.shortInfo);
    var removeBtn = addOptionBtn(tr, "Remove"),
        editBtn = addOptionBtn(tr, "Edit");
    addRemoveHandler(removeBtn, user);
    editHandler(editBtn, user);
    tr.dataset.id = user.id;
    table.appendChild(tr);
}

function addTableCell(row, cellContent) {
    var cell = document.createElement("td");
    cell.textContent = cellContent;
    row.appendChild(cell);
}
function addOptionBtn(row, value){
    var btn = document.createElement("a");
    btn.textContent = value;
    row.appendChild(btn);
    return btn;
}
function addRemoveHandler(btn, user) {
    btn.addEventListener("click", function (e) {
        var id = "/user?id=" + user.id;
        Request.delete(id, function () {
            table.removeChild(e.target.parentNode);
        });

    });
}
function editHandler(btn, user) {
    btn.addEventListener("click", function () {
        var id = "user?id=" + user.id;
        Request.get(id, function(editUser){
            formEdit.fullname.value = editUser.fullName;
            formEdit.birthday.value = editUser.birthday;
            formEdit.profession.value = editUser.profession;
            formEdit.address.value = editUser.address;
            formEdit.country.value = editUser.country;
            formEdit["short-info"].value = editUser.shortInfo;
            formEdit["full-info"].value = editUser.fullInfo
            formEdit.id.value = editUser.id;
        });
        formEdit.classList.remove("users-edit-hidden");
    });
}
function clearFormFields() {
    for (var i = 0, len = formEdit.elements.length; i < len; i++) {
        formEdit.elements[i].value = "";
    }
}
function submitCreateUser() {
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
    Request.post("/user", function (newUser) {
        addTableRow(newUser);
    }, body);

    clearFormFields();
}
function submitEditUser() {
    var body = {
        fullName: this.fullname.value,
        birthday: this.birthday.value,
        profession: this.profession.value,
        email: null,
        address: this.address.value,
        country: this.country.value,
        shortInfo: this["short-info"].value,
        fullInfo: this["full-info"].value,
        id: this.id.value
    };
    Request.put("/user", function (newUser) {
        editTableRow(newUser);
    }, body);

}

function editTableRow(user) {
    var tableRow = document.querySelector("[data-id=\"" + user.id + "\"]");
    tableRow.children[0].textContent = user.fullName;
    tableRow.children[1].textContent = user.profession;
    tableRow.children[2].textContent = user.shortInfo;
};

