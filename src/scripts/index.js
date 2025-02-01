// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

import '../pages/index.css';
import {initialCards} from './cards.js';

const cardsTemplate = document.querySelector('#card-template').content;
const cardsList = document.querySelector('.places__list');

// Функция удаления карточки
function deleteCard(event) { 
  const cardItem = event.target.closest('.places__item');
  if (cardItem) { 
    cardItem.remove();
  } 
} 
// Функция создания карточки 
function createCard(item, likeHandler) { 
  const cardsElement = cardsTemplate.querySelector('.places__item').cloneNode(true);

  const cardImage = cardsElement.querySelector('.card__image') 
  cardImage.src = item.link; 
  cardImage.alt = item.description;

  const cardTitle =  cardsElement.querySelector('.card__title');
  cardTitle.textContent = item.name;
 
  const deleteButton = cardsElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', deleteCard);

  // Добавляем обработчик лайка
  const likeButton = cardsElement.querySelector('.card__like-button');
  likeButton.addEventListener('click', likeHandler);
 
  return cardsElement;
} 

// Создание карточек с передачей функции обработки лайка
initialCards.forEach(item => {
  const cardElement = createCard(item, handleLikeClick);
  cardsList.appendChild(cardElement);
});



/* Модальные окна */
const popups = document.querySelectorAll('.popup');

// Кнопка редактирования профиля 
const popupTypeEdit = document.querySelector('.popup_type_edit');
const openEditButton = document.querySelector('.profile__edit-button');

// Кнопка добавления новой карточки 
const popupNewCard = document.querySelector('.popup_type_new-card');
const openAddButton = document.querySelector('.profile__add-button');

// Увеличение картинки в модальном окне 
const popupTypeImage = document.querySelector('.popup_type_image');
const openCardImageList = document.querySelectorAll('.places__list li');

// Подтягивание картинки и описания в модальное окно
function handleImageClick(event) {
  if (event.target.tagName === 'IMG') {
    const card = event.currentTarget.closest('.card');
    const cardTitle = card.querySelector('.card__title').textContent;
    const cardImageSrc = event.target.src;

    document.querySelector('.popup__image').src = cardImageSrc;
    document.querySelector('.popup__caption').textContent = cardTitle;

    openModal(popupTypeImage);
  }
}

// Функция открытия модального окна
function openModal(popup) {
  popup.classList.add('popup_is-opened');
  popup.classList.remove('popup_is-animated');

  if (popup === popupTypeEdit) {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
  }
}

// Закрытие модального окна при помощи Esc 
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    popups.forEach(closeModal);
  }
});

// Закрытие модального окна кнопкой Х и кликом мышки вне зоны модального окна
popups.forEach((popup) => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains('popup__close') || !evt.target.closest('.popup__content')) {
      closeModal(popup);
    }
  });
});

// Функция закрытия модального окна
function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  popup.classList.add('popup_is-animated');

  if (popup === popupNewCard) {
    newCardForm.reset();
  }
}

// Редактирование имени и информации о себе
const formElement = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const closeButton = popupTypeEdit.querySelector('.popup__close');

// Обработчик «отправки» формы
function handleFormSubmit(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(popupTypeEdit);
}

// Добавляем обработчики событий
openEditButton.addEventListener('click', () => openModal(popupTypeEdit));
openAddButton.addEventListener('click', () => openModal(popupNewCard));
openCardImageList.forEach((card) => card.addEventListener('click', handleImageClick));
closeButton.addEventListener('click', () => closeModal(popupTypeEdit));
formElement.addEventListener('submit', handleFormSubmit);





// Добовление новой карточки с помощью кнопки +
const newCardForm = document.querySelector('.popup__form[name="new-place"]');
const newCardNameInput = newCardForm.querySelector('.popup__input_type_card-name');
const newCardLinkInput = newCardForm.querySelector('.popup__input_type_url');

newCardForm.addEventListener('submit', function (evt) {
  evt.preventDefault();

  const newCard = {
    name: newCardNameInput.value,
    link: newCardLinkInput.value,
    description: newCardNameInput.value
  };

  const cardElement = createCard(newCard, handleLikeClick);
  cardsList.prepend(cardElement);

  closeModal(popupNewCard);
  newCardForm.reset();
});

// Функция обработки лайка
function handleLikeClick(event) {
  const likeButton = event.target;
  likeButton.classList.toggle('card__like-button_is-active');
}