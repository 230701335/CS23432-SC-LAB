function getWeather() {
    const city = document.getElementById("city").value;
    const apiKey = 'd3d341d7c0d3496f9bf53300252704'; // Note: Secure this in production
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    // Clear previous results
    document.getElementById("weather-result").innerHTML = "<p>Loading...</p>";
    document.getElementById("extreme-weather-notification").classList.remove("show", "heat", "cold", "storm", "rain");

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('City not found or API error');
            return response.json();
        })
        .then(data => {
            const temperature = data.current.temp_c;
            const weatherDescription = data.current.condition.text;
            const humidity = data.current.humidity;
            const windSpeed = data.current.wind_kph;
            const conditionCode = data.current.condition.code;

            // Set emoji, background, and alerts
            let weatherEmoji = '';
            let backgroundImage = '';
            let extremeWeatherNotification = false;
            let alertMessage = '';
            let alertType = '';

            // Extreme weather checks
            if (temperature > 35) {
                extremeWeatherNotification = true;
                alertMessage = '🔥 Extreme Heat Warning! Avoid prolonged sun exposure.';
                alertType = 'heat';
            }
            else if (temperature < 0) {
                extremeWeatherNotification = true;
                alertMessage = '❄️ Extreme Cold Warning! Risk of frostbite.';
                alertType = 'cold';
            }
            else if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) {
                extremeWeatherNotification = true;
                alertMessage = '⛈️ Severe Storm Warning! Stay indoors.';
                alertType = 'storm';
            }
            else if (weatherDescription.toLowerCase().includes('heavy rain') || conditionCode === 1195) {
                extremeWeatherNotification = true;
                alertMessage = '🌧️ Heavy Rain Warning! Risk of flooding.';
                alertType = 'rain';
            }

            // Set background based on weather
            if (conditionCode === 1000) {
                weatherEmoji = temperature > 15 ? '☀️' : '❄️';
                backgroundImage = temperature > 15
                    ? "url('https://images.unsplash.com/photo-1560258018-c7db7645254e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80')"
                    : "url('https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80')";
            }
            else if (conditionCode === 1003 || conditionCode === 1006) {
                weatherEmoji = '⛅';
                backgroundImage = "url('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80')";
            }
            else if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) {
                weatherEmoji = '⛈️';
                backgroundImage = "url('https://images.unsplash.com/photo-1507339567222-53c5dff3dcc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80')";
            }
            else {
                weatherEmoji = '🌬️';
                backgroundImage = "url('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80')";
            }

            // Update UI
            document.body.style.backgroundImage = backgroundImage;
            document.getElementById("weather-result").innerHTML = `
                <p><strong>Temperature:</strong> ${temperature}°C ${temperature < 10 ? '❄️' : '🌡️'}</p>
                <p><strong>Condition:</strong> ${weatherDescription} ${weatherEmoji}</p>
                <p><strong>Humidity:</strong> ${humidity}% 💧</p>
                <p><strong>Wind Speed:</strong> ${windSpeed} kph 💨</p>
            `;

            // Show alert with timestamp if extreme weather
            const notificationDiv = document.getElementById("extreme-weather-notification");
            if (extremeWeatherNotification) {
                const now = new Date();
                const options = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                };
                const timestamp = now.toLocaleDateString('en-US', options);

                notificationDiv.innerHTML = `
                    <div>${alertMessage}</div>
                    <div class="timestamp">🕒 Issued on ${timestamp}</div>
                `;
                notificationDiv.classList.add("show", alertType);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("weather-result").innerHTML =
                `<p style="color: red;">Error: ${error.message}. Try another city.</p>`;
        });
}