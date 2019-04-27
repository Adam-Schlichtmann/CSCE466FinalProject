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

//update transactions by removing a transaction
router.put('/:id/:transID', function(req, res){
  console.log('updating user transactions');
  var collection = db.get('users');
  var userID = req.params.id;
  var transID= req.params.transID;
  var userHolder;
  var transactionsTemp;
  collection.findOne({ _id: userID }, function(err, user){
      if (err) throw err;

      userHolder = user;
  });
  for(var i =0; i <user.transactions.length;i++){
    if(userHolder.transactions[i] == transID){
      transactionsTemp = userHolder.transactions.splice[i,1];
    }
  }
  collection.update({
    _id: userID
    },
    { $set: {
        transactions: transactionsTemp
    }
    }, function(err, user){
        if (err) throw err;
        console.log('user transactions updated!');
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
