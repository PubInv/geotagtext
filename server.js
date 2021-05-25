const express = require('express');
const app = express();

/*

Config Vars:
process.env.
apiKey
authDomain
databaseURL
mapbox_accessToken
messagingSenderId
projectId
storageBucket

*/

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require('firebase/database');

console.dir(firebase);
console.dir("XXXX")
console.dir(firebase.apps);


var config = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId
};

firebase.initializeApp(config);


firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    console.log(errorCode);
    console.log(errorMessage);
});

var ref = firebase.database().ref();
//This should all be in server.js, right??



app.use(express.static(__dirname));
//app.use(express.bodyParser());
//for POST

app.get('/', function (req, res) {
  res.send('Hello, mundo!');
});

app.get('/x', function (req, res) {
  res.send('Hello, mr. X!:'+process.env.apiKey);
});

app.get('/reconfigureFromApp', function (req, res) {
    var appName = req.query.appName;
    firebase.database().ref('/apps/'+appName).once('value')
        .then(function(snapshot) {
	    var SNAPSHOT = JSON.stringify(snapshot);
	    res.send(SNAPSHOT);
	});
});

app.get('/checkForAppInDatabase', function (req, res) {
    var appName = req.query.appName;
    firebase.database().ref('/apps/'+appName).once('value')
        .then(function(snapshot) {
	    var SNAPSHOT = JSON.stringify({appExists : snapshot.exists()});
	    //var SNAPSHOT = JSON.stringify({appExists : true});
	    res.send(SNAPSHOT);
	});
});

app.get('/initMap', function (req, res) {
    //SAME AS /reconfigureFromApp!!!!, /getLastTagNum
    var appName = req.query.appName;
    firebase.database().ref('/apps/'+appName+'/tags/').once('value')
        .then(function(snapshot) {
	    var SNAPSHOT = JSON.stringify(snapshot);
	    res.send(SNAPSHOT);
	});
});

app.get('/getLastTagNum', function (req, res) {
    var appName = req.query.appName;
    firebase.database().ref('/apps/'+appName+'/tags/').once('value')
        .then(function(snapshot) {
	    var SNAPSHOT = JSON.stringify(snapshot);
	    res.send(SNAPSHOT);
	});
});

/*
app.post('/writeTag', function (req, res){  
    console.log("Req received: "+req);
    console.log("Req received: "+req.hello);
    console.log("Req received: "+req.query.hello);
    //console.log('body: ' + JSON.stringify(req.body));
    //console.log("Req received: "+JSON.stringify(req));
    //console.log("body.id "+req.body.id);
    //console.log("body.title "+req.body.title);
    //console.log("body.content "+req.body.content);
   //res.redirect('/'); - NEEDED???
   });*/

app.get('/writeTag', function (req, res) {
    //console.log(req.query.appname);
    //console.log(req.query.tagId);
    //console.log(req.query.taginfo);
    var obj = req.query.taginfo;
    obj["latitude"] = parseFloat(obj.latitude);
    obj["longitude"] = parseFloat(obj.longitude);
    //console.log(obj);
    
    firebase.database().ref('/apps/' + req.query.appname + "/tags/" + req.query.tagId).set(obj,
                                                 function(error) {
                                                     if (error) {
                                                         console.log("ERROR:",error);
                                                     } else {
                                                         console.log("SUCCESS");
                                                     }
                                                 });
});

app.get('/actuallyCreate', function (req, res) {
    console.log(req.query.appname);
    //console.log(req.query.taginfo);
    console.log(req.query.obj);
    var config = req.query.obj;
    for (const property in config) {
	if (config[property] == "false") {config[property] = false;}
	if (config[property] == "true") {config[property] = true;}
    }
    config.tags = {};
    //config.push(tags : {});
    console.log(config);
    firebase.database().ref('apps/' + req.query.appname).set(config,
						   function(error) {
						       if (error) {
							   // The write failed...
							   console.log("ERROR:",error);
						       } else {
							   // Data saved successfully!
							   console.log("SUCCESS");
						       }
						   });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('myapp listening on port ' + port);
});
