import React, { Component } from "react";
import BooksTable from "./booksTable";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";
import Genre from "./genre";
import { Link } from "react-router-dom";
import { getBooks } from "../services/fakeBookService";
import { getGenres } from "../services/fakeGenreService";
import { paginate } from "../utilities/paginate";
import _, { reduceRight } from "lodash";

class Books extends Component {
  state = {
    books: [],
    genres: [],
    pageSize: 5,
    currentPage: 1,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" },
  };

  componentDidMount() {
    const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];
    this.setState({ books: getBooks(), genres });
  }

  handleDelete = (book) => {
    const books = this.state.books.filter((m) => m._id !== book._id);
    this.setState({ books });
  };

  handleLike = (book) => {
    const books = [...this.state.books];
    const index = books.indexOf(book);
    books[index] = { ...books[index] };
    books[index].liked = !books[index].liked;
    this.setState({ books });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  getPagedData = () => {
    const {
      sortColumn,
      pageSize,
      currentPage,
      books: allBooks,
      selectedGenre,
      searchQuery,
    } = this.state;

    let filtered = allBooks;
    if (searchQuery)
      filtered = allBooks.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allBooks.filter((m) => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const books = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: books };
  };

  render() {
    const { sortColumn, pageSize, currentPage } = this.state;
    if (this.state.books.length === 0) return <p>No books displayed</p>;

    const { totalCount, data: books } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <Genre
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          <Link
            to="/books/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            New Book
          </Link>

          <p>{totalCount} books displayed</p>

          <SearchBox
            value={this.state.searchQuery}
            onChange={this.handleSearch}
          />

          <BooksTable
            books={books}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>
    );
  }
}

export default Books;
