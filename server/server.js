const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
require('dotenv').config();

const mockData = require('./mockUsers.json');
//This is middle ware that will check a token if we want at some point. 
const withAuth = require('./with-auth.js');
const secret = process.env.JWT_SECRET;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Credentials', true);
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


app.get('/', (req, res) => {
    console.log('request made to root...');
    res.status(200).send("server is functioning");
});

app.get('/login', (req, res) => {
    const submittedUsername = req.query.username;
    console.log(submittedUsername);

    let responseData = { 
            userId : 0,
            name: "",
            role: "",
            userData: {}
    };
    
    for (let i = 0; i < mockData.length; i++) {
        console.log(mockData[i], submittedUsername)
        if (mockData[i].name === submittedUsername) {
            responseData = mockData[i];
        }
    }

    if (responseData.userId != 0) {

        const payload = { submittedUsername, responseData };
        const token = jwt.sign(payload, secret, { expiresIn: '4h'});
        res.cookie('token', token, { httpOnly: false, secure: false }).status(200).send(responseData);
    } else {
        res.status(200).send({
            user: "no user found"
        });
    }
});

app.get('/mentor', withAuth, (req, res) => {
    //This is put in req.body by the middleware
    const { userName, userData } = req.body;

    //userData and userName are sent back having been parsed out of the token stuck in the Cookies, no need oo re-request explicitly if user has a valid token issued at login. 
    res.status(200).send({
        userName: userName,
        userData: userData
    });
});

app.get('/mentee', withAuth, (req, res) => {
    //This is put in req.body by the middleware
    const { userName, userData } = req.body;

    //userData and userName are sent back having been parsed out of the token stuck in the Cookies, no need oo re-request explicitly if user has a valid token issued at login. 
    res.status(200).send({
        userName: userName,
        userData: userData
    });
});

app.get('/dashboard', withAuth, (req, res) => {
    //This is put in req.body by the middleware
    const { userName, userData } = req.body;

    //userData and userName are sent back having been parsed out of the token stuck in the Cookies, no need oo re-request explicitly if user has a valid token issued at login. 
    res.status(200).send({
        userName: userName,
        userData: userData
    });
});

module.exports = app;
