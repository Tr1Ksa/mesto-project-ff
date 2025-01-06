// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

let cardsTemplate = document.querySelector('#card-template').content;
let cardsList = document.querySelector('.places__list');

function createCard(item, deleteCard) {
  let cardsElement = cardsTemplate.cloneNode(true);
  cardsElement.querySelector('.card__image').src = item.link;
  cardsElement.querySelector('.card__image').setAttribute('alt', item.description);

  const deleteButton = cardsElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', deleteCard);

  return cardsElement;
}


for (let i = 0; i < initialCards.length; i++) {
  cardsList.appendChild(createCard(initialCards[i], function() {
    let cardItem = this.closest('.places__item');
    cardItem.remove();
  }));
}

cardsList.append(cardsElement); 