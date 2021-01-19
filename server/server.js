const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
require('dotenv').config();

const mockData = require('./mockUsers.json');
const mockMentor = require('./mentor.json');
const mockMentee = require('./mentee.json');

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

    let responseData = { 
        userData: {
            userId : 0,
            name: "",
            role: ""
        }
    };
    
    for (let i = 0; i < mockData.length; i++) {
        if (mockData[i].userData.name === submittedUsername) {
            switch(mockData[i].userData.role) {
                case 'admin':
                    responseData = mockData[i];
                break;
                case 'mentor':
                    responseData = mockMentor;
                break;
                case 'mentee': 
                    responseData = mockMentee;
                break;
                default:
                    //response data is already the dead mock. 
            }
        }
    }

    if (responseData.userId != 0) {
        //if its a real user issue a token and log in
        const payload = { submittedUsername, responseData };
        const token = jwt.sign(payload, secret, { expiresIn: '4h'});
        res.cookie('token', token, { httpOnly: false, secure: false }).status(200).send(responseData);
    } else {
        //if it's not a user send empty user data object
        res.status(200).send(responseData);
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

    let allNonAdminData = mockData.filter((user) => {
        return user.role != 'admin';
    });

    if (userData.role === 'admin') {
        res.status(200).send({
            allUserData: allNonAdminData
        });
    } else {

        //userData and userName are sent back having been parsed out of the token stuck in the Cookies, no need oo re-request explicitly if user has a valid token issued at login. 
        res.status(200).send({
            allUserData: [userData]
        });
    }

});

module.exports = app;
