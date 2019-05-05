const express = require("express");
const app = express();
var request = require('request');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
db = low(adapter);
db.defaults({users : [ { username : "", password : "",  classification : "", genre : ""} ] })
  .write()
const bodyParser = require('body-parser');
const session = require('express-session');
const sessionOptions = {
    secret: 'the ultimate session hash key',
    saveUninitialized: false,
    resave: false
};
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));
const classificationNames =  ["Arts & Theatre", "Film", "Miscellaneous", "Music", "Sports", "Undefined", "Donation", "Event Style", "Group", "Individual", "Merchandise", "Nonticket", "Parking", "Transportation", "Upsell", "Venue Based"]
genreId = (x) =>{
    switch (x)  
    { 
       case "R&B": 
           return "KnvZfZ7vAee"
           break; 
       case "Hip-Hop/Rap": 
           return "KnvZfZ7vAv1"
           break; 
       case "Comedy": 
           return "KnvZfZ7vAe1"
           break;
        case "Classical":
            return "KnvZfZ7v7nJ" 
            break;
        case "Jazz":
            return "KnvZfZ7vAvE" 
            break;
        case "Foreign":
            return "KnvZfZ7vAk1" 
            break;
        case "Dance/Electronic":
            return "KnvZfZ7vAvF" 
            break;
        case "Comedy":
            return "KnvZfZ7vAkA" 
            break;
        case "Animation":
            return "KnvZfZ7vAkd" 
            break;
        case "Music":
            return "KnvZfZ7vAkJ" 
            break;
        case "Miscellaneous":
            return "KnvZfZ7vAka";
            break;
        case "Family":
            return "KnvZfZ7vAkF"
            break;
        case "Miscellaneous Theatre":
            return "KnvZfZ7v7ld"
            break;
        case "Theatre":
            return "KnvZfZ7v7l1"
            break;        
       default: 
           return "";
    } 
}




app.post('/register', function(req,res){
    if(!classificationNames.includes(req.body.classification)){
        return res.status(400).send("Invalid Classification");
    }
    if(genreId(req.body.genre)==""){
        return res.status(400).send("Invalid Genre");
    }
    if(db.get('users').has({ username : req.body.username}).value()){
        return res.status(400).send("username already exists");
    }
    db.get('users').push({ username: req.body.username, password: req.body.password, classification : req.body.classification, genre: req.body.genre}).value();
    const user = db.get('users').find({ username: req.body.username, password: req.body.password, classification : req.body.classification, genre: req.body.genre}).value();
    res.status(200).send(user);
    
})

/*
*app.get versions exists only  allow for quick debugging/testing with browser could also use curl
app.get('/register', function(req,res){
    if(!classificationNames.includes(req.query.classification)){
        res.status(400).send("Invalid Classification");
    }
    if(genreId(req.query.genre)==""){
        res.status(400).send("Invalid Genre");
    }
    if(db.get('users').find({ username : req.query.username})){
        res.status(400).send("username already exists");
    }
    db.get('users').push({ username: req.query.username, password: req.query.password, classification : req.query.classification, genre: req.query.genre}).value();
    const user = db.get('users').find({ username: req.query.username, password: req.query.password, classification : req.query.classification, genre: req.query.genre}).value();
    res.status(200).send(user);
    
})
*/

app.get('/login', function(req,res){
    if(db.get('users').find({ username : req.query.username, password : req.query.password}).value()){
        req.session.username = req.query.username;
        req.session.password = req.query.password;
        res.redirect('/getPreferences');
    }
    else{
        res.status(400).send("Failure to login, username or password incorrect");
    }

})

app.get('/getEvents', function(req,res){
    if(req.session.username && req.session.password){
        var name = req.session.username;
        var pass = req.session.password;
        const user = db.get('users').find({ username : name, password : pass});
        var classificationName = user.get('classification').value();
        var genre = user.get('genre').value();
        var genre = genreId(genre);
        var username = 'stitapplicant'
        var password = 'zvaaDsZHLNLFdUVZ_3cQKns'
        var options = {
        url: 'https://yv1x0ke9cl.execute-api.us-east-1.amazonaws.com/prod/events',
        auth: {
            user: username,
            password: password
        }
        }
        options.url +="?"+"classificationName="+classificationName+"&genreId"+genre;
        console.log(options.url);
        request(options, function (err, resp, body) {
        if (err) {
            console.log(err)
            res.status(400).send("Error");
        }
        console.log(body);
        res.status(resp.statusCode).send(body);
        })
    }
    else{
        res.status(400).send("Not logged in");
    }


})

app.post('/setPreferences', function(req,res){
    if(req.session.username && req.session.password){

        const user = db.get('users').find({ username : req.session.username, password : req.session.password});
        if(req.body.classification || req.body.genre){
            if(req.body.classification){
                if(!classificationNames.includes(req.body.classification)){
                    return res.status(400).send("Invalid Classification");
                }
                user.set('classification', req.body.classification).value();
            }
            if(req.body.genre){
                if(genreId(req.body.genre)==""){
                    return res.status(400).send("Invalid Genre");
                }
                user.set('genre', req.body.genre).value();
            }
            db.write();
            res.status(200).send(user);
        }
        else{
            res.status(400).send("Please set new classifications");
        }
    }
    else{
        res.status(400).send("Please login");
    }
})


/*
*app.get versions exists only to allow for quick debugging/testing 
*I only knew how to test post requests with curl and since I couldnt log in with a session with curl, I could only test this from the browser
*and it was much easier/faster to test from the browser with get
app.get('/setPreferences', function(req,res){
    if(req.session.username && req.session.password){

        const user = db.get('users').find({ username : req.session.username, password : req.session.password});
        if(req.query.classification || req.query.genre){
            if(req.query.classification){
                if(!classificationNames.includes(req.query.classification)){
                    return res.status(400).send("Invalid Classification");
                }
                user.set('classification', req.query.classification).value();
            }
            if(req.query.genre){
                if(genreId(req.query.genre)==""){
                    return res.status(400).send("Invalid Genre");
                }
                user.set('genre', req.query.genre).value();
            }
            db.write();
            res.status(200).send(user);
        }
        else{
            res.status(400).send("Please set new classifications");
        }
    }
    else{
        res.status(400).send("Please login");
    }
})

*/

app.get('/getPreferences', function(req,res){
    if(req.session.username && req.session.password){
        const user = db.get('users').find({ username : req.session.username, password : req.session.password});
        const obj = {
            Genre : user.get("genre").value(),
            Classification : user.get("classification").value(),
        };
        res.status(200).json(obj);

    }
    else{
        res.status(400).send("Please login");
    } 
        

})


const port = process.env.PORT || 3000;

app.listen(port, () => {console.log(`Server is listening on ${port}`)});
