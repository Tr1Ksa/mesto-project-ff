//index.js

// Импорт стилей и модулей
import '../pages/index.css';
import { openModal, closeModal } from '../components/modal.js';
import { createCard, handleLikeClick, deleteCard } from '../components/card.js';
import { closePopupByClick } from '../components/modal.js';
import { validationConfig, clearValidation, enableValidation,  validateInput, validateName, validateDescription, validateUrl } from '../components/validation.js';
import { getUserInfo, getInitialCards, updateProfile, addNewCard, deleteCardApi, likeCard, unlikeCard, updateAvatar } from '../components/api.js';
import { toggleButtonLoadingState } from '../components/utils.js';

// Получение DOM-элементов
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
const newCardNameInput = newCardForm.querySelector('.popup__input_type_card-name');
const newCardLinkInput = newCardForm.querySelector('.popup__input_type_url');
const popupImage = document.querySelector('.popup__image');
const placeNameInput = newCardForm.elements['place-name'];
const linkInput = newCardForm.elements['link'];
const nameError = editProfileForm.querySelector('.popup__error_type_name');
const descriptionError = editProfileForm.querySelector('.popup__error_type_description');
const errorPlaceName = newCardForm.querySelector('.popup__error_visible_place-name');
const errorLink = newCardForm.querySelector('.popup__error_visible_link');

let currentUserId; // ID текущего пользователя

// Включение валидации всех форм на странице
enableValidation(validationConfig);

// Функции для работы с профилем
function updateProfileInfo(name, job) {
  profileTitle.textContent = name;
  profileDescription.textContent = job;
}

// Функция для активации/деактивации кнопки сохранения
function toggleSaveButton(form, isValid) {
  const saveButton = form.querySelector('.popup__button');
  if (isValid) {
    saveButton.disabled = false;
    saveButton.classList.remove(validationConfig.inactiveButtonClass);
  } else {
    saveButton.disabled = true;
    saveButton.classList.add(validationConfig.inactiveButtonClass);
  }
}

// Валидация формы «Редактировать профиль»
document.addEventListener('DOMContentLoaded', () => {
  const descriptionInput = editProfileForm.elements.description;
  const validateForm = () => {
    const isNameValid = validateName(nameInput, nameError);
    const isDescriptionValid = validateDescription(descriptionInput, descriptionError);
    toggleSaveButton(editProfileForm, isNameValid && isDescriptionValid);
  };

  nameInput.addEventListener('input', validateForm);
  descriptionInput.addEventListener('input', validateForm);
});

// Валидация формы «Новое место»
document.addEventListener('DOMContentLoaded', () => {
  const validateForm = () => {
    const isPlaceNameValid = validateInput(placeNameInput, errorPlaceName, {
      minLength: 2,
      maxLength: 30,
      regex: /^[a-zA-Zа-яА-Я\s\-]+$/,
      errorClass: 'popup__input_type_error'
    });

    const isLinkValid = validateUrl(linkInput, errorLink, {
      errorClass: 'popup__input_type_error'
    });

    const isFormValid = isPlaceNameValid && isLinkValid && placeNameInput.value.trim() !== '' && linkInput.value.trim() !== '';

    toggleSaveButton(newCardForm, isFormValid);
  };

  placeNameInput.addEventListener('input', validateForm);
  linkInput.addEventListener('input', validateForm);

  openAddButton.addEventListener('click', () => {
    clearValidation(newCardForm, validationConfig);
    validateForm();
    openModal(popupNewCard);
  });

  newCardForm.addEventListener('submit', (event) => {
    event.preventDefault();
    newCardForm.reset();
    clearValidation(newCardForm, validationConfig);
    closeModal(popupNewCard);
  });

  popupNewCard.addEventListener('click', (event) => {
    if (event.target === popupNewCard || event.target.classList.contains('popup__close')) {
      clearValidation(newCardForm, validationConfig);
      closeModal(popupNewCard);
    }
  });
});

// Функция обработки клика по изображению
function openImagePopup(event) {
  const card = event.target.closest('.card');
  const cardTitle = card.querySelector('.card__title').textContent;
  const cardImageSrc = event.target.src;

  popupImage.src = cardImageSrc;
  popupImage.alt = cardTitle;

  document.querySelector('.popup__caption').textContent = cardTitle;
  openModal(popupTypeImage);
}

