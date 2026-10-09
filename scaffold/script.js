const cities = [
  "Nagpur",
  "Pune",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Nashik",
  "London",
  "Paris",
  "New York",
  "Dubai",
  "Singapore",
  "Sydney",
  "Melbourne",
  "Toronto",
  "Tokyo",
  "Gadchiroli",
  "Armori",
  "Chandrpur",
  "Gondia",
  "Bhramhpuri",
  "Bhandara",
  "Amravati",
  "Wardha",
  "Chandrapur"
];

const locationInput = document.getElementById("location-input");
const suggestions = document.getElementById("suggestions");
const clearSuggestions = document.getElementById("clear-suggestions");

locationInput.addEventListener("input", function () {
  const value = locationInput.value.trim().toLowerCase();

  suggestions.innerHTML = "";
  clearSuggestions.style.display = "none";

  if (value === "") {
    return;
  }

  const matchedCities = cities.filter(function (city) {
    return city.toLowerCase().startsWith(value);
  });

  if (matchedCities.length > 0) {
    clearSuggestions.style.display = "block";
  }

  matchedCities.forEach(function (city) {
    const suggestion = document.createElement("div");

    suggestion.textContent = city;
    suggestion.className = "suggestion-item";

    suggestion.addEventListener("click", function () {
      locationInput.value = city;
      suggestions.innerHTML = "";
      clearSuggestions.style.display = "none";
    });

    suggestions.appendChild(suggestion);
  });
});

clearSuggestions.addEventListener("click", function () {
  locationInput.value = "";
  suggestions.innerHTML = "";
  clearSuggestions.style.display = "none";
});

document.getElementById("location-form").addEventListener("submit", getWeather);

async function getWeather(e) {
  e.preventDefault();

  const location = document.getElementById("location-input").value.trim();
  const weatherData = document.getElementById("weather-data");

  const apiKey = "0381c7fe360cd5b082c55c72be82a302";

  if (!location) {
    return;
  }

  weatherData.innerHTML = "";

  try {
    // Step 1: Convert city name into latitude and longitude
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)},IN&limit=1&appid=${apiKey}`
    );

    if (!geoResponse.ok) {
      throw new Error("Geocoding failed");
    }

    const geoData = await geoResponse.json();

    if (geoData.length === 0) {
      weatherData.textContent = "Error: City not found";

      setTimeout(function () {
        weatherData.innerHTML = "";
      }, 3000);

      return;
    }

    const latitude = geoData[0].lat;
    const longitude = geoData[0].lon;

    // Step 2: Get weather using latitude and longitude
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      weatherData.textContent = "Error: Failed to fetch weather data";

      setTimeout(function () {
        weatherData.innerHTML = "";
      }, 3000);

      return;
    }

    const data = await response.json();

    weatherData.innerHTML = `
      <h2>${data.name}</h2>
      <p>Temperature: ${data.main.temp} °C</p>
      <p>Weather: ${data.weather[0].description}</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;

  } catch (error) {
    weatherData.textContent = "Error: Failed to fetch weather data";

    setTimeout(function () {
      weatherData.innerHTML = "";
    }, 3000);
  }
}