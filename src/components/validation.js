// validation.js

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
    return false;
  } else if (length < 2 || length > 200) {
    descriptionError.textContent = `Минимальное количество символов 2. Длина текста сейчас: ${length} символов.`;
    return false;
  } else {
    descriptionError.textContent = '';
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
