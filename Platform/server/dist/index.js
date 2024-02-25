"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = void 0;
const express = require('express');
const cors = require('cors');
const router = require('./router');
const dotenv = require('dotenv');
const connectDB = require('./models/db');
const bodyParser = require('body-parser');
const passportConfig = require('./config/passport-config');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = exports.app = express();
const port = 3001;
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(router);
passportConfig.configureSessionMiddleware(app);

// Construct the path to the public directory
const publicDirectory = path.join(process.cwd(), 'public');
app.use(express.static(publicDirectory));
connectDB();
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
module.exports = {
  app,
  server
};