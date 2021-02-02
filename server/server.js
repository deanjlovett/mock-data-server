const express = require('express');
const bodyParser = require('body-parser');
// const morgan = require("morgan");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// const mockData = require('./mockUsers.json');
const mockDataObject = require('./mockUserObject.json');

// const mockMentor = require('./mentor.json');
// const mockMentee = require('./mentee.json');

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
    res.status(200).send('server is functioning');
});

app.get('/login', (req, res) => {
    const submittedUsername = req.query.username;

    let responseData;
//    responseData = mockDataObject[submittedUsername] ? mockDataObject[submittedUsername] : mockDataObject['badLogin'];
    responseData = mockDataObject[submittedUsername];
    console.log('responseData1: ', responseData);
    if( responseData === undefined ){
        responseData = mockDataObject['badLogin'];
    }

    if (responseData.userData.userId != 0) {
        //if its the admin send them all no-admin user data
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
            //if its not the admin send them their own user data

            responseData = {
                currentUserData: mockDataObject[submittedUsername]
            }
        }

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
        res.status(401).send();
    }
});

app.get('/authorizedDataRequest', withAuth, (req, res) => {
    //This is put in req.body by the middleware
    const { userName, userData } = req.body;
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
            responseData = {
                currentUserData: mockDataObject[submittedUsername]
            }
        }
        
        res.status(200).send(responseData);
        
});

app.post('./updateUser', (req, res) => {
    console.log(`In update: `, req);
})

module.exports = app;