// Обработчик отправки формы редактирования профиля
function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();

  const saveButton = editProfileForm.querySelector('.popup__button');
  const defaultText = saveButton.textContent;

  // Меняем текст кнопки на "Сохранение..."
  toggleButtonLoadingState(saveButton, true, defaultText);

  const name = nameInput.value;
  const job = jobInput.value;

  updateProfile(name, job)
    .then((userData) => {
      updateProfileInfo(userData.name, userData.about);
      closeModal(popupTypeEdit);
    })
    .catch((err) => {
      console.error('Ошибка при обновлении профиля:', err);
    })
    .finally(() => {
      // Возвращаем исходный текст кнопки
      toggleButtonLoadingState(saveButton, false, defaultText);
    });
}

editProfileForm.addEventListener('submit', handleEditProfileFormSubmit);

//Обработчик открытия модального окна добавления карточки
openAddButton.addEventListener('click', () => {
  const isFormSubmitted = newCardForm.dataset.submitted === 'true';

  if (isFormSubmitted) {
    newCardForm.reset();
    clearValidation(newCardForm, validationConfig);
    const submitButton = newCardForm.querySelector('.popup__button');
    submitButton.disabled = true;
    submitButton.classList.add(validationConfig.inactiveButtonClass);
    delete newCardForm.dataset.submitted;
  }

  openModal(popupNewCard);
});

// Обработчик отправки формы добавления новой карточки
function submitAddCardForm(evt) {
  evt.preventDefault();

  const saveButton = newCardForm.querySelector('.popup__button');
  const defaultText = saveButton.textContent;

  toggleButtonLoadingState(saveButton, true, defaultText);

  const cardName = newCardNameInput.value;
  const cardLink = newCardLinkInput.value;

  addNewCard(cardName, cardLink)
    .then((cardData) => {
      const cardElement = createCard(cardData, (cardId, likeButton, likeCount) => handleLikeClick(cardId, likeButton, likeCount, likeCard, unlikeCard), deleteCard, openImagePopup, currentUserId, openModal, deleteCardApi, closeModal);
      cardsList.prepend(cardElement);
      closeModal(popupNewCard);
      newCardForm.dataset.submitted = 'true';
    })
    .catch((err) => {
      console.error('Ошибка при добавлении карточки:', err);
    })
    .finally(() => {
      toggleButtonLoadingState(saveButton, false, defaultText);
    });
}

newCardForm.addEventListener('submit', submitAddCardForm);

// Обработчик открытия модального окна редактирования профиля
openEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;

  clearValidation(editProfileForm, validationConfig);

  const nameError = editProfileForm.querySelector('.popup__error_type_name');
  const descriptionError = editProfileForm.querySelector('.popup__error_type_description');
  const isNameValid = validateName(nameInput, nameError);
  const isDescriptionValid = validateDescription(jobInput, descriptionError);
  toggleSaveButton(editProfileForm, isNameValid && isDescriptionValid);

  openModal(popupTypeEdit);
});

// Обработчики для закрытия модальных окон
popups.forEach((popup) => {
  popup.addEventListener('mousedown', closePopupByClick);
});

// Работа с API
Promise.all([getUserInfo(), getInitialCards()])
.then(([userData, cards]) => {
    currentUserId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;

    const profileImage = document.querySelector('.profile__image');
    profileImage.style.backgroundImage = `url('${userData.avatar}')`;

    cards.forEach((item) => {
        const cardElement = createCard(item, (cardId, likeButton, likeCount) => handleLikeClick(cardId, likeButton, likeCount, likeCard, unlikeCard), deleteCard, openImagePopup, currentUserId, openModal, deleteCardApi, closeModal);
        cardsList.appendChild(cardElement);
    });
})
.catch((err) => {
    console.log(err);
});

// Обработчик для кнопки "Да" в попапе подтверждения удаления
const confirmDeletePopup = document.querySelector('.popup_type_confirm-delete');
const confirmDeleteForm = confirmDeletePopup.querySelector('.popup__form');

