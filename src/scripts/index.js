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

const popups = document.querySelectorAll('.popup');

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
for (let i = 0; i < openCardImageList.length; i++) {
  openCardImageList[i].addEventListener('click', handleImageClick);
}





//подтягивание картинки и описания в модальное окно

function handleImageClick(event) {
  if (event.target.tagName === 'IMG') { // Проверка, является ли target изображением
    popupTypeImage.style.display = 'flex';
    document.querySelector('.popup__image').src = event.target.src; // Установка источника изображения в pop-up
    const cardTitle = event.currentTarget.closest('.card').querySelector('.card__title'); // Получение названия карточки
    document.querySelector('.popup__caption').innerHTML = cardTitle.textContent; // Установка названия в pop-up

    // Передача события в функцию openModal
    openModal(event);
  }
}


// Функция открытия модального окна
function openModal(event) {
  if (event.target === openEditButtons) {
    popupTypeEdit.style.display = 'flex';

  } else if (event.target === openAddButtons) {
    popupNewCard.style.display = 'flex';

  } else if (event.target === openCardImageList) {
      popupTypeImage.style.display = 'flex';
  };
}


  // Закрытие модального окна при помощи Esc 
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      for (let i = 0; i < popups.length; i++) {
      closeModal(popups[i]);
      }
    }
  });


// Закрытие модального окна кнопкой Х и кликом мышки вне зоны модального окна
popups.forEach((popup) => {
  popup.addEventListener('mousedown', (evt) => {
    if (!evt.target.classList.contains('popup__close')) {
      // Не закрывать модальное окно, если пользователь щёлкает в любом месте внутри него.
      return;
    }
    // Если нажата кнопка закрытия, закрыть модальное окно.
    closeModal(popup);
  });
});



/* Функция закрытия модального окна */
function closeModal(popup) {
  popup.style.display = 'none';
}



// Редактирование имени и информации о себе

// Находим форму в DOM
const formElement = document.querySelector('edit-profile'); // Воспользуйтесь методом querySelector()

// Находим поля формы в DOM
const nameInput = document.querySelector('name'); // Воспользуйтесь инструментом .querySelector()
const jobInput = document.querySelector('description'); // Воспользуйтесь инструментом .querySelector()

// Обработчик «отправки» формы, хотя пока
// она никуда отправляться не будет
function handleFormSubmit(evt) {
    evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.

    // Получаем значение полей jobInput и nameInput из свойства value
    const userName = nameInput.value;
    const jobDescription = jobInput.value;

    // Выбираем элементы, куда должны быть вставлены значения полей
    const resultElement = document.getElementById('result');

    // Вставляем новые значения с помощью textContent
    resultElement.textContent = `Имя: ${userName} \nОписание: ${jobDescription}`;
}

// Прикрепляем обработчик к форме:
// он будет следить за событием "submit" - «отправка»
formElement.addEventListener('submit', handleFormSubmit);
