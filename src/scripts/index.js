import '../pages/index.css';
import { initialCards } from '../components/cards.js';
import { openModal, closeModal } from '../components/modal.js';
import { createCard, handleLikeClick, deleteCard } from '../components/card.js';
import { closePopupByClick } from '../components/modal.js';
import { enableValidation, clearValidation, validateName, validateDescription, validatePlaceName, validateLink } from '../components/validation.js';
import { getUserInfo, getInitialCards, updateProfile, addNewCard, deleteCardApi } from '../components/api.js';

// DOM-элементы
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

let currentUserId;

// Функция для обновления данных профиля на странице
function updateProfileInfo(name, job) {
  profileTitle.textContent = name;
  profileDescription.textContent = job;
}

// Функция для активации/деактивации кнопки сохранения
function toggleSaveButton(form, isValid) {
  const saveButton = form.querySelector('.popup__button');
  if (isValid) {
    saveButton.disabled = false;
    saveButton.classList.remove(enableValidation.inactiveButtonClass);
  } else {
    saveButton.disabled = true;
    saveButton.classList.add(enableValidation.inactiveButtonClass);
  }
}

// Валидация формы «Редактировать профиль»
document.addEventListener('DOMContentLoaded', () => {
  const form = document.forms['edit-profile'];
  const nameInput = form.elements.name;
  const descriptionInput = form.elements.description;
  const nameError = form.querySelector('.popup__error_type_name');
  const descriptionError = form.querySelector('.popup__error_type_description');

  const validateForm = () => {
    const isNameValid = validateName(nameInput, nameError);
    const isDescriptionValid = validateDescription(descriptionInput, descriptionError);
    toggleSaveButton(form, isNameValid && isDescriptionValid);
  };

  nameInput.addEventListener('input', validateForm);
  descriptionInput.addEventListener('input', validateForm);
});

// Валидация формы «Новое место»
document.addEventListener('DOMContentLoaded', () => {
  const form = document.forms['new-place'];
  const placeNameInput = form.elements['place-name'];
  const linkInput = form.elements['link'];
  const errorPlaceName = form.querySelector('.popup__error_visible_place-name');
  const errorLink = form.querySelector('.popup__error_visible_link');

  const validateForm = () => {
    const isPlaceNameValid = validatePlaceName(placeNameInput, errorPlaceName);
    const isLinkValid = validateLink(linkInput, errorLink);
    toggleSaveButton(form, isPlaceNameValid && isLinkValid);
  };

  placeNameInput.addEventListener('input', validateForm);
  linkInput.addEventListener('input', validateForm);
});

// Функция обработки клика по изображению
function handleImageClick(event) {
  const card = event.target.closest('.card');
  const cardTitle = card.querySelector('.card__title').textContent;
  const cardImageSrc = event.target.src;

  const popupImage = document.querySelector('.popup__image');
  popupImage.src = cardImageSrc;
  popupImage.alt = cardTitle;

  document.querySelector('.popup__caption').textContent = cardTitle;
  openModal(popupTypeImage);
}

// Обработчик отправки формы редактирования профиля
function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();

  const name = nameInput.value;
  const job = jobInput.value;

  updateProfile(name, job)
    .then((userData) => {
      updateProfileInfo(userData.name, userData.about);
      closeModal(popupTypeEdit);
    })
    .catch((err) => {
      console.error('Ошибка при обновлении профиля:', err);
    });
}

editProfileForm.addEventListener('submit', handleEditProfileFormSubmit);

// Обработчик открытия модального окна добавления карточки
openAddButton.addEventListener('click', () => {
  newCardForm.reset();
  const submitButton = newCardForm.querySelector('.popup__button');
  submitButton.disabled = true;
  submitButton.classList.add(enableValidation.inactiveButtonClass);
  clearValidation(newCardForm, enableValidation);
  openModal(popupNewCard);
});

// Обработчик отправки формы добавления карточки
newCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const newCard = {
    name: newCardNameInput.value,
    link: newCardLinkInput.value
  };

  addNewCard(newCard.name, newCard.link)
    .then((newCardResponse) => {
      const cardElement = createCard(newCardResponse, handleLikeClick, deleteCard, handleImageClick, currentUserId);
      cardsList.prepend(cardElement);
      closeModal(popupNewCard);
      newCardForm.reset();
      const submitButton = newCardForm.querySelector('.popup__button');
      submitButton.disabled = true;
      submitButton.classList.add(enableValidation.inactiveButtonClass);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Инициализация карточек
initialCards.forEach((item) => {
  const cardElement = createCard(item, handleLikeClick, deleteCard, handleImageClick);
  cardsList.appendChild(cardElement);
});

// Обработчик открытия модального окна редактирования профиля
openEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(editProfileForm, enableValidation);
  const nameError = editProfileForm.querySelector('.popup__error_type_name');
  const descriptionError = editProfileForm.querySelector('.popup__error_type_description');
  const saveButton = editProfileForm.querySelector('.popup__button');
  const isNameValid = validateName(nameInput, nameError);
  const isDescriptionValid = validateDescription(jobInput, descriptionError);
  toggleSaveButton(editProfileForm, isNameValid && isDescriptionValid);
  openModal(popupTypeEdit);
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

    cards.forEach((item) => {
      const cardElement = createCard(item, handleLikeClick, deleteCard, handleImageClick, currentUserId);
      cardsList.appendChild(cardElement);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Обработчик для кнопки "Да" в попапе подтверждения удаления
const confirmDeletePopup = document.querySelector('.popup_type_confirm-delete');
const confirmDeleteForm = confirmDeletePopup.querySelector('.popup__form');

confirmDeleteForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const cardId = confirmDeletePopup.dataset.cardId;

  deleteCardApi(cardId)
    .then(() => {
      const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
      if (cardElement) {
        cardElement.remove();
      }
      closeModal(confirmDeletePopup);
    })
    .catch((err) => {
      console.log(err);
    });
});