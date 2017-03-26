
$(document).ready(function(){
    var table = $("#users-table"),
    createBtn = $("#create"),
    formEdit = $("[name=users-edit]"),
    cancelBtn = $("#cancel");2
    $.ajax({
        type: "GET",
        url: "/countries",
        success: function (arrOfCountries) {
                    var selectCountries = $("#country");
                    for (var i = 0, len =  arrOfCountries.length; i < len; i++) {
                        var option = document.createElement("option");
                        var option = $("<option>").text(arrOfCountries[i]);
                        selectCountries.append(option);
                    }
                },
        
    });

    $.ajax({
        type: "GET",
        url: "/user",
        success: function (usersList) {
            for (var i = 0, len = usersList.length; i < len; i++) {
            addTableRow(usersList[i]);
             }
    }});

});

function addTableRow(user) {
    var tr = $("<tr>");
    var td = $("<td>");
    td.text("some");
    tr.append(td);

    // addTableCell(tr, user.fullName);
    // addTableCell(tr, user.profession);
    // addTableCell(tr, user.shortInfo);
//     var removeBtn = addOptionBtn(tr, "Remove"),
//         editBtn = addOptionBtn(tr, "Edit");
//     addRemoveHandler(removeBtn, user);
//     editHandler(editBtn, user);
//    // tr.data(id, user.id);
   table.append(tr);
    
}
// function addTableCell(row, cellContent) {
//     // $("<td>" + cellContent + "</td>")
//     var td = $("<td>");
//     td.text(cellContent);
//     row[0].append(td);
// }
// function addOptionBtn(row, value){
//     var btn = $("<a>").text(value);
//     row.append(btn);
//     return btn;
// }
// function addRemoveHandler(btn, user) {
//     btn.on("click", function (e) {
//         $ajax({
//             type: "DELETE",
//             url: "/user?id=" + user.id,
//             success: table.removeChild(e.target.parentNode)
//         });
//     });
// }
// function editHandler(btn, user) {
//     btn.on("click", function () {
//         $ajax({
//             type: "GET",
//             url: "user?id=" + user.id,
//             success: function(editUser){
//                 formEdit.fullname.value = editUser.fullName;
//                 formEdit.birthday.value = editUser.birthday;
//                 formEdit.profession.value = editUser.profession;
//                 formEdit.address.value = editUser.address;
//                 formEdit.country.value = editUser.country;
//                 formEdit["short-info"].value = editUser.shortInfo;
//                 formEdit["full-info"].value = editUser.fullInfo
//                 formEdit.id.value = editUser.id;
//             }
//         });
//         formEdit.removeClass("users-edit-hidden");
        
//         var id = "user?id=" + user.id;
//         Request.get(id, function(editUser){
//             formEdit.fullname.value = editUser.fullName;
//             formEdit.birthday.value = editUser.birthday;
//             formEdit.profession.value = editUser.profession;
//             formEdit.address.value = editUser.address;
//             formEdit.country.value = editUser.country;
//             formEdit["short-info"].value = editUser.shortInfo;
//             formEdit["full-info"].value = editUser.fullInfo
//             formEdit.id.value = editUser.id;
//         });
//         formEdit.removeClass("users-edit-hidden");
//     });
// }


// createBtn.on("click", function () {
//     formEdit.removeClass("users-edit-hidden");
//     clearFormFields();

// });

// formEdit.on("submit", function (e) {
//     e.preventDefault();
//     if (formEdit.id.value.length == 0) {
//         submitCreateUser();
//     }
//     else {
//         submitEditUser();
//     }
//     formEdit.addClass("users-edit-hidden");
// });

// cancelBtn.on("click", function () {
//     formEdit.addClass("users-edit-hidden");
// });