//card.js

// Глобальная переменная для хранения шаблона карточки
const cardTemplate = document.querySelector('#card-template');

// Функция для клонирования шаблона карточки
function getCardTemplate() {
  if (!cardTemplate) {
    console.error('Шаблон карточки не найден!');
    return null;
  }
  return cardTemplate.content.querySelector('.places__item').cloneNode(true);
}

// Функция для создания карточки
export function createCard(item, likeHandler, deleteHandler, imageClickHandler, currentUserId, openModal, deleteCardApi, closeModal) {
  const cardElement = getCardTemplate();
  if (!cardElement) {
    return null;
  }

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

  // Устанавливаем ID карточки в dataset мой код
  cardElement.dataset.cardId = item._id || '';
  // Если карточка принадлежит текущему пользователю, добавляем обработчик удаления мой код
  if (item.owner && item.owner._id === currentUserId) {
    deleteButton.addEventListener('click', () => {
      deleteHandler(item._id, openModal, cardElement, deleteCardApi, closeModal);
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
export function deleteCard(cardId, openModal, cardElement, deleteCardApi, closeModal) {
  const confirmDeletePopup = document.querySelector('.popup_type_confirm-delete');
  if (confirmDeletePopup) {
    openModal(confirmDeletePopup);

    const confirmButton = confirmDeletePopup.querySelector('.popup__confirm-button');
    const handleConfirmClick = (e) => {
      e.preventDefault();
      deleteCardApi(cardId)
        .then(() => {
          cardElement.remove();
          closeModal(confirmDeletePopup);
        })
        .catch((err) => {
          console.error('Ошибка при удалении карточки:', err);
        })
        .finally(() => {
          confirmButton.removeEventListener('click', handleConfirmClick);
        });
    };

    confirmButton.addEventListener('click', handleConfirmClick);
  } else {
    console.error('Модальное окно подтверждения удаления не найдено');
  }
}