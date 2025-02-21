// card.js

/* // Функция для создания карточки
export function createCard(item, likeHandler, deleteHandler, imageClickHandler, currentUserId, openModal) {
  // Находим шаблон карточки в DOM
  const cardTemplate = document.querySelector('#card-template');
  if (!cardTemplate) {
    console.error('Шаблон карточки не найден!');
    return null;
  }

  // Клонируем содержимое шаблона карточки
  const cardElement = cardTemplate.content.querySelector('.places__item').cloneNode(true);

  // Находим элементы карточки
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  // Проверяем, что все элементы найдены
  if (!cardImage || !cardTitle || !deleteButton || !likeButton || !likeCount) {
    console.error('Один из элементов карточки не найден!');
    return null;
  }

  // Заполняем карточку данными
  cardImage.src = item.link || '';
  cardImage.alt = item.name || '';
  cardTitle.textContent = item.name || 'Без названия';

  // Устанавливаем количество лайков
  likeCount.textContent = item.likes ? item.likes.length : 0;

  // Проверяем, лайкнул ли текущий пользователь карточку
  const isLiked = item.likes && item.likes.some(like => like._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  } else {
    likeButton.classList.remove('card__like-button_is-active');
  }

  // Устанавливаем ID карточки в dataset
  cardElement.dataset.cardId = item._id || '';

  // Если карточка принадлежит текущему пользователю, добавляем обработчик удаления
  if (item.owner && item.owner._id === currentUserId) {
    deleteButton.addEventListener('click', () => {
      deleteHandler(item._id, openModal);
    });
  } else {
    deleteButton.remove();
  }

  // Добавляем обработчики событий для лайка и клика по изображению
  likeButton.addEventListener('click', () => likeHandler(item._id, likeButton, likeCount));
  cardImage.addEventListener('click', imageClickHandler);

  // Возвращаем созданную карточку
  return cardElement;
}

// Функция для обработки клика по лайку
export function handleLikeClick(cardId, likeButton, likeCount, likeCard, unlikeCard) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  if (isLiked) {
      // Если лайк уже поставлен, убираем его
      unlikeCard(cardId)
          .then((updatedCard) => {
              likeButton.classList.remove('card__like-button_is-active');
              likeCount.textContent = updatedCard.likes.length;
          })
          .catch((err) => {
              console.error('Ошибка при снятии лайка:', err);
          });
  } else {
      // Если лайк не поставлен, добавляем его
      likeCard(cardId)
          .then((updatedCard) => {
              likeButton.classList.add('card__like-button_is-active');
              likeCount.textContent = updatedCard.likes.length;
          })
          .catch((err) => {
              console.error('Ошибка при постановке лайка:', err);
          });
  }
}

// Функция удаления карточки
export function deleteCard(cardId, openModal) {
  const confirmDeletePopup = document.querySelector('.popup_type_confirm-delete');
  if (confirmDeletePopup) {
    openModal(confirmDeletePopup);
    confirmDeletePopup.dataset.cardId = cardId;
  } else {
    console.error('Модальное окно подтверждения удаления не найдено');
  }
} */

  // Функция для создания карточки
export function createCard(item, likeHandler, deleteHandler, imageClickHandler, currentUserId, openModal) {
  const cardTemplate = document.querySelector('#card-template');
  if (!cardTemplate) {
    console.error('Шаблон карточки не найден!');
    return null;
  }

  const cardElement = cardTemplate.content.querySelector('.places__item').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  if (!cardImage || !cardTitle || !deleteButton || !likeButton || !likeCount) {
    console.error('Один из элементов карточки не найден!');
    return null;
  }

  // Заполняем карточку данными
  cardImage.src = item.link || '';
  cardImage.alt = item.name || '';
  cardTitle.textContent = item.name || 'Без названия';

  // Устанавливаем количество лайков
  likeCount.textContent = item.likes ? item.likes.length : 0;

  // Проверяем, лайкнул ли текущий пользователь карточку
  const isLiked = item.likes && item.likes.some(like => like._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  } else {
    likeButton.classList.remove('card__like-button_is-active');
  }

  // Устанавливаем ID карточки в dataset
  cardElement.dataset.cardId = item._id || '';

  // Если карточка принадлежит текущему пользователю, добавляем обработчик удаления
  if (item.owner && item.owner._id === currentUserId) {
    deleteButton.addEventListener('click', () => {
      deleteHandler(item._id, openModal);
    });
  } else {
    deleteButton.remove();
  }

  // Добавляем обработчики событий для лайка и клика по изображению
  likeButton.addEventListener('click', () => likeHandler(item._id, likeButton, likeCount));
  cardImage.addEventListener('click', imageClickHandler);

  return cardElement;
}

// Функция для обработки клика по лайку
export function handleLikeClick(cardId, likeButton, likeCount, likeCard, unlikeCard) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  const apiCall = isLiked ? unlikeCard(cardId) : likeCard(cardId);

  apiCall
    .then((updatedCard) => {
      likeButton.classList.toggle('card__like-button_is-active');
      likeCount.textContent = updatedCard.likes.length;
    })
    .catch((err) => {
      console.error('Ошибка при обработке лайка:', err);
    });
}

// Функция удаления карточки
export function deleteCard(cardId, openModal) {
  const confirmDeletePopup = document.querySelector('.popup_type_confirm-delete');
  if (confirmDeletePopup) {
    // Открываем модальное окно и передаем ID карточки
    openModal(confirmDeletePopup);
    confirmDeletePopup.dataset.cardId = cardId;
  } else {
    console.error('Модальное окно подтверждения удаления не найдено');
  }
}