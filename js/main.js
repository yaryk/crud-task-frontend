class Request {
    static execute(url, callback, method, data) {
        var xhr = new XMLHttpRequest(); // TODO: rewrite request with using Promise
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

    static get(url, callback) {
        Request.execute(url, callback, "GET");
    }

    static post(url, callback, data) {
        Request.execute(url, callback, "POST", data);
    }

    static delete(url, callback) {
        Request.execute(url, callback, "DELETE");
    }

    static put(url, callback, data) {
        Request.execute(url, callback, "PUT", data);
    }
}

let table = document.getElementById("users-table");

Request.get("/countries", function (arrOfCountries) {
    let selectCountries = document.getElementById("country");
    arrOfCountries.forEach((country) => {
        let option = document.createElement("option");
        option.textContent = country;
        selectCountries.appendChild(option);
    });
});

Request.get("/user", (usersList) => {
    usersList.forEach((item) => {
        addTableRow(item);
})
    ;
});

let createBtn = document.getElementById("create"),
    formEdit = document.forms["users-edit"],
    cancelBtn = document.getElementById("cancel");

createBtn.addEventListener("click", () => {
    formEdit.classList.remove("users-edit-hidden");
    clearFormFields();
});

formEdit.addEventListener("submit", (e) => {
    e.preventDefault();
    if (formEdit.id.value.length == 0) {
        submitCreateUser();
    }
    else {
        submitEditUser();
    }
    formEdit.classList.add("users-edit-hidden");
});

cancelBtn.addEventListener("click", () => {
    formEdit.classList.add("users-edit-hidden");
});

function addTableRow(user) {
    let tr = document.createElement("tr");
    addTableCell(tr, user.fullName);
    addTableCell(tr, user.profession);
    addTableCell(tr, user.shortInfo);
    let removeBtn = addOptionBtn(tr, "Remove"),
        editBtn = addOptionBtn(tr, "Edit");
    addRemoveHandler(removeBtn, user);
    editHandler(editBtn, user);
    tr.dataset.id = user.id;
    table.appendChild(tr);
}

function addTableCell(row, cellContent) {
    let cell = document.createElement("td");
    cell.textContent = cellContent;
    row.appendChild(cell);
}
function addOptionBtn(row, value) {
    let btn = document.createElement("a");
    btn.textContent = value;
    row.appendChild(btn);
    return btn;
}
function addRemoveHandler(btn, user) {
    btn.addEventListener("click", (e) => {
        let id = `/user?id=${user.id}`;
        Request.delete(id, () => {
            table.removeChild(e.target.parentNode);
        });
    });
}
function editHandler(btn, user) {
    btn.addEventListener("click", () => {
        var id = `user?id=${user.id}`;
        Request.get(id, (editUser) => {
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
    Array.prototype.map.call(formEdit.elements, (item) => {
        item.value = "";
    });
}
function submitCreateUser() {
    let body = {
        fullName: this.fullname.value,
        birthday: this.birthday.value,
        profession: this.profession.value,
        email: null,
        address: this.address.value,
        country: this.country.value,
        shortInfo: this["short-info"].value,
        fullInfo: this["full-info"].value
    };
    Request.post("/user", (newUser) => {
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
    Request.put("/user", (newUser) => {
        editTableRow(newUser);
    }, body);

}

function editTableRow(user) {
    var tableRow = document.querySelector(`[data-id="${user.id}"]`);
    tableRow.children[0].textContent = user.fullName;
    tableRow.children[1].textContent = user.profession;
    tableRow.children[2].textContent = user.shortInfo;
};

