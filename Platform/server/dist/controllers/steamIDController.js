"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkSteamID = void 0;
const express = require('express');
const User = require("../models/User");
const dotenv = require('dotenv');
dotenv.config();
const checkSteamID = async (req, res) => {
  const email = req.body.userEmail;
  const user = await User.findOne({
    email: email
  });
  if (!user) {
    return res.status(404).send({
      error: '404',
      message: 'User was not found.'
    });
  }
  if (user.steamID) {
    return res.status(404).send({
      error: '404',
      message: 'User already has a Steam ID'
    });
  }

  // If the user is found and does not have a Steam ID, send a success response
  return res.status(200).send({
    message: 'User does not have a Steam ID'
  });
};
exports.checkSteamID = checkSteamID;