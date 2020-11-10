import React, { Component } from "react";
import Books from "./components/books";
import { Route, Redirect, Switch } from "react-router-dom";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import BookForm from "./components/bookForm";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import "./App.css";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <main className="container">
          <Switch>
            <Route path="/register" component={RegisterForm}></Route>
            <Route path="/login" component={LoginForm}></Route>
            <Route path="/books/:id" component={BookForm}></Route>
            <Route path="/books" component={Books}></Route>
            <Route path="/not-found" component={NotFound}></Route>
            <Redirect from="/" exact to="/books" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
