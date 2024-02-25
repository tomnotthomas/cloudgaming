export {}
const express = require('express');

function ensureAuthenticated(req:any, res:any, next:any) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

module.exports = ensureAuthenticated;