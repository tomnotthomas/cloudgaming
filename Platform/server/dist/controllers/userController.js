"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authUser = authUser;
exports.createUser = createUser;
const bcrypt = require('bcrypt');
const express = require('express');
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || "DEFAULT_SECRET";
async function createUser(req, res) {
  const {
    email
  } = req.body;
  const user = await User.findOne({
    email: email
  });
  if (user) {
    res.status(409).send({
      error: '409',
      message: 'User already exists'
    });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      email: email,
      password: hashedPassword,
      zone: req.body.zone
    });
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
    console.log('New user created', savedUser);
  } catch (error) {
    res.status(400).send({
      error,
      message: 'Could not save user'
    });
  }
}
;
async function authUser(req, res) {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (!user) {
      return res.status(404).send({
        message: "User not found"
      });
    }
    bcrypt.compare(req.body.password, user.password).then(passwordCheck => {
      if (!passwordCheck) {
        return res.status(400).send({
          message: "Passwords does not match"
        });
      }
      const token = jwt.sign({
        userId: user._id,
        userEmail: user.email
      }, jwtSecret, {
        expiresIn: "24h"
      });
      res.status(200).send({
        message: "Login Successful",
        email: user.email,
        token
      });
    }).catch(error => {
      res.status(400).send({
        message: "Passwords does not match",
        error
      });
    });
  }).catch(e => {
    res.status(404).send({
      message: "Email not found",
      e
    });
  });
}