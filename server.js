if (!process.env.PORT) {
  require('dotenv').config()
  process.env.NODE_ENV = "dev"
}

// Express is the main framework
const express = require('express');
// path is for working with file and directory paths
const path = require('path');
// favicon serves the favicon
const favicon = require('serve-favicon');
// morgan is for logging HTTP requests
const logger = require('morgan');
// parses cookie headers and populates req.cookies with an object keyed by the cookie names
const cookieParser = require('cookie-parser');
// parses the body of incoming HTTP requests
const bodyParser = require('body-parser');
// allows for HTTP verbs such as PUT or DELETE in places where the client doesn't support it
const methodOverride = require('method-override')

// Initialize Express (a web framework for Node.js)
const app = express();

app.locals.PUBLIC_STRIPE_API_KEY = process.env.PUBLIC_STRIPE_API_KEY

// Set up Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/local', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// view engine setup - This tells Express where to find the views and what template engine to use. 
// Here, 'pug' is used as the template engine
app.set('views', path.join(__dirname, 'views'));
// Pug is an HTML preprocessor that simplifies HTML into a python-like syntax
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// logger is for logging HTTP requests
app.use(logger('dev'));
// body-parser parses incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// cookie-parser parses cookie headers.
app.use(cookieParser());

// Imports and uses the routes defined in the 'index.js' and 'pets.js' files.
require('./routes/index.js')(app);
require('./routes/pets.js')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
