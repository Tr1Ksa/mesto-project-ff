/* // validation.js

// Конфигурация для валидации форм
export const validationConfig = {
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
    inputElement.dataset.touched = 'false';
  });

  const submitButton = formElement.querySelector(config.submitButtonSelector);
  submitButton.disabled = true;
  submitButton.classList.add(config.inactiveButtonClass);
}

// Общая функция для валидации
export function validateInput(inputElement, errorElement, validationRules) {
  const value = inputElement.value.trim();
  const length = value.length;

  if (length === 0 && (inputElement.dataset.touched === 'true' || inputElement === document.activeElement)) {
    errorElement.textContent = 'Вы пропустили это поле.';
    inputElement.classList.add(validationRules.errorClass);
    return false;
  }

  if (length > 0) {
    if (validationRules.regex && !validationRules.regex.test(value)) {
      errorElement.textContent = inputElement.dataset.error || 'Некорректные данные.';
      inputElement.classList.add(validationRules.errorClass);
      return false;
    }

    if (length < validationRules.minLength || length > validationRules.maxLength) {
      errorElement.textContent = `Минимальное количество символов ${validationRules.minLength}. Длина текста сейчас: ${length} символов.`;
      inputElement.classList.add(validationRules.errorClass);
      return false;
    }
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
    errorClass: 'popup__input_type_error',
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
  const imageExtensions = /\.(jpeg|jpg|png|gif|bmp|webp|svg)$/i;

  const length = value.length;

  if (length === 0 && inputElement.dataset.touched === 'true') {
    errorElement.textContent = 'Вы пропустили это поле.';
    inputElement.classList.add(validationRules.errorClass);
    return false;
  }

  if (length > 0) {
    if (!urlPattern.test(value)) {
      errorElement.textContent = 'Введите адрес сайта.';
      inputElement.classList.add(validationRules.errorClass);
      return false;
    }

    if (!imageExtensions.test(value)) {
      errorElement.textContent = 'Указанный URL не ведёт на изображение.';
      inputElement.classList.add(validationRules.errorClass);
      return false;
    }
  }

  if (length > 0) {
    errorElement.textContent = '';
    inputElement.classList.remove(validationRules.errorClass);
    return true;
  }

  return false;
}

// Функция для включения валидации всех форм
export function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach(form => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
    });

    const inputs = form.querySelectorAll(config.inputSelector);
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const errorElement = form.querySelector(`#${input.id}-error`);
        validateInput(input, errorElement, config);
      });
    });
  });
}

// Функция для активации/деактивации кнопки сохранения
export function toggleSaveButton(form, isValid) {
  const saveButton = form.querySelector('.popup__button');
  if (isValid) {
    saveButton.disabled = false;
    saveButton.classList.remove(validationConfig.inactiveButtonClass);
  } else {
    saveButton.disabled = true;
    saveButton.classList.add(validationConfig.inactiveButtonClass);
  }
} */




