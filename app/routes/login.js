// login.js

// Route for authentication 

var User = require('../models/user');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../../config.js');

function post(req,res,next) {

	// find matching user
	User.findOne({
		email: req.body.email
	}, function(err,user) {

		if (err) return next(err);

		if (!user) {
			res.status(401).send({message: 'Invalid email or password.'});
			return;
		} else if (user) {

			// check if password matches
			bcrypt.compare(req.body.password,user.password,function(err,pwMatch) {
				var payload;

				if (err) {
					return next(err);
				}

				if (!pwMatch) {
					//ambiguous message not to alert invalid password
					res.status(401).send({message: 'Invalid email or password.'});
					return;
				}

				payload = {
					sub: user.email,
					role: user.role
				};


				res.status(200).json({
					// Why are we returning user object?
					// token has role and email should be able remove user object
					user: user,
					token: jwt.sign(payload, config.jwtSecretKey, {expiresInMinutes:60})
				});

			});
		}
	});
}

module.exports.post = post;
