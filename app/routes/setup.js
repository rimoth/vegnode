// setup.js

var User  = require('../models/user');
var Plant = require('../models/plant');
	
function get(req,res,next) {

  // Saving the sample user below is now non-sensical as since this early example we have now have hashed passwords.

  // create a sample user
  var newUser = new User({ 
    email: 'test@test.com', 
    password: 'password',
    role: 'base' 
  });

  // save the sample user
  newUser.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    
  });

  // create sample data
  var newPlant = new Plant({
  	name: 'Artichoke, Globe',
  	type: 'veg'
  });

  // save the sample user
  newPlant.save(function(err) {
    if (err) throw err;
    console.log('Plant saved successfully');
  });

  // create sample data
  var newPlant = new Plant({
  	name: 'Artichoke, Jerusalem',
  	type: 'veg'
  });

  // save the sample user
  newPlant.save(function(err) {
    if (err) throw err;
    console.log('Plant saved successfully');
  });

  res.json({ success: true });

};

module.exports.get = get;
