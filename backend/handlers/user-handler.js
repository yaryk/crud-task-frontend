var UsersList = require("../models/users-list"),
	errors = require("../errors/user"),
	users;

function init(usersJson) {
	users = new UsersList(usersJson);

	return {
		add: add,
		update: update,
		get: get,
		del: del
	};
}

function add(req, res) {
	var user = req.body;
	if (!user) {
		var error = {
			message: "Please check arguments you sent to server. Request body is empty!"
		};
		res.status(401)
			.send(error);
	} else {
		user = users.add(user);
		res.send(user);
	}
}

function update(req, res) {
	var updatedUser = req.body || {};
	var id = updatedUser.id;
	if (!id) {
		var error = new errors.UpdateNotFound(id);
		return res.status(404)
			.send(error);
	} else {
		var old = users.get(id);
		users.replace(old, updatedUser);
		res.status(200)
			.send(updatedUser);
	}
}

function get(req, res) {
	var id = req.query.id,
		responseRes = null,
		status = 200;
	if (id) {
		responseRes = users.get(id);
		if (!responseRes) {
			responseRes = new errors.NotFound(id);
			status = 404;
		}
	} else {
		responseRes = users.list();
	}

	res.status(status)
		.send(responseRes);
}

function del(req, res) {
	var id = req.query.id;
	if (!id || !users.contains(id)) {
		var error = new errors.NotFound(id);
		res.status(404)
			.send(error);
	} else {
		var u = users.get(id);
		users.remove(u);
		res.send(id);
	}
}

module.exports = init;