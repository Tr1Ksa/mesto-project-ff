import '../pages/index.css'; // Импорт стилей для страницы
import { initialCards } from '../components/cards.js'; // Импорт массива с карточками
import { createCard, handleLikeClick, deleteCard } from '../components/card.js'; // Импорт функций для работы с карточками
import { openModal, closeModal } from '../components/modal.js'; // Импорт функций для работы с модальными окнами
import { closePopupByClick } from '../components/modal.js'; // Импорт функции для закрытия попапов по клику вне области

// DOM-элементы
const cardsList = document.querySelector('.places__list'); // Список карточек
const popups = document.querySelectorAll('.popup'); // Все попапы на странице
const popupTypeEdit = document.querySelector('.popup_type_edit'); // Попап редактирования профиля
const popupNewCard = document.querySelector('.popup_type_new-card'); // Попап добавления новой карточки
const popupTypeImage = document.querySelector('.popup_type_image'); // Попап с изображением
const openEditButton = document.querySelector('.profile__edit-button'); // Кнопка открытия попапа редактирования профиля
const openAddButton = document.querySelector('.profile__add-button'); // Кнопка открытия попапа добавления карточки
const editProfileForm = document.querySelector('.popup__form[name="edit-profile"]'); // Форма редактирования профиля
const newCardForm = document.querySelector('.popup__form[name="new-place"]'); // Форма добавления новой карточки
const nameInput = editProfileForm.querySelector('.popup__input_type_name'); // Поле ввода имени в форме редактирования профиля
const jobInput = editProfileForm.querySelector('.popup__input_type_description'); // Поле ввода описания в форме редактирования профиля
const profileTitle = document.querySelector('.profile__title'); // Заголовок профиля
const profileDescription = document.querySelector('.profile__description'); // Описание профиля
const newCardNameInput = newCardForm.querySelector('.popup__input_type_card-name'); // Поле ввода названия карточки
const newCardLinkInput = newCardForm.querySelector('.popup__input_type_url'); // Поле ввода ссылки на изображение

// Конфигурация для валидации форм
const enableValidation = {
  formSelector: '.popup__form', // Селектор формы
  inputSelector: '.popup__input', // Селектор полей ввода
  submitButtonSelector: '.popup__button', // Селектор кнопки отправки
  inactiveButtonClass: 'popup__button_disabled', // Класс для неактивной кнопки
  inputErrorClass: 'popup__input_type_error', // Класс для поля ввода с ошибкой
  errorClass: 'popup__input-error' // Класс для текста ошибки
};

// Функция для очистки ошибок валидации и сброса состояния кнопки
function clearValidation(formElement, enableValidation) {
  // Находим все элементы с ошибками
  const errorElements = formElement.querySelectorAll(`.${enableValidation.errorClass}`);
  // Очищаем текст ошибок
  errorElements.forEach(errorElement => {
    errorElement.textContent = '';
  });

  // Находим все поля ввода
  const inputElements = formElement.querySelectorAll(enableValidation.inputSelector);
  // Убираем класс ошибки с полей ввода
  inputElements.forEach(inputElement => {
    inputElement.classList.remove(enableValidation.inputErrorClass);
  });

  // Находим кнопку отправки и делаем её неактивной
  const submitButton = formElement.querySelector(enableValidation.submitButtonSelector);
  submitButton.disabled = true;
  submitButton.classList.add(enableValidation.inactiveButtonClass);
}

