import React, { Component } from "react";
import { Link } from "react-router-dom";
import Like from "./common/like";
import Table from "./common/table";

class BooksTable extends Component {
  columns = [
    {
      path: "title",
      label: "Title",
      content: (book) => <Link to={`/books/${book._id}`}>{book.title}</Link>,
    },
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { path: "dailyRentalRate", label: "Rate" },
    {
      key: "like",
      content: (book) => (
        <Like liked={book.liked} onClick={() => this.props.onLike(book)} />
      ),
    },
    {
      key: "delete",
      content: (book) => (
        <button
          className="btn btn-danger btn-sm"
          onClick={() => this.props.onDelete(book)}
        >
          Delete
        </button>
      ),
    },
  ];

  render() {
    const { books, sortColumn, onSort } = this.props;

    return (
      <Table
        columns={this.columns}
        data={books}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default BooksTable;
