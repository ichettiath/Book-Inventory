const { auth, asyncMiddleware } = require("../middleware");
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const router = express.Router();
mongoose.set("useFindAndModify", false);

//defines the properties of a genre
const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 20 },
});

//creates a genre class
const Genre = mongoose.model("Genre", genreSchema);

//calls asyncMiddlware to wrap this function in a try catch block
router.get(
  "/",
  asyncMiddleware(async (req, res, next) => {
    const genres = await Genre.find();
    res.send(genres);
  })
);

//auth is passed in here because it is a middleware function that precedes this one
//auth checks the header of this request that should contain a valid user token
router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });

    await genre.save();
    res.send(genre);
  })
);

router.put(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //new property causes the response to send the updated version
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
  })
);

router.delete(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
  })
);

router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");
    res.send(genre);
  })
);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(genre);
}

module.exports = router;
module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validateGenre = validateGenre;
