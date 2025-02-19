//index.js

import '../pages/index.css';
import { initialCards } from '../components/cards.js';
import { openModal, closeModal } from '../components/modal.js';
import { createCard, handleLikeClick, deleteCard } from '../components/card.js';
import { closePopupByClick } from '../components/modal.js';
import { enableValidation, clearValidation, validateName, validateDescription, validatePlaceName, validateLink } from '../components/validation.js';
import { getUserInfo, getInitialCards, updateProfile, addNewCard, deleteCardApi, updateAvatar } from '../components/api.js';

// DOM-элементы
const cardsList = document.querySelector('.places__list'); // Список карточек
const popups = document.querySelectorAll('.popup'); // Все модальные окна
const popupTypeEdit = document.querySelector('.popup_type_edit'); // Модальное окно редактирования профиля
const popupNewCard = document.querySelector('.popup_type_new-card'); // Модальное окно добавления новой карточки
const popupTypeImage = document.querySelector('.popup_type_image'); // Модальное окно с изображением
const openEditButton = document.querySelector('.profile__edit-button'); // Кнопка открытия редактирования профиля
const openAddButton = document.querySelector('.profile__add-button'); // Кнопка открытия добавления карточки
const editProfileForm = document.querySelector('.popup__form[name="edit-profile"]'); // Форма редактирования профиля
const newCardForm = document.querySelector('.popup__form[name="new-place"]'); // Форма добавления новой карточки
const nameInput = editProfileForm.querySelector('.popup__input_type_name'); // Поле ввода имени
const jobInput = editProfileForm.querySelector('.popup__input_type_description'); // Поле ввода описания
const profileTitle = document.querySelector('.profile__title'); // Заголовок профиля
const profileDescription = document.querySelector('.profile__description'); // Описание профиля
const newCardNameInput = newCardForm.querySelector('.popup__input_type_card-name'); // Поле ввода названия карточки
const newCardLinkInput = newCardForm.querySelector('.popup__input_type_url'); // Поле ввода ссылки на карточку

let currentUserId; // ID текущего пользователя

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
/*   const saveButton = editProfileForm.querySelector('.popup__button'); */
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

    const profileImage = document.querySelector('.profile__image');
    profileImage.style.backgroundImage = `url('${userData.avatar}')`;

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

const editAvatarButton = document.querySelector('.profile__edit-avatar-button');
const popupEditAvatar = document.querySelector('.popup_type_edit-avatar');
const editAvatarForm = document.querySelector('.popup__form[name="edit-avatar"]');
const avatarUrlInput = editAvatarForm.querySelector('.popup__input_type_avatar-url');

// Обработчик для открытия модального окна при клике на иконку редактирования аватара
editAvatarButton.addEventListener('click', () => {
  editAvatarForm.reset();
  clearValidation(editAvatarForm, enableValidation);
  openModal(popupEditAvatar);
});

// Обработчик для валидации формы редактирования аватара
document.addEventListener('DOMContentLoaded', () => {
  const form = document.forms['edit-avatar'];
  const avatarInput = form.elements.avatar;
  const errorAvatar = form.querySelector('.popup__error_visible_avatar');

  const validateForm = async () => {
    const isAvatarValid = await validateAvatarUrl(avatarInput, errorAvatar);
    toggleSaveButton(form, isAvatarValid);
  };

  avatarInput.addEventListener('input', validateForm);
});

// Обработчик для отправки формы редактирования аватара
editAvatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const avatarUrl = avatarUrlInput.value;

  updateAvatar(avatarUrl)
    .then((userData) => {
      const profileImage = document.querySelector('.profile__image');
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
      closeModal(popupEditAvatar);
    })
    .catch((err) => {
      console.error('Ошибка при обновлении аватара:', err);
    });
});

// Функция для проверки, является ли URL действительным изображением
function isValidImageUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;

    img.onload = () => resolve(true); // Изображение загружено
    img.onerror = () => resolve(false); // Ошибка загрузки
  });
}

// Функция валидации для поля ввода аватара
async function validateAvatarUrl(input, errorElement) {
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  if (!input.value) {
    errorElement.textContent = 'Это поле обязательно для заполнения';
    return false;
  } else if (!urlPattern.test(input.value)) {
    errorElement.textContent = 'Введите корректный URL';
    return false;
  } else {
    try {
      const isValidImage = await isValidImageUrl(input.value);
      if (!isValidImage) {
        errorElement.textContent = 'Указанный URL не ведёт на изображение';
        return false;
      } else {
        errorElement.textContent = '';
        return true;
      }
    } catch (error) {
      errorElement.textContent = 'Не удалось проверить URL';
      return false;
    }
  }
}