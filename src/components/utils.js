// Функция для изменения состояния кнопки
export function toggleButtonLoadingState(button, isLoading, defaultText, loadingText = 'Сохранение...') {
  if (isLoading) {
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = defaultText;
    button.disabled = false;
  }
}





/* 
let isFormSubmitted = false; // Флаг для отслеживания успешного сабмита
let savedFormState = {}; // Сохраняем состояние формы

openAddButton.addEventListener('click', () => {
  if (!isFormSubmitted) {
    // Восстанавливаем значения полей, если форма не была отправлена
    newCardNameInput.value = savedFormState.name || '';
    newCardLinkInput.value = savedFormState.link || '';
  } else {
    // Сбрасываем форму, если она была отправлена
    newCardForm.reset();
    isFormSubmitted = false; // Сбрасываем флаг
  }

  const submitButton = newCardForm.querySelector('.popup__button');
  submitButton.disabled = true;
  submitButton.classList.add(validationConfig.inactiveButtonClass);
  clearValidation(newCardForm, validationConfig);
  openModal(popupNewCard);
});

function submitAddCardForm(evt) {
  evt.preventDefault();

  const saveButton = newCardForm.querySelector('.popup__button');
  const defaultText = saveButton.textContent;

  toggleButtonLoadingState(saveButton, true, defaultText);

  const newCard = {
    name: newCardNameInput.value,
    link: newCardLinkInput.value
  };

  addNewCard(newCard.name, newCard.link)
    .then((newCardResponse) => {
      if (!newCardResponse._id) {
        throw new Error('Сервер не вернул ID карточки');
      }

      const cardElement = createCard(
        newCardResponse,
        (cardId, likeButton, likeCount) => handleLikeClick(cardId, likeButton, likeCount, likeCard, unlikeCard),
        (cardId) => deleteCard(cardId, openModal),
        openImagePopup,
        currentUserId
      );

      cardsList.prepend(cardElement);
      closeModal(popupNewCard);
      newCardForm.reset();
      clearValidation(newCardForm, validationConfig);
      isFormSubmitted = true; // Устанавливаем флаг успешного сабмита
    })
    .catch((err) => {
      console.error('Ошибка при добавлении карточки:', err);
    })
    .finally(() => {
      toggleButtonLoadingState(saveButton, false, defaultText);
    });
}

newCardForm.addEventListener('submit', submitAddCardForm);

// Сохраняем состояние формы при изменении полей ввода
newCardNameInput.addEventListener('input', () => {
  savedFormState.name = newCardNameInput.value;
});

newCardLinkInput.addEventListener('input', () => {
  savedFormState.link = newCardLinkInput.value;
}); */

/* openAddButton.addEventListener('click', () => {
  if (isFormSubmitted) {
    newCardForm.reset();
    clearValidation(newCardForm, validationConfig);
    const submitButton = newCardForm.querySelector('.popup__button');
    submitButton.disabled = true;
    submitButton.classList.add(validationConfig.inactiveButtonClass);
  }
  openModal(popupNewCard);
});

let isFormSubmitted = false;

function submitAddCardForm(evt) {
  evt.preventDefault();

  const saveButton = newCardForm.querySelector('.popup__button');
  const defaultText = saveButton.textContent;

  toggleButtonLoadingState(saveButton, true, defaultText);

  const newCard = {
    name: newCardNameInput.value,
    link: newCardLinkInput.value
  };

  addNewCard(newCard.name, newCard.link)
    .then((newCardResponse) => {
      if (!newCardResponse._id) {
        throw new Error('Сервер не вернул ID карточки');
      }

      const cardElement = createCard(
        newCardResponse,
        (cardId, likeButton, likeCount) => handleLikeClick(cardId, likeButton, likeCount, likeCard, unlikeCard),
        (cardId) => deleteCard(cardId, openModal),
        openImagePopup,
        currentUserId
      );

      cardsList.prepend(cardElement);
      closeModal(popupNewCard);
      newCardForm.reset();
      clearValidation(newCardForm, enableValidation);
      isFormSubmitted = true; // Устанавливаем флаг в true
    })
    .catch((err) => {
      console.error('Ошибка при добавлении карточки:', err);
    })
    .finally(() => {
      toggleButtonLoadingState(saveButton, false, defaultText);
    });
}

newCardForm.addEventListener('submit', submitAddCardForm); */