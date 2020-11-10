const express = require("express");
const genres = require("./routes/genres");
const books = require("./routes/books");
const users = require("./routes/users");
const auth = require("./routes/auth");
const config = require("config");
const app = express();
const mongoose = require("mongoose");

//any unexpected error will be caught here
process.on("uncaughtException", (ex) => {
  console.error("Uncaught Exception.");
});

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/Book_Inventory", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err.message));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/books", books);
app.use("/api/users", users);
app.use("/api/auth", auth);

//handles errors for server issues
app.use(function (err, req, res, next) {
  res.status(500).send("Something failed");
});

//if a port is defined connect to it, if not connect to localhost 4000
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
