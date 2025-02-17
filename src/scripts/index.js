
import '../pages/index.css';
import { initialCards } from '../components/cards.js';
import { createCard, handleLikeClick, deleteCard } from '../components/card.js';
import { openModal, closeModal } from '../components/modal.js';
import { closePopupByClick } from '../components/modal.js';
import { enableValidation, clearValidation, validateName, validateDescription, validatePlaceName, validateLink } from '../components/validation.js';

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

//=========================================================================================================================================

// Валидация формы «Редактировать профиль»
document.addEventListener('DOMContentLoaded', () => {
  const form = document.forms['edit-profile'];
  const nameInput = form.elements.name;
  const descriptionInput = form.elements.description;
  const saveButton = form.querySelector('.popup__button');
  const nameError = form.querySelector('.popup__error_type_name');
  const descriptionError = form.querySelector('.popup__error_type_description');

  const toggleSaveButton = () => {
    if (validateName(nameInput, nameError) && validateDescription(descriptionInput, descriptionError)) {
      saveButton.disabled = false;
      saveButton.classList.remove(enableValidation.inactiveButtonClass);
    } else {
      saveButton.disabled = true;
      saveButton.classList.add(enableValidation.inactiveButtonClass);
    }
  };

  nameInput.addEventListener('input', () => {
    validateName(nameInput, nameError);
    toggleSaveButton();
  });

  descriptionInput.addEventListener('input', () => {
    validateDescription(descriptionInput, descriptionError);
    toggleSaveButton();
  });

  const profileForm = document.forms['edit-profile'];
  const profilePopup = document.querySelector('.popup_type_edit-profile');

  profilePopup.addEventListener('click', () => {
    clearValidation(profileForm, enableValidation);
  });
});

// Валидация формы «Новое место»
document.addEventListener('DOMContentLoaded', () => {
  const form = document.forms['new-place'];
  const placeNameInput = form.elements['place-name'];
  const linkInput = form.elements['link'];
  const submitButton = form.querySelector('.popup__button');
  const errorPlaceName = form.querySelector('.popup__error_visible_place-name');
  const errorLink = form.querySelector('.popup__error_visible_link');

  const updateSubmitButton = () => {
    if (validatePlaceName(placeNameInput, errorPlaceName) && validateLink(linkInput, errorLink)) {
      submitButton.disabled = false;
      submitButton.classList.remove(enableValidation.inactiveButtonClass);
    } else {
      submitButton.disabled = true;
      submitButton.classList.add(enableValidation.inactiveButtonClass);
    }
  };

  placeNameInput.addEventListener('input', () => {
    validatePlaceName(placeNameInput, errorPlaceName);
    updateSubmitButton();
  });

  linkInput.addEventListener('input', () => {
    validateLink(linkInput, errorLink);
    updateSubmitButton();
  });
});

//===========================================================================================================================

// Функция обработки клика по изображению
function handleImageClick(event) {
  const card = event.target.closest('.card'); // Находим карточку, по которой кликнули
  const cardTitle = card.querySelector('.card__title').textContent; // Получаем заголовок карточки
  const cardImageSrc = event.target.src; // Получаем ссылку на изображение

  const popupImage = document.querySelector('.popup__image'); // Изображение в попапе
  popupImage.src = cardImageSrc; // Устанавливаем ссылку на изображение
  popupImage.alt = cardTitle; // Устанавливаем альтернативный текст

  document.querySelector('.popup__caption').textContent = cardTitle; // Устанавливаем заголовок в попапе

  openModal(popupTypeImage); // Открываем попап с изображением
}

// Обработчик отправки формы редактирования профиля
function handleEditProfileFormSubmit(evt) {
  evt.preventDefault(); // Отменяем стандартное поведение формы
  profileTitle.textContent = nameInput.value; // Обновляем заголовок профиля
  profileDescription.textContent = jobInput.value; // Обновляем описание профиля
  closeModal(popupTypeEdit); // Закрываем попап
}

// Обработчик открытия модального окна добавления карточки
openAddButton.addEventListener('click', () => {
  newCardForm.reset(); // Очищаем форму
  const submitButton = newCardForm.querySelector('.popup__button'); // Находим кнопку "Сохранить"
  submitButton.disabled = true; // Деактивируем кнопку
  submitButton.classList.add(enableValidation.inactiveButtonClass); // Добавляем класс неактивной кнопки
  clearValidation(newCardForm, enableValidation); // Очищаем ошибки валидации
  openModal(popupNewCard); // Открываем попап
});

// Обработчик отправки формы добавления карточки
newCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault(); // Отменяем стандартное поведение формы

  const newCard = {
    name: newCardNameInput.value, // Название карточки
    link: newCardLinkInput.value, // Ссылка на изображение
    description: newCardNameInput.value // Описание карточки
  };

  const cardElement = createCard(newCard, handleLikeClick, deleteCard, handleImageClick); // Создаем новую карточку
  cardsList.prepend(cardElement); // Добавляем карточку в начало списка

  closeModal(popupNewCard); // Закрываем попап
  newCardForm.reset(); // Очищаем форму
  const submitButton = newCardForm.querySelector('.popup__button'); // Находим кнопку "Сохранить"
  submitButton.disabled = true; // Деактивируем кнопку
  submitButton.classList.add(enableValidation.inactiveButtonClass); // Добавляем класс неактивной кнопки
});

// Инициализация карточек
initialCards.forEach((item) => {
  const cardElement = createCard(item, handleLikeClick, deleteCard, handleImageClick); // Создаем карточку
  cardsList.appendChild(cardElement); // Добавляем карточку в список
});

// Обработчик открытия модального окна редактирования профиля
openEditButton.addEventListener('click', () => {
  // Подставляем текущие данные пользователя в поля формы
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;

  // Очищаем ошибки валидации
  clearValidation(editProfileForm, enableValidation);

  // Проверяем валидность данных и активируем/деактивируем кнопку сохранения
  const nameError = editProfileForm.querySelector('.popup__error_type_name');
  const descriptionError = editProfileForm.querySelector('.popup__error_type_description');
  const saveButton = editProfileForm.querySelector('.popup__button');

  // Проверяем валидность имени и описания
  const isNameValid = validateName(nameInput, nameError);
  const isDescriptionValid = validateDescription(jobInput, descriptionError);

  // Активируем или деактивируем кнопку сохранения
  if (isNameValid && isDescriptionValid) {
    saveButton.disabled = false;
    saveButton.classList.remove(enableValidation.inactiveButtonClass);
  } else {
    saveButton.disabled = true;
    saveButton.classList.add(enableValidation.inactiveButtonClass);
  }

  // Открываем модальное окно
  openModal(popupTypeEdit);

  // Добавляем обработчики на поля ввода для динамической проверки валидности
  nameInput.addEventListener('input', () => {
    validateName(nameInput, nameError);
    toggleSaveButton();
  });

  jobInput.addEventListener('input', () => {
    validateDescription(jobInput, descriptionError);
    toggleSaveButton();
  });
});

// Обработчик отправки формы редактирования профиля
editProfileForm.addEventListener('submit', handleEditProfileFormSubmit);

// Обработчики для закрытия модальных окон
popups.forEach((popup) => {
  popup.addEventListener('mousedown', closePopupByClick); // Закрываем попап по клику вне области
});