const bcrypt = require('bcrypt');
const express = require('express');
const User = require("../models/User");
import { User as UserInterface } from './interfaces/interfaces';
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || "DEFAULT_SECRET";

export async function createUser (req:any, res:any): Promise<void> {
  const { email } = req.body;
  const user: UserInterface = await User.findOne({ email: email });
  if (user) {
    res.status(409).send({ error: '409', message: 'User already exists' });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      email: email,
      password: hashedPassword,
      region: req.body.region
    });
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
    console.log('New user created', savedUser);
  } catch (error) {
    res.status(400).send({ error, message: 'Could not save user' });
  }
};

export async function authUser (req:any, res:any) {
  User.findOne({ email: req.body.email })
    .then((user: UserInterface) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      bcrypt.compare(req.body.password, user.password)
        .then((passwordCheck: any) => {
          if (!passwordCheck) {
            return res.status(400).send({ message: "Passwords does not match" });
          }
          const token = jwt.sign({ userId: user._id, userEmail: user.email }, jwtSecret, { expiresIn: "24h" });
          res.status(200).send({ message: "Login Successful", email: user.email, token });
        })
        .catch((error: any) => {
          res.status(400).send({ message: "Passwords does not match", error });
        });
    })
    .catch((e: any) => {
      res.status(404).send({ message: "Email not found", e });
    });
}
