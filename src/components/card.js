// card.js

import { openModal } from './modal.js';
import { likeCard, unlikeCard } from './api.js';

export function createCard(item, likeHandler, deleteHandler, imageClickHandler, currentUserId) {
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

  cardImage.src = item.link || '';
  cardImage.alt = item.name || '';
  cardTitle.textContent = item.name || 'Без названия';

  likeCount.textContent = item.likes ? item.likes.length : 0;

  const isLiked = item.likes && item.likes.some(like => like._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  } else {
    likeButton.classList.remove('card__like-button_is-active');
  }

  cardElement.dataset.cardId = item._id || '';

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
    deleteButton.remove();
  }

  likeButton.addEventListener('click', () => likeHandler(item._id, likeButton, likeCount));
  cardImage.addEventListener('click', imageClickHandler);

  return cardElement;
}

export function handleLikeClick(cardId, likeButton, likeCount) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  if (isLiked) {
    unlikeCard(cardId)
      .then((updatedCard) => {
        likeButton.classList.remove('card__like-button_is-active');
        likeCount.textContent = updatedCard.likes.length;
      })
      .catch((err) => {
        console.error('Ошибка при снятии лайка:', err);
      });
  } else {
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

document.addEventListener('DOMContentLoaded', () => {
  const cardContainer = document.querySelector('.places'); // Контейнер для карточек

  cardContainer.addEventListener('click', (event) => {
    const likeButton = event.target.closest('.card__like-button');
    if (likeButton) {
      const card = likeButton.closest('.card');
      const likeCount = card.querySelector('.card__like-count');
      const currentCount = parseInt(likeCount.textContent, 10);

      if (likeButton.classList.contains('card__like-button_is-active')) {
        likeCount.textContent = currentCount - 1;
      } else {
        likeCount.textContent = currentCount + 1;
      }

      likeButton.classList.toggle('card__like-button_is-active');
    }
  });
});

export function deleteCard(event) {
  const cardItem = event.target.closest('.places__item');
  if (cardItem) {
    cardItem.remove();
  }
}