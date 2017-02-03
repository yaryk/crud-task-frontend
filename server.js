var express = require("express"),
	nodeStatic = require("node-static"),
	file = new nodeStatic.Server("."),
	bodyParser = require("body-parser"),
	fs = require("fs"),
	app = express(),
	userHandlerInit = require("./backend/handlers/user-handler"),
	USERS_PATH = __dirname + "/resources/data.json",
	LISTEN_PORT = 8081;

app.use(bodyParser.json());

var users = [];

fs.readFile(USERS_PATH, "utf8", function(err, usersJsonStr) {
	users = JSON.parse(usersJsonStr);
	var userHandler = userHandlerInit(users);
	app.post("/user", userHandler.add);

	app.put("/user", userHandler.update);

	app.get("/user", userHandler.get);

	app.delete("/user", userHandler.del);

	app.get("/countries", function(req, res) {
		var c = [];
		for (var i = 0; i < users.length; i++) {
			if (c.indexOf(users[i].country) === -1) {
				c.push(users[i].country);
			}
		}

		res.send(c);
	});

	console.log("Users API is ready...");

});


app.get("/", function(req, res) {
	file.serve(req, res);
});

app.get("/sample", function(req, res) {
	res.send({
		data: JSON.stringify(req.query)
	});
});

app.post("/sample", function(req, res) {
	res.send({
		data: JSON.stringify(req.body)
	});
});

app.get("/ping", function(req, res) {
	var expect = req.query.expect,
		course = req.query.course;
	if (!expect) {
		res.status(401)
			.send({
				message: "Parameter 'expect' is required! It is a string value."
			});
	} else if (!course) {
		res.status(401)
			.send({
				message: "Provide 'course' parameter value to success"
			});
	} else if (course !== "frontend") {
			res.status(403)
				.send({
					message: "Parameter 'course' is invalid."
				});
	} else {
		res.send({
			message: expect,
			secret: course
		});
	}
});

app.get("/css*", function(req, res) {
	file.serve(req, res);
});
app.get("/js*", function(req, res) {
	file.serve(req, res);
});

app.listen(LISTEN_PORT);
console.log("Listen port " + LISTEN_PORT);