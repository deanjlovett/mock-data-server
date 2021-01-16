const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const jwt = require('jsonwebtoken');
require('dotenv').config();

//This is middle ware that will check a token if we want at some point. 
const withAuth = require('./with-auth.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

let mentorData = {
    onboarding: true,
    matched: true,
    training: false,
    schedule: false, 
    notes: false,
    currentStreak: 1,
    longestStreak: 3,
    rating: 3.5
}

let menteeData = {
    onboarding: true,
    matched: true,
    introduced: false,
    schedule: false, 
    smart: false,
    sessions: 1/3,
    lifetimeSessions: 8/9,
    rating: 3.5
}

app.get('/', (req, res) => {
    console.log('request made to root...');
    res.status(200).send("server is functioning");
});

app.get('/login', (req, res) => {
    console.log(req.query.role);
    //we can set teh variable role basedon on received post request content later. 
    let role = "administrator";
    
    res.status(200).send({
        userId: 12,
        role: role,
        userData: mentorData
    });
});

app.post('/login', (req, res) => {
    console.log(req)
    //we can set teh variable role basedon on received post request content later. 
    let role = "administrator";
    
    res.status(200).send({
        userId: 12,
        role: role,
        userData: mentorData
    });
});

app.get('/mentor', (req, res) => {
    
    res.status(200).send({mentorData: mentorData});
});

app.get('/mentee', (req, res) => {

    res.status(200).send({menteeData: menteeData});
});

app.get('/dashboard', (req, res) => {
    
    res.status(200).send([{
        userId: 13,
        role: "mentor",
        userData: mentorData
    }, {
        userId: 12,
        role: "mentee",
        userData: menteeData
    }]);
});

module.exports = app;
