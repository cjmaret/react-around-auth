import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import EditAvatarPopup from './EditAvatarPopup';
import DeleteCardPopup from './DeleteCardPopup';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = React.useState(false)
  const [selectedCard, setSelectedCard] = React.useState();
  const [currentUser, setCurrentUser] = React.useState();
  const [cards, setCards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const[cardToDelete, setCardToDelete] = React.useState();


  React.useEffect(() => {
    api.getUserInfo()
      .then(res => {
        setCurrentUser(res)
      })
      .catch((err) => console.log(err))
  }, []);


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
    setIsDeleteCardPopupOpen(true)
    setCardToDelete(clickedCard);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setSelectedCard();
  }

  function handleCardClick(clickedCard) {
    setSelectedCard(clickedCard);
  }

  function handleUpdateUser(info) {
    api.setUserInfo(info)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(info) {
    api.setUserAvatar(info)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit({ link, name }) {
    api.addCard({ link, name })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  React.useEffect(() => {
    api.getCardList()
      .then(res => {
        setCards(res);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser?._id);
    if (!isLiked) {
      api.addLike(card._id, !isLiked)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => console.log(err));
    } else {
      api.removeLike(card._id, !isLiked)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => console.log(err));
    }
  }

  function handleCardDelete(card) {
    api.removeCard(card._id)
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
      <Header />
      <Main onCardClick={handleCardClick} onEditProfileClick={handleEditProfileClick} onAddPlaceClick={handleAddPlaceClick} onEditAvatarClick={handleEditAvatarClick} cards={cards} onCardLike={handleCardLike} onDeleteCardClick={handleDeleteCardClick} />
      <Footer />
      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} isLoading={isLoading} onRenderLoading={handleChangeButtonText}/>
      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlaceSubmit={handleAddPlaceSubmit} isLoading={isLoading} onRenderLoading={handleChangeButtonText}/>
      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} isLoading={isLoading} onRenderLoading={handleChangeButtonText}/>
      <DeleteCardPopup cardToDelete={cardToDelete} isOpen={isDeleteCardPopupOpen} onClose={closeAllPopups} onDeleteCardSubmit={handleCardDelete} isLoading={isLoading} onRenderLoading={handleChangeButtonText} />
      <ImagePopup card={selectedCard} onClose={closeAllPopups} />
    </CurrentUserContext.Provider>
  );

}


export default App;
