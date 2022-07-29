const express = require("express");
// const { is } = require("express/lib/request");
const router = express.Router();
//Import the Book model from the ../models folder
const Book = require("../models").Book;
//operators for search
const { Op } = require("sequelize");
const pageLimit = 5; // limits how many books are displayed on each page


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





// * GET: /books
// * Shows the full list of books
// */
router.get(
 "/books",
 asyncHandler(async (req, res) => {
   const allBooks = await Book.findAll({
     order: [["createdAt", "DESC"]],
   });
   const pages = Math.ceil(allBooks.length / pageLimit);
   let page = 1;
   if (req.query.page) {
     page = req.query.page;
   }
   let search = false;
   const books = allBooks.slice((page - 1) * pageLimit, pageLimit * page);
   res.render("index", { title: "Books", books, pages, page });
 })
);







router.post(
  "/books",
  asyncHandler(async (req, res) => {
    const { search } = req.body;
    const allBooks = await Book.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            author: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            genre: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            year: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
      order: [["createdAt", "DESC"]],
    });
    const pages = Math.ceil(allBooks.length / pageLimit);
    let page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const books = allBooks.slice((page - 1) * pageLimit, pageLimit * page);
    res.render("index", { title: "Books", books, pages, page, search });
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
      res.redirect("/books/");
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
