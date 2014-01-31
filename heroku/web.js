//Express
var express = require('express');
var app = express();
app.use(express.bodyParser())

// Mongo
var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  "mongodb://localhost/scorecenter";
  //"mongodb://bcad2130:bcadig01@dharma.mongohq.com:10097/scorecenter";

var db = mongo.Db.connect(mongoUri, function (err, dbConnection) {
	if (err)console.log("error");
	else db = dbConnection;
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

/*
MongoClient.connect(mongoUri, function(err, db) {
  if(!err) {
    console.log("We are connected");

  db.createCollection('scores', {w:1}, function(err, collection) {}); 
  
  collection = db.collection('scores');

  }
});
*/

app.all('/', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});


app.post('/submit.json', function(req, res) {
		if(!req.body.game_title)
			res.send("No game title.");
		if(!req.body.username)
			res.send("No username.");
		if(!parseInt(req.body.score))
			res.send("Score not an integer");
	
		var doc = { "game_title":"", "username":"", "score":"", "created_at":"" };
		doc.game_title = req.body.game_title;
		doc.username = req.body.username;
		doc.score = req.body.score;
		doc.created_at = new Date();
		db.collection('scores', function(err, scores) {
			if(err){
				res.send("Oh No!")
			} else scores.insert(doc, {w:1}, function(err, result) {
				if(err){
					res.send("Cannot insert.");
				} else {
					res.send(result[0]);
				}
			});
		});
});

app.get('/highscores.json', function(req, res) {
	db.collection('scores', function(err, scores) {
		if(!err){
			var title = req.query.game_title;
			scores.find({game_title:title}).sort({score:-1}).limit(10).toArray(function(err,items){
				if(!err)
					res.send(items);
				else res.send("Error!")
			});
		} else
			res.send("Error!");
	});
  //res.send('High Scores');
});

app.get('/', function(req, res) {
	db.collection('scores', function(err, scores) {
		if(!err){
			scores.find().toArray(function(err, items) {
				res.set('Content-Type', 'text/html');
				var html = '<!DOCTYPE html><html><head><title>Score Center</title></head><body>';
				html += '<h2>Score Center</h2><p>Here are the scores.<p>';
				html += '<table border="1"><tr><th>Game Title</th><th>Username</th><th>Score</th><th>Date Created</th></tr>';

				for(var i=0;i<items.length;i++)
				{
					html += '<tr><td>'+items[i].game_title+'</td>';
					html += '<td>'+items[i].username+'</td>';
					html += '<td>'+items[i].score+'</td>';
					html += '<td>'+items[i].created_at+'</td></tr>';	
				}
				html += '</table></body></html>';
				res.send(html);
			});
		} else res.send("Error!");
	})
});

app.get('/usersearch', function(req, res) {
	db.collection('scores', function(err, scores) {
		if(!err){
			scores.find().toArray(function(err, items) {
				res.set('Content-Type', 'text/html');
			
				var html = '<!DOCTYPE html><html><head><title>Score Center</title></head><body>';
				html += '<h2>User Search</h2><p>Search for user name.</p>';
				html += '<form name="search" action="/usersearched" method="post" id="usersearch">';
				html += 'Username: <input type="text" name="username" id="input"><input type="submit" value="Submit" id="submit"></form>';
				html += '</body></html>';
				res.send(html);
			});
		}
	})
});

app.post('/usersearched', function(req, res) {
	db.collection('scores', function(err, scores) {
		if(!err){
			scores.find().toArray(function(err, items) {
				var html = '<!DOCTYPE html><html><head><title>Score Center</title></head><body>';
				html += '<h2>Search Results</h2><p>You searched for: ' + req.body.username + '</p>';
				html += '<table border="1"><tr><th>Game Title</th><th>Username</th><th>Score</th><th>Date Created</th></tr>';
				for(var i=0;i<items.length;i++)	{
					if(items[i].username == req.body.username){;
						html +=	'<tr><td>'+items[i].game_title+'</td>';
						html +=	'<td>'+items[i].username+'</td>';
						html +=	'<td>'+items[i].score+'</td>';
						html +=	'<td>'+items[i].created_at+'</td></tr>';
					}
				}
				html +=	'</body></html>';
				res.send(html);
			});
		}
	})
});