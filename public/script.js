/**
 * @file script.js Главный файл скрипта, содержащий логику для получения и отображения популярных треков и артистов
 */

// Конфигурация API
const API_CONFIG = {
  baseUrl: 'http://ws.audioscrobbler.com/2.0/',
  apiKey: '2467e45594a2085cd6fbcdb081b93c5f',
  format: 'json'
};

// Эндпоинты API
const ENDPOINTS = {
  tracks: 'chart.getTopTracks',
  artists: 'chart.gettopartists'
};

/**
 * Вспомогательная функция для выполнения запросов к API
 * @async
 * @param {string} endpoint - Эндпоинт API для запроса
 * @returns {Promise<object|null>} Данные ответа или null в случае ошибки
 */
const fetchFromAPI = async (endpoint) => {
  const url = `${API_CONFIG.baseUrl}?method=${endpoint}&api_key=${API_CONFIG.apiKey}&format=${API_CONFIG.format}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Ошибка запроса к API: ${error.message}`);
    return null;
  }
};

/**
 * Получает список популярных треков
 * @async
 * @returns {Promise<Array>} Массив треков или пустой массив в случае ошибки
 */
const getPopularTracks = async () => {
  const data = await fetchFromAPI(ENDPOINTS.tracks);
  return data?.tracks?.track || [];
};

/**
 * Получает список популярных артистов
 * @async
 * @returns {Promise<Array>} Массив артистов или пустой массив в случае ошибки
 */
const getPopularArtists = async () => {
  const data = await fetchFromAPI(ENDPOINTS.artists);
  return data?.artists?.artist || [];
};

/**
 * Создает HTML элемент с заданными параметрами
 * @param {string} tag - HTML тег элемента
 * @param {string} [className] - CSS класс элемента
 * @param {string} [text] - Текстовое содержимое элемента
 * @returns {HTMLElement} Созданный HTML элемент
 */
const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (text) element.textContent = text;
  return element;
};

/**
 * Отображает список треков на странице
 * @param {Array} tracks - Массив объектов треков
 */
const displayTracks = (tracks) => {
  const container = document.querySelector('.track-list');
  if (!container) return;

  container.innerHTML = tracks.length ? '' : 'Нет популярных треков.';

  tracks.forEach(track => {
    const trackItem = createElement('div', 'track-item');
    const trackInfo = createElement('div', 'track-info');
    
    const elements = {
      image: createElement('img'),
      name: createElement('h3', null, track.name),
      artist: createElement('p', null, `Исполнитель: ${track.artist.name}`),
      listeners: createElement('p', null, `Слушателей: ${track.listeners}`)
    };

    elements.image.src = track.image[0]?.['#text'] || 'f.jpg';
    
    trackInfo.append(elements.name, elements.artist, elements.listeners);
    trackItem.append(elements.image, trackInfo);
    container.appendChild(trackItem);
  });
};

/**
 * Отображает список артистов на странице
 * @param {Array} artists - Массив объектов артистов
 */
const displayArtists = (artists) => {
  const container = document.querySelector('.artists-grid');
  if (!container) return;

  container.innerHTML = artists.length ? '' : 'Нет популярных артистов.';

  artists.forEach(artist => {
    const card = createElement('div', 'artist-card');
    
    const elements = {
      image: createElement('img'),
      name: createElement('h3', null, artist.name),
      listeners: createElement('p', null, `Слушателей: ${artist.listeners}`)
    };

    elements.image.src = artist.image[0]?.['#text'] || 'f.jpg';
    
    card.append(elements.image, elements.name, elements.listeners);
    container.appendChild(card);
  });
};

/**
 * Настраивает функциональность поиска
 */
const setupSearch = () => {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');

  if (!form || !input) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchTerm = input.value.trim();
    if (searchTerm) {
      window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
    }
  });
};

/**
 * Инициализирует приложение
 * @async
 */
const init = async () => {
  const [tracks, artists] = await Promise.all([
    getPopularTracks(),
    getPopularArtists()
  ]);
  
  displayTracks(tracks);
  displayArtists(artists);
};

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
  setupSearch();
  init();
});