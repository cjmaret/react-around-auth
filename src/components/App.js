/* eslint-disable no-restricted-globals */
import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import DeleteCardPopup from "./DeleteCardPopup";
import ImagePopup from "./ImagePopup";
import Login from "./Login";
import Register from "./Register";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../auth.js";

function App() {
  const history = useHistory();
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] =
    React.useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState();
  const [currentUser, setCurrentUser] = React.useState();
  const [cards, setCards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [cardToDelete, setCardToDelete] = React.useState();
  const [loggedIn, setloggedIn] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    api
      .getUserInfo()
      .then((res) => {
        setCurrentUser(res);
      })
      .catch((err) => console.log(err));
  }, []);

  React.useEffect(() => {
    // handleTokenCheck();
    console.log(email);
    console.log(password);
  });

  // function handleTokenCheck() {
  //   if (localStorage.getItem("token")) {
  //     const jwt = localStorage.getItem("jwt");

  //     auth.checkToken(jwt).then((res) => {});
  //   }
  // }

  function handleEditProfileClick() {
    setIsLoading(false);
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsLoading(false);
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsLoading(false);
    setIsEditAvatarPopupOpen(true);
  }

  function handleDeleteCardClick(clickedCard) {
    setIsLoading(false);
    setIsDeleteCardPopupOpen(true);
    setCardToDelete(clickedCard);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
    setSelectedCard();
  }

  function handleCardClick(clickedCard) {
    setSelectedCard(clickedCard);
  }

  function handleUpdateUser(info) {
    api
      .setUserInfo(info)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(info) {
    api
      .setUserAvatar(info)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit({ link, name }) {
    api
      .addCard({ link, name })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    auth.register(email, password)
    .then((res) => {
      if (res) {
        history.push("/login");
      } else {
        console.log("Something went wrong");
      }
    });
    setIsInfoTooltipPopupOpen(true);
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          setEmail("");
          setPassword("");
          handleLogin();
          history.push("/");
        }
      })
      .catch((err) => console.log(err));
  }

  function handleLogin(e) {
    e.preventDefault();
    setloggedIn(true);
  }

  React.useEffect(() => {
    api
      .getCardList()
      .then((res) => {
        setCards(res);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser?._id);
    if (!isLiked) {
      api
        .addLike(card._id, !isLiked)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => console.log(err));
    } else {
      api
        .removeLike(card._id, !isLiked)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => console.log(err));
    }
  }

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleChangeButtonText() {
    setIsLoading(true);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Switch>
        <ProtectedRoute exact path="/" loggedIn={loggedIn}>
          <Header loggedIn={loggedIn} pageLink="/login" linkTitle="Log out" />
          <Main
            onCardClick={handleCardClick}
            onEditProfileClick={handleEditProfileClick}
            onAddPlaceClick={handleAddPlaceClick}
            onEditAvatarClick={handleEditAvatarClick}
            cards={cards}
            onCardLike={handleCardLike}
            onDeleteCardClick={handleDeleteCardClick}
          />
          <Footer />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
            onRenderLoading={handleChangeButtonText}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlaceSubmit={handleAddPlaceSubmit}
            isLoading={isLoading}
            onRenderLoading={handleChangeButtonText}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
            onRenderLoading={handleChangeButtonText}
          />
          <DeleteCardPopup
            cardToDelete={cardToDelete}
            isOpen={isDeleteCardPopupOpen}
            onClose={closeAllPopups}
            onDeleteCardSubmit={handleCardDelete}
            isLoading={isLoading}
            onRenderLoading={handleChangeButtonText}
          />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </ProtectedRoute>
        <Route path="/login">
          <Login
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onLoginSubmit={handleLoginSubmit}
          />
        </Route>
        <Route path="/register">
          <Register
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onRegisterSubmit={handleRegisterSubmit}
          />
          <InfoTooltip
            isOpen={isInfoTooltipPopupOpen}
            onClose={closeAllPopups}
          />
        </Route>
      </Switch>
    </CurrentUserContext.Provider>
  );
}

export default App;
