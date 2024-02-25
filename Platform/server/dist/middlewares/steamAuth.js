"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const express = require('express');
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
module.exports = ensureAuthenticated;