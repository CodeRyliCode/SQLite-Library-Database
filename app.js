// Use the require method to import the instance of sequelize that 
// was instantiated for you in the models/index.js file when you used 
// the sequelize CLI
const Sequelize = require('sequelize');




var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');


//Setting up the middleware view engine to "pug"
app.set("view engine", "pug");

//using a static route AND express.static method to serve static public files
app.use("/static", express.static("public"));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });




// 404 handler
app.use((req, res) => {
  const err = new Error();
  err.status = 404;
  err.message = "So sorry, this page does not exist!";
  res.render('page-not-found', {err});

})

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

//  Global Error Handler
app.use((err, req, res, next) => {
  if (err.status === 404){
    res.render('page-not-found', { err })

  }else{
    err.message = "There was a server error!";
    res.status(err.status || 500);
    res.render('error', {err});
  }
  console.log(`You have hit a ${err.status} error!`);
 });



// The dialect parameter specifies the specific version of SQL you're 
// using (the SQL dialect of the database), which in this case it's 
// sqlite. Since SQLite is a file-based database that doesn't require 
// credentials or a host, you use the storage key to specify the file 
// path or the storage engine for SQLite. The value 'library.db' is 
// what we are using'.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db'
});


// async IIFE
(async () => {
  // Sync all tables
  await sequelize.sync({ force: true });

  try {
    await sequelize.authenticate();

    console.log("Connection to the database successful!");

  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errors = error.errors.map((err) => err.message);
      console.error("Validation errors: ", errors);
  } else {
    throw error;
  }
}

})();








module.exports = app;
