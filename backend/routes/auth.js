const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User } = require("./users");
const { asyncMiddleware } = require("../middleware");
mongoose.set("useCreateIndex", true);

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(req);
}

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    //returns whether the inputted password is same as the email's password
    const correctPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!correctPassword)
      return res.status(400).send("Invalid email or password");

    //sends the user's webtoken
    const token = user.generateAuthToken();
    res.send(token);
  })
);

module.exports = router;
