var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var router = express.Router();


var monk = require('monk');
var db = monk('localhost:27017/expense');

router.get('/', function(req, res) {
    var collection = db.get('transactions');
    collection.find({}, function(err, trans){
        if (err) throw err;

      	res.json(trans);
    });
});

router.get('/:id', function(req, res) {
    var collection = db.get('transactions');
    collection.findOne({ _id: req.params.id }, function(err, tran){
        if (err) throw err;

      	res.json(tran);
    });
});


router.put('/:id', function(req, res){
    var collection = db.get('transactions');
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    collection.update({
        _id: req.params.id
    },
    { $set: {
        amount: req.body.amount,
        date: dateTime,
        }
    }, function(err, tran){
        if (err) throw err;

        res.json(tran);
    });
});


router.delete('/:id', function(req, res){
    var collection = db.get('transactions');
    collection.remove({ _id: req.params.id }, function(err, tran){
        if (err) throw err;

        res.json(tran);
    });
});



router.post('/:userID', function(req, res){
    var collection = db.get('transactions');
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    console.log(req.body.to);
   
    collection.insert({
        from: req.body.author,
        date: dateTime,
        to: req.body.to,
        amount: req.body.amount
    }, function(err, movie){
        console.log(err);
        if (err) throw err;

        res.json(movie);
    });
});

module.exports = router;

