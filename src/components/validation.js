// validation.js
/*
// Конфигурация для валидации форм
export const enableValidation = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error'
};

// Функция для очистки ошибок валидации и сброса состояния кнопки
  export function clearValidation(formElement, enableValidation) {
    const errorElements = formElement.querySelectorAll(`.${enableValidation.errorClass}`);
    errorElements.forEach(errorElement => {
      errorElement.textContent = '';
    });
  
    const inputElements = formElement.querySelectorAll(enableValidation.inputSelector);
    inputElements.forEach(inputElement => {
      inputElement.classList.remove(enableValidation.inputErrorClass);
      inputElement.classList.remove('popup__input_type_error');
    });
  
    const submitButton = formElement.querySelector(enableValidation.submitButtonSelector);
    submitButton.disabled = true;
    submitButton.classList.add(enableValidation.inactiveButtonClass);
  }

// Функция для валидации имени
export function validateName(nameInput, nameError) {
  const regex = /^[a-zA-Zа-яА-Я\s-]+$/;
  const value = nameInput.value.trim();
  const length = value.length;

  if (length === 0) {
    nameError.textContent = 'Вы пропустили это поле.';
    nameInput.classList.add('popup__input_type_error');
    return false;
  } else if (!regex.test(value)) {
    nameError.textContent = nameInput.dataset.error;
    nameInput.classList.add('popup__input_type_error');
    return false;
  } else if (length < 2 || length > 40) {
    nameError.textContent = `Минимальное количество символов 2. Длина текста сейчас: ${length} символов.`;
    nameInput.classList.add('popup__input_type_error');
    return false;
  } else {
    nameError.textContent = '';
    nameInput.classList.remove('popup__input_type_error');
    return true;
  }
}

// Функция для валидации описания
export function validateDescription(descriptionInput, descriptionError) {
  const value = descriptionInput.value.trim();
  const length = value.length;

  if (length === 0) {
    descriptionError.textContent = 'Вы пропустили это поле.';
    descriptionInput.classList.add('popup__input_type_error');
    return false;
  } else if (length < 2 || length > 200) {
    descriptionError.textContent = `Минимальное количество символов 2. Длина текста сейчас: ${length} символов.`;
    descriptionInput.classList.add('popup__input_type_error');
    return false;
  } else {
    descriptionError.textContent = '';
    descriptionInput.classList.remove('popup__input_type_error');
    return true;
  }
}

// Функция для валидации названия карточки
export function validatePlaceName(placeNameInput, errorPlaceName) {
  const nameRegex = /^[a-zA-Zа-яА-Я\s\-]+$/;
  const value = placeNameInput.value.trim();
  const length = value.length;

  if (length === 0) {
    errorPlaceName.textContent = 'Вы пропустили это поле.';
    placeNameInput.classList.add('popup__input_type_error');
    return false;
  } else if (length < 2 || length > 30) {
    errorPlaceName.textContent = `Минимальное количество символов 2. Длина текста сейчас: ${length} символов.`;
    placeNameInput.classList.add('popup__input_type_error');
    return false;
  } else if (!nameRegex.test(value)) {
    errorPlaceName.textContent = placeNameInput.dataset.error;
    placeNameInput.classList.add('popup__input_type_error');
    return false;
  } else {
    errorPlaceName.textContent = '';
    placeNameInput.classList.remove('popup__input_type_error');
    return true;
  }
}

// Функция для валидации ссылки на картинку
export function validateLink(linkInput, errorLink) {
  const value = linkInput.value.trim();
  const length = value.length;

  if (length === 0) {
    errorLink.textContent = 'Введите адрес сайта.';
    linkInput.classList.add('popup__input_type_error');
    return false;
  } else if (!linkInput.checkValidity()) {
    errorLink.textContent = linkInput.validationMessage;
    linkInput.classList.add('popup__input_type_error');
    return false;
  } else {
    errorLink.textContent = '';
    linkInput.classList.remove('popup__input_type_error');
    return true;
  }
}

 */

// validation.js

// Конфигурация для валидации форм
export const enableValidation = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error',
};

// Функция для очистки ошибок валидации и сброса состояния кнопки
export function clearValidation(formElement, config) {
  const errorElements = formElement.querySelectorAll(`.${config.errorClass}`);
  errorElements.forEach(errorElement => {
    errorElement.textContent = '';
  });

  const inputElements = formElement.querySelectorAll(config.inputSelector);
  inputElements.forEach(inputElement => {
    inputElement.classList.remove(config.inputErrorClass);
  });

  const submitButton = formElement.querySelector(config.submitButtonSelector);
  submitButton.disabled = true;
  submitButton.classList.add(config.inactiveButtonClass);
}

// Общая функция для валидации
export function validateInput(inputElement, errorElement, validationRules) {
  const value = inputElement.value.trim();
  const length = value.length;

  if (length === 0) {
    errorElement.textContent = 'Вы пропустили это поле.';
    inputElement.classList.add(validationRules.errorClass);
    return false;
  }

  if (validationRules.regex && !validationRules.regex.test(value)) {
    errorElement.textContent = inputElement.dataset.error;
    inputElement.classList.add(validationRules.errorClass);
    return false;
  }

  if (length < validationRules.minLength || length > validationRules.maxLength) {
    errorElement.textContent = `Минимальное количество символов ${validationRules.minLength}. Длина текста сейчас: ${length} символов.`;
    inputElement.classList.add(validationRules.errorClass);
    return false;
  }

  errorElement.textContent = '';
  inputElement.classList.remove(validationRules.errorClass);
  return true;
}

// Функция для валидации имени
export function validateName(nameInput, nameError) {
  const validationRules = {
    minLength: 2,
    maxLength: 40,
    regex: /^[a-zA-Zа-яА-Я\s-]+$/,
    errorClass: 'popup__input_type_error'
  };
  return validateInput(nameInput, nameError, validationRules);
}

// Функция для валидации описания
export function validateDescription(descriptionInput, descriptionError) {
  const validationRules = {
    minLength: 2,
    maxLength: 200,
    errorClass: 'popup__input_type_error',
  };
  return validateInput(descriptionInput, descriptionError, validationRules);
}

// Универсальная функция для валидации URL
export function validateUrl(inputElement, errorElement, validationRules) {
  const value = inputElement.value.trim();
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  if (value.length === 0) {
    errorElement.textContent = 'Вы пропустили это поле.';
    inputElement.classList.add(validationRules.errorClass);
    return false;
  }

  if (!urlPattern.test(value)) {
    errorElement.textContent = 'Введите адрес сайта.';
    inputElement.classList.add(validationRules.errorClass);
    return false;
  }

  errorElement.textContent = '';
  inputElement.classList.remove(validationRules.errorClass);
  return true;
}