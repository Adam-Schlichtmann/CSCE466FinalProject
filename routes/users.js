var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/chirps');

router.get('/', function(req, res) {
    var collection = db.get('users');
    collection.find({}, function(err, posts){
        if (err) throw err;
        
      	res.json(posts);
    });
});

// For login
router.get('/:id', function(req, res) {
  var collection = db.get('users');
  collection.findOne({ _id: req.params.id }, function(err, user){
      if (err) throw err;

      res.json(user);
  });
});

// add following
router.put('/:id', function(req, res){
  var collection = db.get('users');
  var follow = req.body.following;
  follow.push(req.params.id);
  collection.update({
      _id: req.body._id
  },
  { $set: {
      following: follow
  }
  }, function(err, user){
      if (err) throw err;

      res.json(user);
  });
});

// For registering a new user
router.post('/', function(req, res){
  var collection = db.get('users');
  console.log(req.body.userName);
  collection.insert({
      userName: req.body.userName,
      password: req.body.password,
      name: req.body.name,
      following: [],
      favorites: []
  }, function(err, user){
      if (err) throw err;

      res.json(user);
  });
});

module.exports = router;
