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
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  // console.log(res.json(books));
  res.render("index", { books });

}));




// get /books/new - Shows the create new book form
router.get('/books/new', asyncHandler(async(req, res) => {
  res.render("new", { book: {} } );
}
));


// post /books/new - Posts a new book to the database
router.post('/books/new', asyncHandler(async (req, res) => {
  // Check the error. If the error caught by catch 
  // is a SequelizeValidationError, re-render the 
  // articles/new view ("New Article" form), passing 
  // in the errors to display:
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/");
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("new", { book, errors: error.errors})
    } else {
      throw error; // error caught in the asyncHandler's catch block

    }  
  }
}));


// get /books/:id - Shows book detail form
router.get("/books/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);

  const { search } = req.query;
  const { id } = req.params;
  const text = book[id][search];
const searchData = { text };

   if (book) {
     res.render("update-book", { book, searchData }); 
   } else {
    const err = new Error();
		err.status = 404;
		res.render('page-not-found', { err });   }
 }));
 



// post /books/:id - Updates book info in the database
router.post('/books/:id/', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books/"); 
    } else {
			res.render('page-not-found');
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct article gets updated
      res.render("update-book", { book, errors: error.errors })
    } else {
      throw error;
    }
  }
}));



// post /books/:id/delete - Deletes a book. 
// Careful, this can’t be undone. It can be helpful to create a new “test” 
// book to test deleting



router.post('/books/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
  await book.destroy();
   res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
 }));
 



// outer.get('/books/:id/', function(req, res, next) {
//   const title = await Book.findByPk(req.params.title);
//   Book.find({title: title}, function (err, book) {
//       if(err) {
//           return res.render('/');
//       }
//       res.render('books/:id', {book: title});
//   });
// }); r






















module.exports = router;
