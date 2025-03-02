// validation.js

// Конфигурация для валидации форм
export const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error',
};

// Функция для показа ошибки валидации
const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
};

// Функция для скрытия ошибки валидации
const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = '';
};

// Функция для проверки, что URL ведет на изображение
const isValidImageUrl = (url) => {
  const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))$/i;
  return urlPattern.test(url);
};

// Функция для получения кастомного сообщения об ошибке
const getCustomErrorMessage = (inputElement) => {
  return inputElement.dataset.errorMessage || inputElement.validationMessage;
};

// Функция для проверки валидности поля
const checkInputValidity = (formElement, inputElement, config) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(getCustomErrorMessage(inputElement));
  } else {
    inputElement.setCustomValidity('');
  }

  // Проверка для URL-поля
  if (inputElement.type === 'url' && inputElement.validity.valid) {
    const isValidImage = isValidImageUrl(inputElement.value);
    if (!isValidImage) {
      inputElement.setCustomValidity('Указанный URL не ведёт на изображение.');
    } else {
      inputElement.setCustomValidity('');
    }
  }

  // Отображение или скрытие ошибки
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(formElement, inputElement, config);
  }
};


// Функция для проверки наличия невалидных или пустых полей
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid || inputElement.value.trim() === '';
  });
};

// Функция для управления состоянием кнопки
const toggleSaveButton = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
};

// Функция для установки обработчиков событий на поля формы
const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleSaveButton(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, config);
      toggleSaveButton(inputList, buttonElement, config);
    });
  });
};

// Функция для включения валидации всех форм
export const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });

    setEventListeners(formElement, config);
  });
};

// Функция для очистки ошибок валидации
export const clearValidation = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    inputElement.setCustomValidity('');
    hideInputError(formElement, inputElement, config);
  });

  toggleSaveButton(inputList, buttonElement, config);
};
