import React from "react";
import Header from "./Header";
import UserName from "./UserName";
import { verifyLogin, fetchBook } from "../fetchFunctions";

class Book extends React.Component {
  state: {
    user: {},
    book: {}
  };

  writeReview = event => {
    event.preventDefault();

    this.props.history.push({
      pathname: "/review/" + this.props.match.params.id
    });
  };

  rentBook = event => {
    event.preventDefault();
    this.props.history.push({
      pathname: "/rental/" + this.state.book.id
    });
  };

  componentDidMount() {
    // Verify if the user has logged in before
    const user = verifyLogin();
    if (user) {
      // If it has, store the information in state
      this.setState({ user }, function() {
        fetchBook(this.state.user.token, this.props.match.params.id)
          .then(res => res.json())
          .then(book => this.setState({ book }));
      });

      // this.setState({ user }, function() {
      //   // Fetch the rest of the user information
      //   fetchActiveUser(this.state.user.token)
      //     .then(res => res.json())
      //     .then(activeUser => this.setState({ activeUser }, function() {}));
      //   // Load the available books
      //   fetchBooks(this.state.user.token, "true")
      //     .then(res => res.json())
      //     .then(availableBooks => this.setState({ availableBooks }));
      // });
    } else {
      // If there is no data in localStorage, go back to user select screen
      // this.props.history.push(`/userselect`);
      this.props.history.push({
        pathname: "/userselect"
        //state: { prueba: "hoooola" }
      });
    }
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          {this.state && this.state.user && (
            <Header
              logoType="blackLogo"
              withGreeting={true}
              username={this.state.user.username}
            />
          )}
          <div className="content">
            {this.state && !this.state.book && (
              <p>
                <img className="loader" src="/images/loader.gif" />
              </p>
            )}
            {this.state && this.state.book && (
              <>
                <p>
                  {this.state.book.titulo} - {this.state.book.autor} -{" "}
                  {this.state.book.ano}
                  {this.state &&
                    this.state.user &&
                    this.state.book &&
                    this.state.book.usr_dueno != this.state.user.user_id && (
                      <span className="newLine">
                        Lo trajo{" "}
                        <UserName
                          id={this.state.book.usr_dueno}
                          name={this.state.book.usr_dueno_nombre}
                          navigation={this.props.history}
                        />
                      </span>
                    )}
                </p>

                <p>{this.state.book.resumen}</p>

                {this.state &&
                  this.state.book &&
                  !this.state.book.alquilerActivo &&
                  this.state.book.usr_dueno != this.state.user.user_id && !this.state.book.usuarioTieneAlquiler && (
                    <>
                      <img className="separador" src="/images/separador.png" />
                      <p>
                        Este libro está disponible,{" "}
                        <a onClick={this.rentBook}>¡llevátelo!</a>
                      </p>
                    </>
                  )}
                {this.state &&
                  this.state.book &&
                  this.state.book.alquilerActivo &&
                  this.state.book.alquilerActivo.id_usuario !=
                    this.state.user.user_id && (
                    <>
                      <img className="separador" src="/images/separador.png" />
                      <p>
                        Este libro no está disponible, lo tiene{" "}
                        <UserName
                          id={this.state.book.alquilerActivo.id_usuario}
                          name={this.state.book.alquilerActivo.nombre}
                          navigation={this.props.history}
                        />.
                      </p>
                    </>
                  )}
                {this.state &&
                  this.state.book &&
                  this.state.book.alquilerActivo &&
                  this.state.book.alquilerActivo.id_usuario ==
                    this.state.user.user_id && (
                    <>
                      <img className="separador" src="/images/separador.png" />
                      <p>
                        Este libro no está disponible, lo tenés vos. Si ya lo
                        devolviste <a>clickeá aqui</a>
                      </p>
                    </>
                  )}

                {this.state &&
                  this.state.book &&
                  !this.state.book.alquilerActivo &&
                  this.state.book.usr_dueno == this.state.user.user_id && (
                    <>
                      <img className="separador" src="/images/separador.png" />
                      <p>
                        Este libro es tuyo y está disponible.
                        <span className="newLine">
                          <a href="#">Quiero sacarlo de libroclub.</a>
                        </span>
                      </p>
                    </>
                  )}
                <img className="separador" src="/images/separador.png" />
                <ul className="libros">
                  {this.state.book.reviews.map(obj => {
                    return (
                      <li key={obj.id}>
                        <p>
                          <UserName
                            id={obj.id_usuario}
                            name={obj.nombre}
                            navigation={this.props.history}
                          />{" "}
                          le dio {obj.estrellas} estrellas y dijo:
                          <span className="newLine">"{obj.texto}"</span>
                        </p>
                      </li>
                    );
                  })}
                </ul>
                {this.state &&
                  this.state.book &&
                  !this.state.book.reviewDelUsuario && (
                    <p>
                      Si lo leíste,{" "}
                      <a onClick={this.writeReview}>escribí una reseña</a>
                    </p>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Book;
