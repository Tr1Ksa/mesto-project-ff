// Функция создания карточки
export function createCard(item, likeHandler, deleteHandler, imageClickHandler) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  cardImage.src = item.link;
  cardImage.alt = item.description;

  const cardTitle = cardElement.querySelector('.card__title');
  cardTitle.textContent = item.name;

  const deleteButton = cardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', deleteHandler);

  const likeButton = cardElement.querySelector('.card__like-button');
  likeButton.addEventListener('click', likeHandler);

  cardImage.addEventListener('click', imageClickHandler);

  return cardElement;
}

// Функция обработки лайка
export function handleLikeClick(event) {
  const likeButton = event.target;
  likeButton.classList.toggle('card__like-button_is-active');
}

// Функция удаления карточки
export function deleteCard(event) {
  const cardItem = event.target.closest('.places__item');
  if (cardItem) {
    cardItem.remove();
  }
}