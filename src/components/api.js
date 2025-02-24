//api.js

const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-33',
  headers: {
    authorization: '1b4b2558-fdd9-468b-bcf2-a18254476256',
    'Content-Type': 'application/json'
  }
};

// Универсальная функция для выполнения запросов
const makeRequest = (url, method = 'GET', body = null) => {
  const options = {
    method,
    headers: config.headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(`${config.baseUrl}${url}`, options)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    });
};

// Загрузка информации о пользователе
export const getUserInfo = () => {
  return makeRequest('/users/me');
};

// Загрузка карточек
export const getInitialCards = () => {
  return makeRequest('/cards')
    .then(data => {
      console.log(data);
      return data;
    });
};

// Обновление профиля
export const updateProfile = (name, about) => {
  return makeRequest('/users/me', 'PATCH', { name, about });
};

// Добавление новой карточки
export const addNewCard = (name, link) => {
  return makeRequest('/cards', 'POST', { name, link });
};

// Функция удаления карточки через API
export const deleteCardApi = (cardId) => {
  return makeRequest(`/cards/${cardId}`, 'DELETE');
};

// Постановка лайка
export const likeCard = (cardId) => {
  return makeRequest(`/cards/likes/${cardId}`, 'PUT');
};

// Снятие лайка
export const unlikeCard = (cardId) => {
  return makeRequest(`/cards/likes/${cardId}`, 'DELETE');
};

// Отправка запроса на обновление аватара
export const updateAvatar = (avatarUrl) => {
  return makeRequest('/users/me/avatar', 'PATCH', { avatar: avatarUrl });
};