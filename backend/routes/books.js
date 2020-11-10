const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const { auth, asyncMiddleware } = require("../middleware");
const router = express.Router();
const { genreSchema, Genre } = require("./genres");
mongoose.set("useFindAndModify", false);

//defines the properties of a book
const Book = mongoose.model(
  "Books",
  new mongoose.Schema({
    title: { type: String, required: true, min: 0 },
    genre: { type: genreSchema, required: true, trim: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    pages: { type: Number, required: true, min: 0 },
    date: { type: String, required: true },
    numberInStock: { type: Number, required: true, min: 0 },
  })
);

function validateBook(book) {
  const schema = Joi.object({
    title: Joi.string().min(0).required(),

    //objectId is defined above and ensures a proper ID is passed
    genreId: Joi.objectId().required(),
    rating: Joi.number().min(0).required(),
    pages: Joi.number().min(0).required(),
    date: Joi.string().required(),
    numberInStock: Joi.number().required().min(0),
  });
  return schema.validate(book);
}

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const books = await Book.find();
    res.send(books);
  })
);

//auth is passed in here because it is a middleware function that precedes this one
router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validateBook(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre");

    let book = new Book({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      rating: req.body.rating,
      pages: req.body.pages,
      date: req.body.date,
      numberInStock: req.body.numberInStock,
    });

    await book.save();
    res.send(book);
  })
);

//auth is passed in here because it is a middleware functiont that precedes this one
router.put(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validateBook(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        rating: req.body.rating,
        pages: req.body.pages,
        date: req.body.date,
        numberInStock: req.body.numberInStock,
      },
      { new: true }
    );

    if (!book)
      return res.status(404).send("The book with the given ID was not found.");

    res.send(book);
  })
);

//auth is passed in here because it is a middleware functiont that precedes this one
router.delete(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book)
      return res.status(404).send("The book with the given ID was not found.");

    book.numberInStock--;
    if (book.numberInStock === 0) await Book.findByIdAndRemove(req.params.id);
    else book.save();

    res.send(book);
  })
);

router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book)
      return res.status(404).send("The book with the given ID was not found.");

    res.send(book);
  })
);

module.exports = router;
