var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/expense');

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

// get users from a list of ids
router.get('/group/:id', function(req, res) {
    var users = req.params.id.split(",");
    var collection = db.get('users');
    collection.find({ _id: {$in: 
        users
    } 
    }, function(err, users){
        if (err) throw err;
  
        res.json(users);
    });
  });

// New transaction
router.put('/:id', function(req, res){
  var collection = db.get('users');
  var trans = req.body.transactions;
  trans.push(req.params.id);
  collection.update({
      _id: req.body._id
  },
  { $set: {
      transactions: trans
  }
  }, function(err, user){
      if (err) throw err;

      res.json(user);
  });
});

// remove transaction when removing it
router.put('/remove/:id', function(req, res){
  var collection = db.get('users');
  var trans = req.body.transactions;
  console.log(trans);
  for(var i = 0; i<trans.length;i++){
    if(trans[i] == req.params.id){
      trans.splice(i,1);
      console.log("removed");
    }
  }
  console.log(trans)
  collection.update({
      _id: req.body._id
  },
  { $set: {
      transactions: trans
  }
  }, function(err, user){
      if (err) throw err;

      res.json(user);
  });
});

// New group
router.put('/group/:id', function(req, res){
  var collection = db.get('users');
  var groups = req.body.groups;
  groups.push(req.params.id);
  console.log(req.body.user);
  console.log("wasdf");
  console.log(req.params.id);
  collection.update({
      _id: req.body._id
  },
  { $set: {
      groups: groups
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
      transactions: [],
      groups: []
  }, function(err, user){
      if (err) throw err;

      res.json(user);
  });
});

module.exports = router;
