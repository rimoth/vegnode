// users.js

var User = require('../models/user');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../../config.js'); 

function post(req,res,next) {


	// Validate Post Parameters
    if (!req.body.email){
		res.status(401).send({message: 'Email is missing'});
		return;
    }

    if (req.body.email.trim() === "") {
		res.status(401).send({message: 'Email is mandatory'});
		return;
    }

	var user = {
		email: req.body.email
	};
	var unhashedPassword = req.body.password;
	
	//dev logging - remove
	console.log('password: '+ unhashedPassword);

	bcrypt.genSalt(10, function(err, salt) {
		if (err) {
			return next(err);
		}
		// dev logging - remove
		console.log('salt: '+salt);

		bcrypt.hash(unhashedPassword, salt, function(err,hash) {
			if (err) {
				return next (err);
			}

			user.hashedPassword = hash;
			user.role = 'base'; 

			// create new user 
  			var newUser = new User({ 
    			email: user.email, 
    			password: user.hashedPassword,
    			role: user.role 
  			});

  			// save the sample user
  			newUser.save(function(err) {
    			var payload;

    			if (err) {
    				return next (err);
    			}

    			console.log('User saved successfully');

    			payload = {
    				// Why is user account referred to as sub?????
    				sub: user.email,
    				role: user.role
    			}

    			// this needs changing!
    			// this returns the hashed password
    			res.status(200).json({
                    user: user,
                    token: jwt.sign(payload, config.jwtSecretKey, {expiresInMinutes: 60})
    
  				});

			});
		});

	});
}

module.exports.post = post;