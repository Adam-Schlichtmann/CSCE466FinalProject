var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var router = express.Router();


var monk = require('monk');
var db = monk('mongodb:admin:admin@ec2-54-146-61-11.compute-1.amazonaws.com:27017/expenseDB');

router.get('/', function(req, res) {
    var collection = db.get('groups');
    collection.find({}, function(err, groups){
        if (err) throw err;

      	res.json(groups);
    });
});

router.get('/:id', function(req, res) {
    var collection = db.get('groups');
    collection.findOne({ _id: req.params.id }, function(err, group){
        if (err) throw err;

      	res.json(group);
    });
});

// update members of a group
router.put('/:id', function(req, res){
    var collection = db.get('groups');
    var mems = req.body.members;
    console.log(req.body.members);
    console.log(req.params.id);
    console.log(req.body._id);
    mems.push(req.params.id);
    collection.update({
        _id: req.body._id
    },
    { $set: {
        members: mems
        }
    }, function(err, group){
        if (err) throw err;

        res.json(group);
    });
});


router.delete('/:id', function(req, res){
    var collection = db.get('groups');
    collection.remove({ _id: req.params.id }, function(err, group){
        if (err) throw err;

        res.json(group);
    });
});


// make a new Group with the user who created it in the group
router.post('/:userID', function(req, res){
    var collection = db.get('groups');
    collection.insert({
        groupName: req.body.groupName,
        members: [req.params.userID]
    }, function(err, group){
        console.log(err);
        if (err) throw err;

        res.json(group);
    });
});

module.exports = router;

