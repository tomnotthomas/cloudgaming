export{};
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const { Request, Response, NextFunction } = require('express');

async function auth(req:any, res:any, next:any) {
  try {
    // Get the token from the authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Check if the token matches the supposed origin
    const decodedToken = jwt.verify(token, jwtSecret);

    // Retrieve the user details of the logged-in user
    const user = decodedToken;

    // Pass the user down to the endpoints here
    req.user = user;

    // Pass down functionality to the endpoint
    next();

  } catch (error) {
    res.status(401).json({
      error: new Error("Invalid request to auth!"),
    });
  }
}

async function authByToken(req:any, res:any, next:any) {
  try {
    // Get the token from the authorization header
    const token = req.cookies.TOKEN;

    // Check if the token matches the supposed origin
    const decodedToken = jwt.verify(token, jwtSecret);

    // Retrieve the user details of the logged-in user
    const user = decodedToken;

    // Pass the user down to the endpoints here
    req.user = user;

    // Pass down functionality to the endpoint
    next();

  } catch (error) {
    res.status(401).json({
      error: new Error("Invalid request to auth Token!"),
    });
  }
}

module.exports = {
  auth,
  authByToken
};
