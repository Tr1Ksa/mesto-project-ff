/* Модальные окна */


// Получаем элемент попапа

document.querySelector('.popap').addEventListener('click', openPopup);
document.querySelector('popup__close').addEventListener('click', closePopup);

// Функция открытия попапа
function openPopup() {
  document.querySelector('.popup').classList.add('is-active');
}

// Функция закрытия попапа
function closePopup() {
  document.querySelector('.popup__close').classList.remove('is-active');
}



/*
export function openModal() {
  
};

export function closeModal() {
  
};
*/