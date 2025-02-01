import '../pages/index.css';
import { initialCards } from '../components/cards.js';
import { createCard, handleLikeClick, deleteCard } from '../components/card.js';
import { openModal, closeModal } from '../components/modal.js';

// DOM-элементы
const cardsList = document.querySelector('.places__list');
const popups = document.querySelectorAll('.popup');
const popupTypeEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupTypeImage = document.querySelector('.popup_type_image');
const openEditButton = document.querySelector('.profile__edit-button');
const openAddButton = document.querySelector('.profile__add-button');
const formElement = document.querySelector('.popup__form[name="edit-profile"]');
const newCardForm = document.querySelector('.popup__form[name="new-place"]');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Функция обработки клика по изображению
function handleImageClick(event) {
  const card = event.target.closest('.card');
  const cardTitle = card.querySelector('.card__title').textContent;
  const cardImageSrc = event.target.src;

  document.querySelector('.popup__image').src = cardImageSrc;
  document.querySelector('.popup__caption').textContent = cardTitle;

  openModal(popupTypeImage);
}

// Обработчик отправки формы редактирования профиля
function handleFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(popupTypeEdit);
}

// Обработчик отправки формы добавления карточки
newCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const newCard = {
    name: newCardForm.querySelector('.popup__input_type_card-name').value,
    link: newCardForm.querySelector('.popup__input_type_url').value,
    description: newCardForm.querySelector('.popup__input_type_card-name').value
  };

  const cardElement = createCard(newCard, handleLikeClick, deleteCard, handleImageClick);
  cardsList.prepend(cardElement);

  closeModal(popupNewCard);
  newCardForm.reset();
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
  openModal(popupTypeEdit);
});

// Обработчик открытия модального окна добавления карточки
openAddButton.addEventListener('click', () => openModal(popupNewCard));

// Обработчик отправки формы редактирования профиля
formElement.addEventListener('submit', handleFormSubmit);

// Закрытие модальных окон при клике вне контента или нажатии на Х
popups.forEach((popup) => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains('popup__close') || !evt.target.closest('.popup__content')) {
      closeModal(popup);
    }
  });
});