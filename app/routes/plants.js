// plants.js

var Plant = require('../models/plant');
	
// route to return all plants
function getAll(req,res,next) {

	Plant.find({}, function(err, plants) {
    	res.status(200).json(plants);
  	});

}

// route to save new plant
function post(req,res,next){

    // Validate Post Paramters
    if (!req.body.name){
		res.status(401).send({message: 'Name is missing'});
		return;
    }

    if (req.body.name.trim() === "") {
		res.status(401).send({message: 'Name is mandatory'});
		return;
    }

    // Need to check if this plant already exists

	// Validate plant type against known types

	// All good let's save our new plant
	var newPlant = new Plant({
		name: req.body.name,
		type: req.body.type
	});

	console.log('name '+ req.body.name);
	console.log('type '+ req.body.type);


	newPlant.save(function(err) {
		if (err) throw err;
		res.status(200).json(newPlant);
	});
}

// route to return plant by Id
function getById(req,res,next){

	// Use the Plant model to find the plant we want
	Plant.findById(req.params.plant_id, function(err, plant){
		if (err) throw err;
		res.status(200).json(plant);
	})
}

// route to update exisitng plant
function put(req,res,next){

	// Use the Plant model to find the plant we want to update
	Plant.findById(req.params.plant_id, function(err, plant){
		if (err) throw err;

		plant.name = req.body.name;
		plant.type = req.body.type;

		plant.save(function(err){
			if (err) throw err;
			res.status(200).json(plant);
		})
	})
}


function del(req,res,next){
	Plant.remove({
		_id: req.params.plant_id
	}, function(err, plant) {
		if (err) throw err;
		res.status(200).json({message: 'Successfully deleted'})
	})
}

//module.exports.getAll = getAll;

module.exports = {
	getAll: getAll,
	post: post,
	put: put,
	getById: getById,
	del: del
}
