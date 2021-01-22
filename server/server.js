const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
require('dotenv').config();

const mockData = require('./mockUsers.json');
const mockDataObject = require('./mockUserObject.json');

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

    let responseData;
//
//    responseData = mockDataObject[submittedUsername] ? mockDataObject[submittedUsername] : mockDataObject['badLogin'];
    responseData = mockDataObject[submittedUsername];
    console.log('responseData1: ', responseData);
    if( responseData === undefined ){
        responseData = mockDataObject['badLogin'];
    }
    console.log('responseData2: ', responseData);

    if (responseData.userData.userId != 0) {
        console.log('Good Login attempt ', responseData.userData)
        if (responseData.userData.role === 'admin') {
            let allUsers = [];
            for (user in mockDataObject) {
                if (["mentor", "mentee"].find( e => e === mockDataObject[user].userData.role  ) != undefined) {
                    allUsers.push(mockDataObject[user]);
                }
            }
            responseData = {
                currentUserData: mockDataObject[submittedUsername],
                allUsers: allUsers
            };  
        } else {
            responseData = {
                currentUserData: mockDataObject[submittedUsername]
            }
        }
        console.log('login responseData: ', JSON.stringify(responseData) );

        //if its a real user issue a token and log in
        const payload = { submittedUsername, responseData };
        const token = jwt.sign(payload, secret, { expiresIn: '4h'});
        res.cookie('token', token, { httpOnly: false, secure: false }).status(200).send(responseData);
    } else {
        //if it's not a user send empty user data object
        // responseData = {
        //     currentUserData: mockDataObject['badLogin']
        // }
        console.log('Bad Login attempt')
        res.status(401);
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
    console.log(`userData: `, userData);
    let userRole = userData.currentUserData.userData.role;

    let responseData;

    responseData = mockDataObject[userName] ? mockDataObject[userName] : mockDataObject['badLogin'];


        if (userRole === 'admin') {
            let allUsers = [];
            for (user in mockDataObject) {
                if (["mentor", "mentee"].find( e => e === mockDataObject[user].userData.role  ) != undefined) {
                    allUsers.push(mockDataObject[user]);
                }
            }
            responseData = {
                currentUserData: mockDataObject[submittedUsername],
                allUsers: allUsers
            };  
        } else {
            responseData = mockDataObject[userName];
        }
        
        res.status(200).send(responseData);
    

});

module.exports = app;