/* // Конфигурация для валидации форм
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

// Функция для проверки валидности поля
const checkInputValidity = (formElement, inputElement, config) => {
  if (inputElement.validity.patternMismatch) {
    // Кастомное сообщение для ошибки регулярного выражения
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

// Функция для проверки наличия невалидных полей
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

// Функция для управления состоянием кнопки
const toggleButtonState = (inputList, buttonElement, config) => {
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

  // Проверка состояния кнопки при загрузке формы
  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
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
    hideInputError(formElement, inputElement, config);
  });

  toggleButtonState(inputList, buttonElement, config);
};

// Функция для валидации имени
export const validateName = (nameInput, nameError) => {
  const validationRules = {
    minLength: 2,
    maxLength: 40,
    regex: /^[a-zA-Zа-яА-Я\s-]+$/,
    errorClass: 'popup__input_type_error',
  };
  return validateInput(nameInput, nameError, validationRules);
};

// Функция для валидации описания
export const validateDescription = (descriptionInput, descriptionError) => {
  const validationRules = {
    minLength: 2,
    maxLength: 200,
    errorClass: 'popup__input_type_error',
  };
  return validateInput(descriptionInput, descriptionError, validationRules);
};

// Универсальная функция для валидации URL
export const validateUrl = (inputElement, errorElement, validationRules) => {
  const value = inputElement.value.trim();
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  const imageExtensions = /\.(jpeg|jpg|png|gif|bmp|webp|svg)$/i;

  const length = value.length;

  if (length === 0 && inputElement.dataset.touched === 'true') {
    errorElement.textContent = 'Вы пропустили это поле.';
    inputElement.classList.add(validationRules.errorClass);
    return false;
  }

  if (length > 0) {
    if (!urlPattern.test(value)) {
      errorElement.textContent = 'Введите адрес сайта.';
      inputElement.classList.add(validationRules.errorClass);
      return false;
    }

    if (!imageExtensions.test(value)) {
      errorElement.textContent = 'Указанный URL не ведёт на изображение.';
      inputElement.classList.add(validationRules.errorClass);
      return false;
    }
  }

  if (length > 0) {
    errorElement.textContent = '';
    inputElement.classList.remove(validationRules.errorClass);
    return true;
  }

  return false;
};

// Функция для активации/деактивации кнопки сохранения
export const toggleSaveButton = (form, isValid) => {
  const saveButton = form.querySelector('.popup__button');
  if (isValid) {
    saveButton.disabled = false;
    saveButton.classList.remove(validationConfig.inactiveButtonClass);
  } else {
    saveButton.disabled = true;
    saveButton.classList.add(validationConfig.inactiveButtonClass);
  }
};
 */

/* 
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
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;

    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
};

// Функция для проверки валидности поля
const checkInputValidity = async (formElement, inputElement, config) => {
  if (inputElement.validity.patternMismatch) {
    // Кастомное сообщение для ошибки регулярного выражения
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }

  // Проверка для URL-поля
  if (inputElement.type === 'url' && inputElement.validity.valid) {
    const isValidImage = await isValidImageUrl(inputElement.value);
    if (!isValidImage) {
      inputElement.setCustomValidity('Указанный URL не ведёт на изображение.');
    } else {
      inputElement.setCustomValidity('');
    }
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

// Функция для проверки наличия невалидных полей
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

// Функция для управления состоянием кнопки
const toggleButtonState = (inputList, buttonElement, config) => {
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

  // Проверка состояния кнопки при загрузке формы
  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', async () => {
      await checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
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
    hideInputError(formElement, inputElement, config);
  });

  toggleButtonState(inputList, buttonElement, config);
};

 */

// Конфигурация для валидации форм
export const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error',
};

// Регулярное выражение для проверки имени и названия
const nameRegex = /^[a-zA-Zа-яА-Я\s\-]+$/;

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
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;

    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
};

// Функция для проверки валидности поля
const checkInputValidity = async (formElement, inputElement, config) => {
  // Сбрасываем кастомное сообщение об ошибке
  inputElement.setCustomValidity('');

  // Проверка на пустое поле
  if (inputElement.validity.valueMissing) {
    inputElement.setCustomValidity('Вы пропустили это поле.');
    showInputError(formElement, inputElement, inputElement.validationMessage, config);
    return; // Прекращаем дальнейшую проверку, если поле пустое
  }

  // Проверка для полей "Имя" и "Название"
  if ((inputElement.name === 'name' || inputElement.name === 'place-name') && !nameRegex.test(inputElement.value)) {
    // Используем текст ошибки из data-error атрибута
    inputElement.setCustomValidity(inputElement.dataset.error);
  }

  // Проверка для URL-поля
  if (inputElement.type === 'url' && inputElement.validity.valid) {
    const isValidImage = await isValidImageUrl(inputElement.value);
    if (!isValidImage) {
      inputElement.setCustomValidity('Указанный URL не ведёт на изображение.');
    }
  }

  // Если поле невалидно, показываем ошибку
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

// Функция для проверки наличия невалидных полей
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

// Функция для управления состоянием кнопки
const toggleButtonState = (inputList, buttonElement, config) => {
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

  // Проверка состояния кнопки при загрузке формы
  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', async () => {
      await checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
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
    hideInputError(formElement, inputElement, config);
  });

  toggleButtonState(inputList, buttonElement, config);
};