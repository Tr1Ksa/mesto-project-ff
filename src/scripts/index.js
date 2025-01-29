// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

import '../pages/index.css';
import {initialCards} from './cards.js';

const cardsTemplate = document.querySelector('#card-template').content;
const cardsList = document.querySelector('.places__list');

function deleteCard(event) { 
  const cardItem = event.target.closest('.places__item');
  if (cardItem) { 
    cardItem.remove();
  } 
} 
 
function createCard(item) { 
  const cardsElement = cardsTemplate.querySelector('.places__item').cloneNode(true);

  const cardImage = cardsElement.querySelector('.card__image') 
  cardImage.src = item.link; 
  cardImage.alt = item.description;

  const cardTitle =  cardsElement.querySelector('.card__title');
  cardTitle.textContent = item.name;
 
  const deleteButton = cardsElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', deleteCard);
 
  return cardsElement;
} 

initialCards.forEach(item => {
  const cardElement = createCard(item);
  cardsList.appendChild(cardElement);
});



/* Модальные окна */
/* Кнопка редактирования профиля */
const popupTypeEdit = document.querySelector('.popup_type_edit');
const openEditButtons = document.querySelector('.profile__edit-button');
openEditButtons.addEventListener('click', openModal);

/* Кнопка добавления новой карточки */
const popupNewCard = document.querySelector('.popup_type_new-card');
const openAddButtons = document.querySelector('.profile__add-button');
openAddButtons.addEventListener('click', openModal);

/* Увеличение картинки */
const popupTypeImage = document.querySelector('.popup_type_image');
const openCardImage = document.querySelector('.card__image');
openCardImage.addEventListener('click', openModal);

const closePopupButton = document.querySelector('.popup__close');
closePopupButton.addEventListener('click', closeModal);

function openModal(event) {
  if (event.target === openEditButtons) {
    popupTypeEdit.style.display = 'flex';
  } else if (event.target === openAddButtons) {
    popupNewCard.style.display = 'flex';
  } else if (event.target === openCardImage) {
    popupTypeImage.style.display = 'flex';
  }
}

function closeModal() {
  popupTypeEdit.style.display = 'none';
  popupNewCard.style.display = 'none';
  popupTypeImage.style.display = 'none';
}



// Добавляем закрытие попапа нажатием на Esc
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
});