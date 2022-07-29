const express = require("express");
// const { is } = require("express/lib/request");
const router = express.Router();
//Import the Book model from the ../models folder
const Book = require("../models").Book;
//operators for search
const { Op } = require("sequelize");


/* Async handler from Treehouse. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}





/* GET books listings. */
router.get(
  "/books",
  asyncHandler(async (req, res) => {
    // console.log(res.json(books));
    const searchQuery = req.query.search ? req.query.search : "";

    const { count, rows } = await Book.findAndCountAll({
  
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchQuery}%` } },
          { author: { [Op.like]: `%${searchQuery}%` } },
          { genre: { [Op.like]: `%${searchQuery}%` } },
          { year: { [Op.like]: `%${searchQuery}%` } },
        ],
      },

    });



    res.render("index", {books}, searchQuery);

    // Right now when checking what 'books' contains, it shows up as
    // { count: 0, rows: [] } and I think that means that I need to include those
    // as a variable replacing the variable 'books' because the findAndCountAll is
    // expecting to have some data for {count } and { rows }. We now have to
    // include rows and count in our render for books: 
    console.log(books);
    // console.log(searchQuery);
  })
);

// get /books/new - Shows the create new book form
router.get(
  "/books/new",
  asyncHandler(async (req, res) => {
    res.render("new", { book: {} });
  })
);






/* Posts a new book to the database */
router.post('/books/new', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new-book", {book: book.dataValues, errors: error.errors })
    } else {
      throw error;
    }
  }
}));



/* Shows book detail form */
router.get('/books/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", { book });
  } else {
    const err = new Error();
    err.status = 404;
    res.render("page-not-found", { err });
  }
}));


/* Updates book info in the database */
router.post('/books/:id', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books/" + book.id);
    } else {
      res.render("page-not-found");
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", { book, errors: error.errors })
    } else {
      throw error;
    }
  }
}));



// /* Shows the full list of books */
// router.get('/books/:offset?/:page?', asyncHandler(async (req, res, next) => {
//   const offset = (req.params.offset) ? req.params.offset : 0;
//   const books = await Book.findAndCountAll({
//     limit: 5,
//     offset: offset
//   });
//   if (books) {
//     books.pages = Math.ceil(books.count / 5);
//     books.activePage = (req.params.page) ? req.params.page : 1;
//     res.render('books', { books });
//   } else {
//     // let error = new Error();
//     // error.status = 404;
//     // error.message = 'Sorry! We couldn`t find the page you were looking for';
//     // res.render('page-not-found', { error });
//   }
// }));


/* Deletes a book. Careful, this can’t be undone. It can be helpful */

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



module.exports = router;
