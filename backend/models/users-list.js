/**
 * Created by akv on 11.08.16.
 */
var User = require("./user"),
	uuid = require("node-uuid");

Object.values = Object.values || function(obj) {
		var resp = [];
		for (var p in obj) {
			resp.push(obj[p]);
		}
		return resp;
	};

function UsersList(data) {
	if (typeof data === "string") {
		data = JSON.parse(data);
	}

	if (!Array.isArray(data)) {
		throw new Error("Only users array supported!");
	}

	this.__data = {};
	data.forEach(this.set, this);
}

function ensureUserInstance(u) {
	return u instanceof User ? u : new User(u);
}

UsersList.prototype = {
	get: function(id) {
		return this.__data[id.toLowerCase()];
	},
	list: function() {
		return Object.values(this.__data);
	},
	set: function(user) {
		user = ensureUserInstance(user);
		return this.__data[user.id.toLowerCase()] = user;
	},
	add: function(user) {
		user = ensureUserInstance(user);
		user.id = uuid.v1();
		return this.set(user);
	},
	replace: function(oldUser, newUser) {
		oldUser = ensureUserInstance(oldUser);
		newUser = ensureUserInstance(newUser);

		if (this.contains(oldUser) && oldUser.isSame(newUser)) {
			this.remove(oldUser);
			return this.set(newUser);
		} else {
			throw new Error("You cannot replace. Specified user does not exists or have different id.");
		}
	},
	remove: function(user) {
		user = ensureUserInstance(user);
		if(this.contains(user)) {
			delete this.__data[user.id];
		}
	},
	contains: function(user) {
		user = user || {};

		// if user is an id of user
		if (typeof user === "string") {
			user = this.get(user) || {};
		}

		return user.id in this.__data;
	}
};

module.exports = UsersList;