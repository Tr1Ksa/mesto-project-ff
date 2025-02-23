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
export function createCard(item, likeHandler, deleteHandler, imageClickHandler, currentUserId, openModal) {
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
      deleteHandler(item._id, openModal, cardElement);
    });
  } else {
    deleteButton.remove();
  }
  console.log('Карточка:', item);
console.log('Владелец:', item.owner ? item.owner._id : 'Нет владельца');
console.log('Текущий пользователь:', currentUserId);
//====================================================================
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
/* export function deleteCard(cardId, openModal) {
  const confirmDeletePopup = document.querySelector('.popup_type_confirm-delete');
  if (confirmDeletePopup) {
    // Открываем модальное окно и передаем ID карточки
    openModal(confirmDeletePopup);
    confirmDeletePopup.dataset.cardId = cardId;
  } else {
    console.error('Модальное окно подтверждения удаления не найдено');
  }
} */

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


/* export function deleteCard(cardId, cardElement, openModal) {
    const confirmDeletePopup = document.querySelector('.popup_type_confirm-delete');

    if (confirmDeletePopup) {
        // Открываем модальное окно
        openModal(confirmDeletePopup);
        
        // Передаём ID карточки в dataset модального окна
        confirmDeletePopup.dataset.cardId = cardId;

        // Находим кнопку подтверждения удаления
        const confirmButton = confirmDeletePopup.querySelector('.popup__button-confirm');

        // Удаляем предыдущий обработчик, чтобы избежать дублирования
        confirmButton.replaceWith(confirmButton.cloneNode(true));
        const newConfirmButton = confirmDeletePopup.querySelector('.popup__button-confirm');

        // Добавляем обработчик клика на новую кнопку
        newConfirmButton.addEventListener('click', () => {
          console.log('Удаляем карточку с ID:', cardId);
            fetch(`https://nomoreparties.co/v1/wff-cohort-33/cards/${cardId}`, {
                method: 'DELETE',
                headers: {
                    authorization: '1b4b2558-fdd9-468b-bcf2-a18254476256'
                }
            })
            .then(res => {
                if (!res.ok) {
                  return res.json().catch(() => Promise.reject(new Error('Ошибка парсинга JSON')));
                }
                return res.json();
            })
            .then(() => {
              fetch('https://nomoreparties.co/v1/wff-cohort-33/users/me', {
                method: 'GET',
                headers: {
                  authorization: '1b4b2558-fdd9-468b-bcf2-a18254476256'
                }
              })
                console.log('Карточка успешно удалена с сервера:', cardId);
                
                // Удаляем карточку из DOM
                if (cardElement) {
                  console.log('currentUserId:', currentUserId);
console.log('Владелец карточки:', item.owner._id);
                    cardElement.remove();
                    console.log('Карточка удалена из DOM');
                }

                // Закрываем модальное окно
                confirmDeletePopup.classList.remove('popup_opened');
            })
            .catch(err => {
                console.error('Ошибка при удалении карточки:', err);
            });
        });
    } else {
        console.error('Модальное окно подтверждения удаления не найдено');
    }
} */