function submitConfirmationForm(evt) {
  evt.preventDefault();

  const cardId = confirmDeletePopup.dataset.cardId;

  deleteCardApi(cardId)
    .then(() => {
      const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
      if (cardElement) {
        cardElement.remove();
      }
      closeModal(confirmDeletePopup);
    })
    .catch((err) => {
      console.error('Ошибка при удалении карточки:', err);
    });
}

confirmDeleteForm.addEventListener('submit', submitConfirmationForm);

// Обработчик для открытия модального окна при клике на иконку редактирования аватара
const editAvatarButton = document.querySelector('.profile__edit-avatar-button');
const popupEditAvatar = document.querySelector('.popup_type_edit-avatar');
const editAvatarForm = document.querySelector('.popup__form[name="edit-avatar"]');
const avatarUrlInput = editAvatarForm.querySelector('.popup__input_type_avatar-url');

editAvatarButton.addEventListener('click', () => {
  editAvatarForm.reset();
  clearValidation(editAvatarForm, validationConfig);
  const submitButton = editAvatarForm.querySelector('.popup__button');
  submitButton.disabled = true;
  submitButton.classList.add(validationConfig.inactiveButtonClass);
  openModal(popupEditAvatar);
});

// Обработчик для валидации формы редактирования аватара
document.addEventListener('DOMContentLoaded', () => {
  const form = document.forms['edit-avatar'];
  const avatarInput = form.elements.avatar;
  const errorAvatar = form.querySelector('.popup__error_visible_avatar');

  const validateForm = async () => {
    const isAvatarValid = await validateAvatarUrl(avatarInput, errorAvatar);
    toggleSaveButton(form, isAvatarValid);
  };

  avatarInput.addEventListener('input', validateForm);
});

// Обработчик для отправки формы редактирования аватара
function submitUpdateAvatarForm(evt) {
  evt.preventDefault();

  const saveButton = editAvatarForm.querySelector('.popup__button');
  const defaultText = saveButton.textContent;

  toggleButtonLoadingState(saveButton, true, defaultText);

  const avatarUrl = avatarUrlInput.value;

  updateAvatar(avatarUrl)
    .then((userData) => {
      const profileImage = document.querySelector('.profile__image');
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
      closeModal(popupEditAvatar);
    })
    .catch((err) => {
      console.error('Ошибка при обновлении аватара:', err);
    })
    .finally(() => {
      toggleButtonLoadingState(saveButton, false, defaultText);
    });
}

editAvatarForm.addEventListener('submit', submitUpdateAvatarForm);

// Функция для проверки, является ли URL действительным изображением
function isValidImageUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;

    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
}

// Функция валидации для поля ввода аватара
async function validateAvatarUrl(input, errorElement) {
  const isUrlValid = validateUrl(input, errorElement, {
    errorClass: 'popup__input_type_error'
  });

  if (!isUrlValid) {
    return false;
  }

  try {
    const isValidImage = await isValidImageUrl(input.value);
    if (!isValidImage) {
      errorElement.textContent = 'Указанный URL не ведёт на изображение';
      input.classList.add('popup__input_type_error');
      return false;
    } else {
      errorElement.textContent = '';
      input.classList.remove('popup__input_type_error');
      return true;
    }
  } catch (error) {
    errorElement.textContent = 'Не удалось проверить URL';
    input.classList.add('popup__input_type_error');
    return false;
  }
}

// Инициализация обработчика подтверждения удаления карточки
document.addEventListener('DOMContentLoaded', () => {
  const confirmDeletePopup = document.querySelector('.popup_type_confirm-delete');
  if (confirmDeletePopup) {
    const confirmButton = confirmDeletePopup.querySelector('.popup__confirm-button');
    if (confirmButton) {
      confirmButton.addEventListener('click', () => {
        const cardId = confirmDeletePopup.dataset.cardId;
        if (cardId) {
          deleteCardApi(cardId)
            .then(() => {
              const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
              if (cardElement) {
                cardElement.remove();
              }
              closeModal(confirmDeletePopup);
            })
            .catch((err) => {
              console.error('Ошибка при удалении карточки:', err);
            });
        }
      });
    }
  }
});