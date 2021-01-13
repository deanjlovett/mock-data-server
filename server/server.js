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

app.get('/', (req, res) => {
    console.log('request made to root...');
    res.status(200).send("server is functioning");
});

app.get('/login', (req, res) => {
    //we can set teh variable role basedon on received post request content later. 
    let role = "administrator";
    
    res.status(200).send({role: role});
});

app.get('/mentor', (req, res) => {

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
    
    res.status(200).send({mentorData: mentorData});
});

app.get('/mentee', (req, res) => {

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
    
    res.status(200).send({menteeData: menteeData});
});

app.get('/dashboard', (req, res) => {
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
    
    res.status(200).send({
        menteeData: menteeData,
        mentorData: mentorData
    });
});

module.exports = app;
