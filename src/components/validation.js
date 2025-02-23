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