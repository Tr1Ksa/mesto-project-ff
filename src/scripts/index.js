// index.js

// Импорт стилей и модулей
import '../pages/index.css'; // Основные стили для страницы
import { openModal, closeModal } from '../components/modal.js'; // Функции для открытия и закрытия модальных окон
import { createCard, handleLikeClick, deleteCard } from '../components/card.js'; // Функции для работы с карточками
import { closePopupByClick } from '../components/modal.js'; // Функция для закрытия модального окна по клику вне его области
import { validationConfig, enableValidation, clearValidation } from '../components/validation.js'; // Конфигурация и функции для валидации форм
import { getUserInfo, getInitialCards, updateProfile, addNewCard, deleteCardApi, likeCard, unlikeCard, updateAvatar } from '../components/api.js'; // Функции для работы с API
import { toggleButtonLoadingState } from '../components/utils.js'; // Функция для изменения состояния кнопки при загрузке

// Получение DOM-элементов
const cardsList = document.querySelector('.places__list');
const popups = document.querySelectorAll('.popup');
const popupTypeEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupTypeImage = document.querySelector('.popup_type_image');
const openEditButton = document.querySelector('.profile__edit-button');
const openAddButton = document.querySelector('.profile__add-button');
const editProfileForm = document.querySelector('.popup__form[name="edit-profile"]');
const newCardForm = document.querySelector('.popup__form[name="new-place"]');
const nameInput = editProfileForm.querySelector('.popup__input_type_name');
const jobInput = editProfileForm.querySelector('.popup__input_type_description');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const newCardNameInput = newCardForm.querySelector('.popup__input_type_card-name');
const newCardLinkInput = newCardForm.querySelector('.popup__input_type_url');
const popupImage = document.querySelector('.popup__image');
const editAvatarButton = document.querySelector('.profile__edit-avatar-button');
const popupEditAvatar = document.querySelector('.popup_type_edit-avatar');
const editAvatarForm = document.querySelector('.popup__form[name="edit-avatar"]');
const avatarUrlInput = editAvatarForm.querySelector('.popup__input_type_avatar-url');

let currentUserId; // ID текущего пользователя

// Включение валидации всех форм на странице
enableValidation(validationConfig);

// Функция для обновления информации профиля на странице
function updateProfileInfo(name, job) {
  profileTitle.textContent = name;
  profileDescription.textContent = job;
}

// Обработчик отправки формы редактирования профиля
function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();

  const saveButton = editProfileForm.querySelector('.popup__button');
  const defaultText = saveButton.textContent;

  toggleButtonLoadingState(saveButton, true, defaultText);

  const name = nameInput.value;
  const job = jobInput.value;

  updateProfile(name, job)
    .then((userData) => {
      updateProfileInfo(userData.name, userData.about);
      closeModal(popupTypeEdit);
    })
    .catch((err) => {
      console.error('Ошибка при обновлении профиля:', err);
    })
    .finally(() => {
      toggleButtonLoadingState(saveButton, false, defaultText);
    });
}

editProfileForm.addEventListener('submit', handleEditProfileFormSubmit);

// Обработчик открытия модального окна редактирования профиля
openEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;

  clearValidation(editProfileForm, validationConfig);
  openModal(popupTypeEdit);
});

// Функция обработки клика по изображению
function openImagePopup(event) {
  const card = event.target.closest('.card');
  const cardTitle = card.querySelector('.card__title').textContent;
  const cardImageSrc = event.target.src;

  popupImage.src = cardImageSrc;
  popupImage.alt = cardTitle;
  document.querySelector('.popup__caption').textContent = cardTitle;

  openModal(popupTypeImage);
}

// Обработчик отправки формы добавления новой карточки
  function submitAddCardForm(evt) {
  evt.preventDefault();

  const saveButton = newCardForm.querySelector('.popup__button');
  const defaultText = saveButton.textContent;

  toggleButtonLoadingState(saveButton, true, defaultText);

  const cardName = newCardNameInput.value;
  const cardLink = newCardLinkInput.value;

  addNewCard(cardName, cardLink)
    .then((cardData) => {
      const cardElement = createCard(cardData, (cardId, likeButton, likeCount) => handleLikeClick(cardId, likeButton, likeCount, likeCard, unlikeCard), deleteCard, openImagePopup, currentUserId, openModal, deleteCardApi, closeModal);
      cardsList.prepend(cardElement);
      closeModal(popupNewCard);
      newCardForm.reset();
      clearValidation(newCardForm, validationConfig);
    })
    .catch((err) => {
      console.error('Ошибка при добавлении карточки:', err);
    })
    .finally(() => {

      toggleButtonLoadingState(saveButton, false, defaultText);
    });
}

newCardForm.addEventListener('submit', submitAddCardForm);

// Обработчик открытия модального окна добавления карточки
openAddButton.addEventListener('click', () => { 
  clearValidation(newCardForm, validationConfig); 
  openModal(popupNewCard); 
}); 

// Обработчик для отправки формы редактирования аватара
function submitUpdateAvatarForm(evt) {
  evt.preventDefault();

  const saveButton = editAvatarForm.querySelector('.popup__button');
  const defaultText = saveButton.textContent;

  toggleButtonLoadingState(saveButton, true, defaultText);

  const avatarUrl = avatarUrlInput.value;

  updateAvatar(avatarUrl)
    .then((userData) => {
      const profileImage = document.querySelector('.profile__image');
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
      closeModal(popupEditAvatar);
    })
    .catch((err) => {
      console.error('Ошибка при обновлении аватара:', err);
    })
    .finally(() => {
      toggleButtonLoadingState(saveButton, false, defaultText);
    });
}

editAvatarForm.addEventListener('submit', submitUpdateAvatarForm);


// Обработчик для открытия модального окна при клике на иконку редактирования аватара
editAvatarButton.addEventListener('click', () => {
  editAvatarForm.reset();
  clearValidation(editAvatarForm, validationConfig);
  openModal(popupEditAvatar);
});

// Обработчики для закрытия модальных окон
popups.forEach((popup) => {
  popup.addEventListener('mousedown', closePopupByClick);
});

// Работа с API
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;

    const profileImage = document.querySelector('.profile__image');
    profileImage.style.backgroundImage = `url('${userData.avatar}')`;

    cards.forEach((item) => {
      const cardElement = createCard(item, (cardId, likeButton, likeCount) => handleLikeClick(cardId, likeButton, likeCount, likeCard, unlikeCard), deleteCard, openImagePopup, currentUserId, openModal, deleteCardApi, closeModal);
      cardsList.appendChild(cardElement);
    });
  })
  .catch((err) => {
    console.log(err);
  });