// Валидация формы «Редактировать профиль»
document.addEventListener('DOMContentLoaded', () => {
  const form = document.forms['edit-profile']; // Форма редактирования профиля
  const nameInput = form.elements.name; // Поле ввода имени
  const descriptionInput = form.elements.description; // Поле ввода описания
  const saveButton = form.querySelector('.popup__button'); // Кнопка сохранения
  const nameError = form.querySelector('.popup__error_type_name'); // Элемент для отображения ошибки имени
  const descriptionError = form.querySelector('.popup__error_type_description'); // Элемент для отображения ошибки описания

  const regex = /^[a-zA-Zа-яА-Я\s-]+$/; // Регулярное выражение для проверки имени

  // Функция для валидации имени
  const validateName = () => {
    const value = nameInput.value.trim(); // Убираем пробелы в начале и конце
    const length = value.length; // Получаем длину введенного текста

    if (length === 0) {
      nameError.textContent = 'Вы пропустили это поле.'; // Ошибка, если поле пустое
      return false;
    } else if (!regex.test(value)) {
      nameError.textContent = nameInput.dataset.error; // Ошибка, если текст не соответствует регулярному выражению
      return false;
    } else if (length < 2 || length > 40) {
      nameError.textContent = `Минимальное количество символов 2. Длина текста сейчас: ${length} символов.`; // Ошибка, если длина текста не в пределах 2-40 символов
      return false;
    } else {
      nameError.textContent = ''; // Очищаем ошибку, если всё в порядке
      return true;
    }
  };

  // Функция для валидации описания
  const validateDescription = () => {
    const value = descriptionInput.value.trim(); // Убираем пробелы в начале и конце
    const length = value.length; // Получаем длину введенного текста

    if (length === 0) {
      descriptionError.textContent = 'Вы пропустили это поле.'; // Ошибка, если поле пустое
      return false;
    } else if (length < 2 || length > 200) {
      descriptionError.textContent = `Минимальное количество символов 2. Длина текста сейчас: ${length} символов.`; // Ошибка, если длина текста не в пределах 2-200 символов
      return false;
    } else {
      descriptionError.textContent = ''; // Очищаем ошибку, если всё в порядке
      return true;
    }
  };

  // Функция для переключения состояния кнопки сохранения
  const toggleSaveButton = () => {
    if (validateName() && validateDescription()) {
      saveButton.disabled = false; // Активируем кнопку, если оба поля валидны
      saveButton.classList.remove(enableValidation.inactiveButtonClass);
    } else {
      saveButton.disabled = true; // Деактивируем кнопку, если хотя бы одно поле невалидно
      saveButton.classList.add(enableValidation.inactiveButtonClass);
    }
  };

  // Слушаем ввод в поле имени
  nameInput.addEventListener('input', () => {
    validateName(); // Валидируем имя
    toggleSaveButton(); // Переключаем состояние кнопки
  });

  // Слушаем ввод в поле описания
  descriptionInput.addEventListener('input', () => {
    validateDescription(); // Валидируем описание
    toggleSaveButton(); // Переключаем состояние кнопки
  });

  const profileForm = document.forms['edit-profile']; // Форма редактирования профиля
  const profilePopup = document.querySelector('.popup_type_edit-profile'); // Попап редактирования профиля

  // Слушаем клик по попапу
  profilePopup.addEventListener('click', () => {
    clearValidation(profileForm, enableValidation); // Очищаем валидацию при открытии попапа
  });
});

