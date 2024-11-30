const API_KEY = 'f2f5447c5c2eb1aec9607a6620f4b83a'; // OpenWeatherMap API key
let currentWeatherData = null;

async function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (!city) return alert('Please enter a city name');

    document.getElementById('currentWeather').classList.add('hidden');
    document.getElementById('weatherLoading').classList.remove('hidden');
    document.getElementById('clothingLoading').classList.remove('hidden');

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (data.cod !== 200) throw new Error(data.message);

        currentWeatherData = data;
        updateWeatherUI(data);
        generateClothingSuggestions(data);
        generateTravelChecklist(data);
    } catch (error) {
        alert('Error fetching weather data: ' + error.message);
    } finally {
        document.getElementById('weatherLoading').classList.add('hidden');
        document.getElementById('clothingLoading').classList.add('hidden');
        document.getElementById('currentWeather').classList.remove('hidden');
    }
}

function updateWeatherUI(data) {
    document.querySelector('.location').textContent = `${data.name}, ${data.sys.country}`;
    document.querySelector('.temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector('.weather-desc').textContent = data.weather[0].description;
    document.querySelector('.humidity').textContent = `${data.main.humidity}%`;
    document.querySelector('.wind').textContent = `${data.wind.speed} m/s`;
    document.querySelector('.feels-like').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.querySelector('.pressure').textContent = `${data.main.pressure} hPa`;

    const weatherIcon = document.querySelector('.weather-icon');
    weatherIcon.className = 'weather-icon text-5xl bi';
    switch (data.weather[0].main.toLowerCase()) {
        case 'clear': weatherIcon.classList.add('bi-sun'); break;
        case 'clouds': weatherIcon.classList.add('bi-cloud'); break;
        case 'rain': weatherIcon.classList.add('bi-cloud-rain'); break;
        case 'snow': weatherIcon.classList.add('bi-snow'); break;
        default: weatherIcon.classList.add('bi-cloud');
    }
}

function generateClothingSuggestions(data) {
    const temp = data.main.temp;
    const weather = data.weather[0].main.toLowerCase();
    const suggestions = document.getElementById('clothingSuggestions');
    suggestions.innerHTML = '';

    const addSuggestion = (icon, text) => {
        suggestions.innerHTML += `
            <div class="flex items-center gap-3">
                <i class="bi ${icon} text-2xl text-[#004cff]"></i>
                <p>${text}</p>
            </div>
        `;
    };

    if (temp < 10) {
        addSuggestion('bi-thermometer-low', 'Wear a warm jacket, scarf, and gloves');
    } else if (temp < 20) {
        addSuggestion('bi-thermometer', 'Light jacket or sweater recommended');
    } else {
        addSuggestion('bi-thermometer-high', 'Light, breathable clothing');
    }

    if (weather === 'rain') {
        addSuggestion('bi-umbrella', 'Carry an umbrella or raincoat');
    }
    if (data.wind.speed > 5) {
        addSuggestion('bi-wind', 'Consider a windbreaker');
    }
}

function generateTravelChecklist(data) {
    const duration = document.getElementById('durationInput').value;
    const checklist = document.getElementById('travelChecklist');
    checklist.innerHTML = '';

    const items = [];
    items.push('Water bottle');
    items.push('Phone and charger');

    if (data.main.temp < 10) items.push('Warm jacket');
    if (data.weather[0].main.toLowerCase() === 'rain') items.push('Umbrella');
    if (data.main.temp > 25) items.push('Sunscreen');
    if (duration > 4) items.push('Snacks');

    checklist.innerHTML = items.map(item => `
        <div class="flex items-center gap-2">
            <input type="checkbox" class="w-5 h-5" />
            <span>${item}</span>
        </div>
    `).join('');
}
