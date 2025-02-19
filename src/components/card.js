import { openModal } from './modal.js';
import { likeCard, unlikeCard } from './api.js';

// Функция для создания карточки
export function createCard(item, likeHandler, deleteHandler, imageClickHandler, currentUserId) {
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
      const confirmDeletePopup = document.querySelector('.popup_type_confirm-delete');
      if (confirmDeletePopup) {
        openModal(confirmDeletePopup);
        confirmDeletePopup.dataset.cardId = item._id;
      } else {
        console.error('Модальное окно подтверждения удаления не найдено');
      }
    });
  } else {
    // Если карточка не принадлежит пользователю, удаляем кнопку удаления
    deleteButton.remove();
  }

  // Добавляем обработчики событий для лайка и клика по изображению
  likeButton.addEventListener('click', () => likeHandler(item._id, likeButton, likeCount));
  cardImage.addEventListener('click', imageClickHandler);

  // Возвращаем созданную карточку
  return cardElement;
}

// Функция для обработки клика по лайку
export function handleLikeClick(cardId, likeButton, likeCount) {
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

// Обработчик события загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  const cardContainer = document.querySelector('.places'); // Контейнер для карточек

  // Обработчик клика по лайку внутри контейнера карточек
  cardContainer.addEventListener('click', (event) => {
    const likeButton = event.target.closest('.card__like-button');
    if (likeButton) {
      const card = likeButton.closest('.card');
      const likeCount = card.querySelector('.card__like-count');
      const currentCount = parseInt(likeCount.textContent, 10);

      // Обновляем количество лайков в зависимости от состояния кнопки
      if (likeButton.classList.contains('card__like-button_is-active')) {
        likeCount.textContent = currentCount - 1;
      } else {
        likeCount.textContent = currentCount + 1;
      }

      // Переключаем состояние кнопки лайка
      likeButton.classList.toggle('card__like-button_is-active');
    }
  });
});

// Функция для удаления карточки
export function deleteCard(event) {
  const cardItem = event.target.closest('.places__item');
  if (cardItem) {
    cardItem.remove();
  }
}