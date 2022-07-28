var express = require("express");
var router = express.Router();
//Import the Book model from the ../models folder
const Book = require("../models").Book;
//operators for search
const { Op } = require("sequelize");

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      res.status(500).send(error);
    }
  };
}

/* GET books listings. */
router.get(
  "/books",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    const search = req.query;
    const id  = req.params;
    // const text = books[id][search];
    // const searchData = { text };

    res.render("index", { books } );

    // console.log(res.json(books));

    console.log(req.query.search);
    console.log(req.params.id);
  })
);

// get /books/new - Shows the create new book form
router.get(
  "/books/new",
  asyncHandler(async (req, res) => {
    res.render("new", { book: {} });
  })
);

// post /books/new - Posts a new book to the database
router.post(
  "/books/new",
  asyncHandler(async (req, res) => {
    // Check the error. If the error caught by catch
    // is a SequelizeValidationError, re-render the
    // articles/new view ("New Article" form), passing
    // in the errors to display:
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        // checking the error
        book = await Book.build(req.body);
        res.render("new", { book, errors: error.errors });
      } else {
        throw error; // error caught in the asyncHandler's catch block
      }
    }
  })
);

// get /books/:id - Shows book detail form
router.get(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);

    if (book) {
      res.render("update-book", { book });
    } else {
      const err = new Error();
      err.status = 404;
      res.render("page-not-found", { err });
    }
  })
);

// post /books/:id - Updates book info in the database
router.post(
  "/books/:id/",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books/");
      } else {
        res.render("page-not-found");
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id; // make sure correct article gets updated
        res.render("update-book", { book, errors: error.errors });
      } else {
        throw error;
      }
    }
  })
);

// post /books/:id/delete - Deletes a book.
// Careful, this can’t be undone. It can be helpful to create a new “test”
// book to test deleting

router.post(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  })
);

//  I’d suggest to make the following change to the
//   /views/index.pug file to start with. On line 12 change
//    the form tag from this:
//  form(method='post' action=`/books/${searchData}`)
//  To this:
//  form
//  This will default back to a GET request and will add
//  the values from the input as a query string to the url
//   like so:
//  http://localhost:3000/books?search=test
//  From there in your routes/books.js file in the /books
//  GET route you can access the value from the query
//   string like so:

module.exports = router;
