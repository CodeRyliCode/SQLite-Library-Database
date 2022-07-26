var express = require('express');
var router = express.Router();
//Import the Book model from the ../models folder
const Book = require("../models").Book;



/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
res.status(500).send(error);
    }
  }
}


/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  // console.log(res.json(books));
  if(books) {
  res.render('index', { title: 'Express' });
  } else {
    res.sendStatus(404);
    const err = new Error();
    // The page will have a 404 not found error status
    err.status = 404;
        // Custom error message for the user
        err.message = "So sorry, this page does not exist!";
        // We render the 404 page, passing error
        res.render("page-not-found", { err });
  }
}));







module.exports = router;
