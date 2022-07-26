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


/* GET books listings. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  // console.log(res.json(books));
  res.render("index", { books, title: "New Book" });

}));

module.exports = router;