// Валидация формы «Новое место»
document.addEventListener('DOMContentLoaded', () => {
  const form = document.forms['new-place']; // Форма добавления новой карточки
  const placeNameInput = form.elements['place-name']; // Поле ввода названия карточки
  const linkInput = form.elements['link']; // Поле ввода ссылки на изображение
  const submitButton = form.querySelector('.popup__button'); // Кнопка отправки
  const errorPlaceName = form.querySelector('.popup__error_visible_place-name'); // Элемент для отображения ошибки названия
  const errorLink = form.querySelector('.popup__error_visible_link'); // Элемент для отображения ошибки ссылки

  const nameRegex = /^[a-zA-Zа-яА-Я\s\-]+$/; // Регулярное выражение для проверки названия

  // Функция для проверки валидности поля "Название"
  const validatePlaceName = () => {
    const value = placeNameInput.value.trim(); // Убираем пробелы в начале и конце
    const length = value.length; // Получаем длину введенного текста

    if (length === 0) {
      errorPlaceName.textContent = 'Вы пропустили это поле.'; // Ошибка, если поле пустое
      return false;
    } else if (length < 2 || length > 30) {
      errorPlaceName.textContent = `Минимальное количество символов 2. Длина текста сейчас: ${length} символов.`; // Ошибка, если длина текста не в пределах 2-30 символов
      return false;
    } else if (!nameRegex.test(value)) {
      errorPlaceName.textContent = placeNameInput.dataset.error; // Ошибка, если текст не соответствует регулярному выражению
      return false;
    } else {
      errorPlaceName.textContent = ''; // Очищаем ошибку, если всё в порядке
      return true;
    }
  };

  // Функция для проверки валидности поля "Ссылка на картинку"
  const validateLink = () => {
    const value = linkInput.value.trim(); // Убираем пробелы в начале и конце
    const length = value.length; // Получаем длину введенного текста

    if (length === 0) {
      errorLink.textContent = 'Введите адрес сайта.'; // Ошибка, если поле пустое
      return false;
    } else if (!linkInput.checkValidity()) {
      errorLink.textContent = linkInput.validationMessage; // Ошибка, если ссылка невалидна
      return false;
    } else {
      errorLink.textContent = ''; // Очищаем ошибку, если всё в порядке
      return true;
    }
  };

  // Функция для обновления состояния кнопки "Сохранить"
  const updateSubmitButton = () => {
    if (validatePlaceName() && validateLink()) {
      submitButton.disabled = false; // Активируем кнопку, если оба поля валидны
      submitButton.classList.remove(enableValidation.inactiveButtonClass);
    } else {
      submitButton.disabled = true; // Деактивируем кнопку, если хотя бы одно поле невалидно
      submitButton.classList.add(enableValidation.inactiveButtonClass);
    }
  };

  // Слушаем ввод в поле названия карточки
  placeNameInput.addEventListener('input', () => {
    validatePlaceName(); // Валидируем название
    updateSubmitButton(); // Обновляем состояние кнопки
  });

  // Слушаем ввод в поле ссылки на изображение
  linkInput.addEventListener('input', () => {
    validateLink(); // Валидируем ссылку
    updateSubmitButton(); // Обновляем состояние кнопки
  });
});

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
  nameInput.value = profileTitle.textContent; // Заполняем поле имени текущим значением
  jobInput.value = profileDescription.textContent; // Заполняем поле описания текущим значением
  clearValidation(editProfileForm, enableValidation); // Очищаем ошибки валидации
  openModal(popupTypeEdit); // Открываем попап
});

// Обработчик отправки формы редактирования профиля
editProfileForm.addEventListener('submit', handleEditProfileFormSubmit);

// Обработчики для закрытия модальных окон
popups.forEach((popup) => {
  popup.addEventListener('mousedown', closePopupByClick); // Закрываем попап по клику вне области
});

















/*
//=================================================================================


// Элементы формы добавления карточки
const newCardNameInput = newCardForm.querySelector('.popup__input_type_card-name');
const newCardLinkInput = newCardForm.querySelector('.popup__input_type_url');

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
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(popupTypeEdit);
}

// Обработчик отправки формы добавления карточки
newCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const newCard = {
    name: newCardNameInput.value,
    link: newCardLinkInput.value,
    description: newCardNameInput.value
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
  // Подставляем текущие данные пользователя в поля ввода
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  // Очищаем ошибки валидации
  clearValidation(editProfileForm, enableValidation);

  // Открываем модальное окно
  openModal(popupTypeEdit);
});

// Обработчик открытия модального окна добавления карточки
openAddButton.addEventListener('click', () => openModal(popupNewCard));

// Обработчик отправки формы редактирования профиля
editProfileForm.addEventListener('submit', handleEditProfileFormSubmit);

// Обработчики для закрытия модальных окон
popups.forEach((popup) => {
  popup.addEventListener('mousedown', closePopupByClick);
});
*/