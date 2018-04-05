// varieties.js
// plants.js

var Variety = require('../models/variety');
var Plant = require('../models/plant');
	
// route to return all varieties for a specified plant
function getAll(req,res,next) {

	// Find all varieties matching specified plant
	//req.params.plant_id

	Variety.find({}, function(err, varieties) {
    	res.status(200).json(varieties);
  	});

}

// route to save new variety
function post(req,res,next){

	var plantId = req.params.plant_id;

    // Validate Post Paramters
    if (!req.body.name){
		res.status(401).send({message: 'Name is missing'});
		return;
    }

    if (req.body.name.trim() === "") {
		res.status(401).send({message: 'Name is mandatory'});
		return;
    }

    // Need to check parent resource exists
    Plant.findById(plantId, function (err, plant) {
    	if (err) {
    		res.status(401).send({message: 'No such plant resource'});
    	} else {


    		// Validate passed plant name matches parent plant


    		// Need to check if this variety already exists
    		Variety.findOne({name: req.body.name}, function(err, results) {
    			if (results !== null) {
					res.status(401).send({message: 'Variety already exists'});
    			} else {

					var newVariety = new Variety({
						name: req.body.name,
						plant_id: plantId,
						plant: req.body.plant,
						sow_outside: req.body.sow_outside,
						inventory: req.body.inventory,
						notes: req.body.notes
					});

					console.log('name '+ req.body.name);
					console.log('type '+ plantId);

					newVariety.save(function(err) {
						if (err) throw err;
						res.status(200).json(newVariety);
					});
    			}
  			})
    	}
    })
}

// route to return variety by Id
function getById(req,res,next){

	// Add check that request is for specified parent plant resource

	// Use the Variety model to find the variety we want
	Variety.findById(req.params.variety_id, function(err, variety){
		if (err) throw err;
		res.status(200).json(variety);
	})
}

// route to update exisitng variety
function put(req,res,next){

	// Check valid object_id

	// Add check that update is for specified parent plant resource
	// Check parent id is valid object_id



	// Use the Variety model to find the variety we want to update
	Variety.findById(req.params.variety_id, function(err, variety){
		if (err) throw err;

		variety.name = req.body.name;
		variety.sow_outside = req.body.sow_outside;
		variety.inventory = req.body.inventory;
		variety.notes = req.body.notes;

		variety.save(function(err){
			if (err) throw err;
			res.status(200).json(variety);
		})
	})
}


function del(req,res,next){

	// Check for valid object_id

	// Check parent id is valid object_id

	// Add check that request is for specified parent resource

	console.log('variety id '+ req.params.variety_id);
	Variety.remove({
		_id: req.params.variety_id
	}, function(err, variety) {
		if (err) throw err;
		if (variety.result.n==1) {
			res.status(200).json({message: 'Successfully deleted'});
		} else {
			res.status(404).json({message: 'Variety does not exist'});
		}
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
