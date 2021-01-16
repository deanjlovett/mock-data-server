//If we want to mock auth more thoroughly at some point this component is token validating middleware. 

const jwt = require('jsonwebtoken');
// const cookies = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();


const secret = process.env.JWT_SECRET;

const withAuth = (req, res, next) => {
    let token = req.cookies.token;
    console.log(`token: `, token)

    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        console.log('token again: ', token)
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                console.log(`Error: `, err)
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                console.log(`decoded: `, decoded)
                req.body.userName = decoded.submittedUsername;
                req.body.userData = decoded.responseData;
                next();
            }
        });
    }
};

module.exports = withAuth;
