import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getBook, saveBook } from "../services/fakeBookService";
import { getGenres } from "../services/fakeGenreService";

class BookForm extends Form {
  state = {
    data: {
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: "",
    },
    genres: [],
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number().required().min(0).label("Number in Stock"),
    dailyRentalRate: Joi.number()
      .required()
      .min(0)
      .max(10)
      .label("Daily Rental Rate"),
  };

  componentDidMount() {
    const genres = getGenres();
    this.setState({ genres });

    const bookId = this.props.match.params.id;
    if (bookId === "new") return;

    const book = getBook(bookId);
    if (!book) return this.props.history.replace("/not-found");
    this.setState({ data: this.maptoViewModel(book) });
  }

  maptoViewModel(book) {
    return {
      _id: book._id,
      title: book.title,
      genreId: book.genre._id,
      numberInStock: book.numberInStock,
      dailyRentalRate: book.dailyRentalRate,
    };
  }

  doSubmit = () => {
    saveBook(this.state.data);
    this.props.history.push("/books");
  };

  render() {
    return (
      <div>
        <h1>Book Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title", "text")}
          {this.renderSelect("genreId", "Genre", this.state.genres)}
          {this.renderInput("numberInStock", "Number in Stock", "text")}
          {this.renderInput("dailyRentalRate", "Rate", "text")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default BookForm;
