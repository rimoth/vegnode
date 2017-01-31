// server.js

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose    = require('mongoose');
var auth = require('./app/routes/auth.js')
var setup = require('./app/routes/setup.js');
var plants = require('./app/routes/plants.js');
var users = require('./app/routes/users.js');
var login = require('./app/routes/login.js');

var config = require('./config.js');
//var setup = require('/app/routes/setup.js');

var app; // can app be converted to constant???
var router;
var port = 3000;

mongoose.connect(config.database); 

app = express();
app.use(morgan('dev')); //logger
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

router = express.Router();

router.get('/public_stuff', function(req, res) {
   res.json({"message": "This is public stuff..."});
});


router.get('/setup', setup.get); // only used for setup
router.post('/login', login.post);

// Could we use router.use(auth()); ??? to invoke authentication
// We would then check role within the specific route calls.
// Don't think so - "Use" is used for all routes. Unless you code the explicit routes to avoid in auth.

router.post('/users', auth(), users.post); // no self-registration

router.get('/plants', auth(), plants.getAll);
router.get('/plants/:plant_id', auth(), plants.getById);
router.post('/plants', auth(), plants.post);
router.put('/plants/:plant_id', auth(), plants.put);
router.delete('/plants/:plant_id', auth(), plants.del);

app.use('/api', router);
 
app.listen(port, function() {
    console.log('Web server listening on localhost:' + port);
});