// Функция открытия модального окна
export function openModal(popup) {
  popup.classList.add('popup_is-opened');
  popup.classList.remove('popup_is-animated');

  // Добавляем обработчик закрытия по Esc
  document.addEventListener('keydown', handleEscape);
}

// Функция закрытия модального окна
export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  popup.classList.add('popup_is-animated');

  // Убираем обработчик закрытия по Esc
  document.removeEventListener('keydown', handleEscape);
}

// Обработчик закрытия по Esc
function handleEscape(event) {
  if (event.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}
