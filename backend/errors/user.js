/**
 * Created by akv on 11.08.16.
 */


function UserNotFoundError(id) {
	this.message = "User with 'id' provided by you not found. 'id' = " + id;
}

function UpdateTargetNotFoundError(id) {
	this.message = "To update user you should provide correct 'id'. Provided 'id' = " + id;
}

function UserExistsError() {
	this.message = "Provided user exists! We can save only  list of unique users";
}

module.exports = {
	NotFound: UserNotFoundError,
	UpdateNotFound: UpdateTargetNotFoundError,
	DuplicateUser: UserExistsError
};