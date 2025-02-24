//api.js
/*
const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-33',
  headers: {
    authorization: '1b4b2558-fdd9-468b-bcf2-a18254476256',
    'Content-Type': 'application/json'
  }
};

// Загрузка информации о пользователе
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    });
};

// Загрузка карточек
export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    })
    .then(data => {
      console.log(data);
      return data;
    });
};

// Обновление профиля
export const updateProfile = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      about: about
    })
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    });
};

// Добавление новой карточки
export const addNewCard = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      link: link
    })
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    });
};

// Функция удаления карточки через API
export const deleteCardApi = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    });
};


// Постановка лайка
export const likeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    });
};

// Снятие лайка
export const unlikeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    });
};

//Отправка запроса на обновление аватара
export const updateAvatar = (avatarUrl) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarUrl
    })
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    });
}; */

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