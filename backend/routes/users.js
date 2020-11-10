const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { auth, asyncMiddleware } = require("../middleware");
const router = express.Router();
mongoose.set("useCreateIndex", true);

//defines the properties of a user
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
});

//every user is given a unique JSON webtoken for identification purposes
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};

const User = mongoose.model("Users", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
}

//creating a new api endpoint to access the current user
router.get(
  "/me",
  auth,
  asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  })
);

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("This email is already registered.");

    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    //encrypts the users password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();

    //the user is sent with a header containing its unique JSON webtoken
    res.header("x-auth-token", token).send(user);
  })
);

module.exports = router;
module.exports.User = User;
