/**
 * Конфигурация приложения
 * @constant {Object} config - Основные настройки приложения
 */
const config = {
    apiKey: "2467e45594a2085cd6fbcdb081b93c5f",
    baseUrl: "http://ws.audioscrobbler.com/2.0/",
    defaultImage: "f.jpg"
};

/**
 * Утилиты для работы с API и данными
 * @constant {Object} utils - Набор вспомогательных функций
 */
const utils = {
    /**
     * Получает параметр поиска из URL
     * @returns {string|null} Значение параметра 'q' из URL или null
     */
    getSearchParam: () => new URLSearchParams(window.location.search).get('q'),
    
    /**
     * Создает URL для запроса к API
     * @param {string} method - Метод API
     * @param {string} query - Поисковый запрос
     * @returns {string} Сформированный URL
     */
    createApiUrl: (method, query) => 
        `${config.baseUrl}?method=${method}&${method.split('.')[0]}=${encodeURIComponent(query)}&api_key=${config.apiKey}&format=json`,
    
    /**
     * Обрабатывает ответ от API
     * @param {string} url - URL для запроса
     * @returns {Promise<Object|null>} Данные ответа или null в случае ошибки
     */
    handleApiResponse: async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Ошибка API:", error);
            return null;
        }
    }
};

/**
 * Сервис для работы с поиском
 * @constant {Object} searchService - Методы для поиска контента
 */
const searchService = {
    /**
     * Поиск артистов
     * @param {string} term - Поисковый запрос
     * @returns {Promise<Array>} Массив найденных артистов
     */
    async searchArtists(term) {
        const data = await utils.handleApiResponse(utils.createApiUrl('artist.search', term));
        return data?.results?.artistmatches?.artist || [];
    },

    /**
     * Поиск альбомов
     * @param {string} term - Поисковый запрос
     * @returns {Promise<Array>} Массив найденных альбомов
     */
    async searchAlbums(term) {
        const data = await utils.handleApiResponse(utils.createApiUrl('album.search', term));
        return data?.results?.albummatches?.album || [];
    },

    /**
     * Поиск треков
     * @param {string} term - Поисковый запрос
     * @returns {Promise<Array>} Массив найденных треков
     */
    async searchTracks(term) {
        const data = await utils.handleApiResponse(utils.createApiUrl('track.search', term));
        return data?.results?.trackmatches?.track || [];
    }
};

/**
 * Функции для отображения результатов поиска
 */
function displayArtists(artists) {
    const artistListElement = document.querySelector(".artist-list");
    artistListElement.innerHTML = "";

    if (artists.length === 0) {
        artistListElement.textContent = "Нет результатов.";
        return;
    }

    artists.forEach(artist => {
        const artistItem = document.createElement("div");
        artistItem.classList.add("artist-item");

        const artistImage = document.createElement("img");
        const imageUrl = artist.image[0]?.['#text'] || config.defaultImage;
        artistImage.src = imageUrl;

        const artistInfo = document.createElement("div");
        artistInfo.classList.add("artist-info");

        const artistName = document.createElement("h4");
        artistName.textContent = artist.name;

        const listeners = document.createElement("p");
        listeners.textContent = `${artist.listeners} listeners`;

        artistInfo.appendChild(artistName);
        artistInfo.appendChild(listeners);

        artistItem.appendChild(artistImage);
        artistItem.appendChild(artistInfo);

        artistListElement.appendChild(artistItem);
    });
}

function displayAlbums(albums) {
    const albumListElement = document.querySelector(".album-list");
    albumListElement.innerHTML = "";

    if (albums.length === 0) {
        albumListElement.textContent = "Нет результатов.";
        return;
    }

    albums.forEach(album => {
        const albumItem = document.createElement("div");
        albumItem.classList.add("album-item");

        const albumImage = document.createElement("img");
        const imageUrl = album.image[1]?.['#text'] || config.defaultImage;
        albumImage.src = imageUrl;

        const albumInfo = document.createElement("div");
        albumInfo.classList.add("album-info");

        const albumName = document.createElement("h4");
        albumName.textContent = album.name;

        const artistName = document.createElement("p");
        artistName.textContent = album.artist;

        albumInfo.appendChild(albumName);
        albumInfo.appendChild(artistName);

        albumItem.appendChild(albumImage);
        albumItem.appendChild(albumInfo);

        albumListElement.appendChild(albumItem);
    });
}

function displayTracks(tracks) {
    const trackListElement = document.querySelector(".track-list");
    trackListElement.innerHTML = "";

    if (tracks.length === 0) {
        trackListElement.textContent = "Нет результатов.";
        return;
    }

    tracks.forEach(track => {
        const trackItem = document.createElement("div");
        trackItem.classList.add("track-item");

        const trackImage = document.createElement("img");
        const imageUrl = track.image[0]?.['#text'] || config.defaultImage;
        trackImage.src = imageUrl;

        const trackInfo = document.createElement("div");
        trackInfo.classList.add("track-info");

        const trackName = document.createElement("h4");
        trackName.textContent = track.name;

        const artistName = document.createElement("p");
        artistName.textContent = track.artist;

        trackInfo.appendChild(trackName);
        trackInfo.appendChild(artistName);

        trackItem.appendChild(trackImage);
        trackItem.appendChild(trackInfo);

        trackListElement.appendChild(trackItem);
    });
}

/**
 * Основной класс приложения
 * @constant {Object} searchApp - Основная логика приложения
 */
const searchApp = {
    /**
     * Выполняет поиск и отображает результаты
     * @param {string} term - Поисковый запрос
     */
    async performSearch(term) {
        document.querySelector(".search-results h2").textContent = `Результаты поиска для "${term}"`;
        
        const [artists, albums, tracks] = await Promise.all([
            searchService.searchArtists(term),
            searchService.searchAlbums(term),
            searchService.searchTracks(term)
        ]);

        displayArtists(artists);
        displayAlbums(albums);
        displayTracks(tracks);
    },

    /**
     * Инициализирует приложение
     */
    init() {
        const searchForm = document.getElementById('search-form');
        const searchInput = document.getElementById('search-input');

        if (searchForm && searchInput) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const term = searchInput.value;
                if (term) {
                    window.location.href = `search.html?q=${encodeURIComponent(term)}`;
                }
            });
        }

        const searchTerm = utils.getSearchParam();
        if (searchTerm) {
            this.performSearch(searchTerm);
        }
    }
};

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => searchApp.init());