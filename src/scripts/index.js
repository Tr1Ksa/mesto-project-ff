import '../pages/index.css';
import { initialCards } from '../components/cards.js';
import { createCard, handleLikeClick, deleteCard } from '../components/card.js';
import { openModal, closeModal } from '../components/modal.js';
import { closePopupByClick } from '../components/modal.js';

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


// Валидация формы «Редактировать профиль»
//=========================================================================

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

// Ожидаем загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  // Находим форму редактирования профиля
  const form = document.forms['edit-profile'];
  // Находим поля ввода имени и описания
  const nameInput = form.elements.name;
  const descriptionInput = form.elements.description;
  // Находим кнопку сохранения
  const saveButton = form.querySelector('.popup__button');
  // Находим элементы для отображения ошибок
  const nameError = form.querySelector('.popup__error_type_name');
  const descriptionError = form.querySelector('.popup__error_type_description');

  // Регулярное выражение для валидации имени (только буквы, пробелы и дефисы)
  const regex = /^[a-zA-Zа-яА-Я\s-]+$/;

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

  // Находим форму и попап редактирования профиля
  const profileForm = document.forms['edit-profile'];
  const profilePopup = document.querySelector('.popup_type_edit-profile');

  // Слушаем клик по попапу
  profilePopup.addEventListener('click', () => {
    clearValidation(profileForm, enableValidation); // Очищаем валидацию при открытии попапа
  });
});





// Валидация формы «Новое место»
//=================================================================================
document.addEventListener('DOMContentLoaded', () => {
  const form = document.forms['new-place'];
  const placeNameInput = form.elements['place-name'];
  const linkInput = form.elements['link'];
  const submitButton = form.querySelector('.popup__button');
  const errorPlaceName = form.querySelector('.popup__error_visible_place-name');
  const errorLink = form.querySelector('.popup__error_visible_link');

  // Регулярное выражение для проверки поля "Название"
  const nameRegex = /^[a-zA-Zа-яА-Я\s\-]+$/;

  // Функция для проверки валидности поля "Название"
  const validatePlaceName = () => {
      const value = placeNameInput.value.trim();
      const length = value.length;

      if (length === 0) {
          errorPlaceName.textContent = 'Вы пропустили это поле.';
          return false;
      } else if (length < 2 || length > 30) {
          errorPlaceName.textContent = `Минимальное количество символов 2. Длина текста сейчас: ${length} символов.`;
          return false;
      } else if (!nameRegex.test(value)) {
          errorPlaceName.textContent = placeNameInput.dataset.error;
          return false;
      } else {
          errorPlaceName.textContent = '';
          return true;
      }
  };

  // Функция для проверки валидности поля "Ссылка на картинку"
  const validateLink = () => {
      const value = linkInput.value.trim();
      const length = value.length;

      if (length === 0) {
          errorLink.textContent = 'Введите адрес сайта.';
          return false;
      } else if (!linkInput.checkValidity()) {
          errorLink.textContent = linkInput.validationMessage;
          return false;
      } else {
          errorLink.textContent = '';
          return true;
      }
  };

  // Функция для обновления состояния кнопки "Сохранить"
  const updateSubmitButton = () => {
      if (validatePlaceName() && validateLink()) {
          submitButton.disabled = false;
      } else {
          submitButton.disabled = true;
      }
  };

  // Слушатели событий для полей ввода
  placeNameInput.addEventListener('input', () => {
      validatePlaceName();
      updateSubmitButton();
  });

  linkInput.addEventListener('input', () => {
      validateLink();
      updateSubmitButton();
  })
});




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