// auth.js

var jwt = require('jsonwebtoken');
var config = require('../../config.js');

function auth(role) {
	return function(req,res,next) {

		var token;
		var payload;

		if (!req.headers.authorization) {
			return res.status(401).send({message: 'You are not authorized'});
		}

		token = req.headers.authorization.split(' ')[1];

		try{
			payload = jwt.verify(token,config.jwtSecretKey)
		} catch (e) {
			if (e.name === 'TokenExpiredError') {
				res.status(401).send({message: 'Token Expired'});
			} else {
				res.status(401).send({message: 'Authentication Failed'});
			}

			return;
		}

		if (!role || role === payload.role) {
			// pass through some user details in case they are required.
			req.user = {
				email: payload.sub,
				role: payload.role
			};
			// Good to go!
			next(); 

		} else {
			res.status(401).send({message: 'You are not authorized'})
		}
	}
}

module.exports = auth;