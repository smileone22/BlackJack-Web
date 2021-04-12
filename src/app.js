// app.js
const express = require('express');

const session = require('express-session');
const path = require('path');
const { isError } = require('util');

const app = express();



app.use(express.static(path.join(__dirname, 'public')));
//app.set('views', path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
// app.use(session({
//     secret: 'add session secret here!',
//     resave: false,
//     saveUninitialized: true,
// }));


app.listen(3000);