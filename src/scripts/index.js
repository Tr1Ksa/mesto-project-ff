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

// Кнопка редактирования профиля 
const popupTypeEdit = document.querySelector('.popup_type_edit');
const openEditButtons = document.querySelector('.profile__edit-button');

// Добавляем обработчик события для кнопки открытия формы
openEditButtons.addEventListener('click', openModal);

// Кнопка добавления новой карточки 
const popupNewCard = document.querySelector('.popup_type_new-card');
const openAddButtons = document.querySelector('.profile__add-button');
// Добавляем обработчик события для кнопки открытия формы
openAddButtons.addEventListener('click', openModal);

// Увеличение картинки в модальном окне 
const popupTypeImage = document.querySelector('.popup_type_image');
const openCardImageList = document.querySelectorAll('.places__list li'); // Получаем список всех элементов списка

// Добавляем обработчики событий для каждого элемента списка
for (let i = 0; i < openCardImageList.length; i++) {
  openCardImageList[i].addEventListener('click', openModal);
}

// Функция открытия модального окна
function openModal(event) {
  if (event.target === openEditButtons) {
    popupTypeEdit.style.display = 'flex';

  } else if (event.target === openAddButtons) {
    popupNewCard.style.display = 'flex';

  } else {
    if (event.target.tagName === 'IMG') { // Проверка, является ли target изображением
      popupTypeImage.style.display = 'flex';
      document.querySelector('.popup__image').src = event.target.src; // Установка источника изображения в попапе
      const cardTitle = event.currentTarget.closest('.card').querySelector('.card__title'); // Получение названия карточки
      document.querySelector('.popup__caption').innerHTML = cardTitle.textContent; // Установка названия в pop-up
  };
  
  /* Закрытие модального окна при помощи Esc */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const popups = document.getElementsByClassName('popup');
      for (let i = 0; i < popups.length; i++) {
      closeModal(popups[i]);
      }
    }
  });
}
}

// Закрытие модального окна кнопкой Х и кликом мышки вне зоны окна

const popups = document.querySelectorAll('.popup')

popups.forEach((popup) => {
  popup.addEventListener('mousedown', (evt) => {
      if (!evt.target.classList.contains('popup__content')) {
          closeModal(popup)
      }
      if (evt.target.classList.contains('popup__close')) {
        closeModal(popup)
      }
  })
})



/* Функция закрытия модального окна */
function closeModal(popup) {
  popup.style.display = 'none';
}
