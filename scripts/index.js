// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const cardsTemplate = document.querySelector('#card-template').content;
const cardsList = document.querySelector('.places__list'); 
 
function deleteCard(event) { 
  const cardItem = event.target.closest('.places__item'); 
  if (cardItem) { 
    cardItem.remove(); 
  } 
} 
 
function createCard(item) { 
  const cardsElement = cardsTemplate.querySelector('.places__item').cloneNode(true);

  const cardImage = cardsElement.querySelector('.card__image') 
  cardImage.src = item.link; 
  cardImage.alt = item.description; 

  const cardTitle =  cardsElement.querySelector('.card__title');
  cardTitle.textContent = item.name; 
 
  const deleteButton = cardsElement.querySelector('.card__delete-button'); 
  deleteButton.addEventListener('click', deleteCard); 
 
  return cardsElement; 
} 

initialCards.forEach(item => { 
  const cardElement = createCard(item); 
  cardsList.appendChild(cardElement); 
});