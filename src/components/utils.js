//utils.js

// Функция для изменения состояния кнопки
export function toggleButtonLoadingState(button, isLoading, defaultText, loadingText = 'Сохранение...') {
  if (isLoading) {
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = defaultText;
    button.disabled = false;
  }
}