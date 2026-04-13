const apiKey = "4dcfb90c03f8759ea05c55a6a0ec0f62";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") {
    weatherResult.innerHTML = "<p>Masukkan nama kota dulu.</p>";
    return;
  }
  fetchWeather(city);
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

async function fetchWeather(city) {
  localStorage.setItem("lastCity", city);

  weatherResult.innerHTML = `<div class ="loading">Loading...</div>`;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Kota tidak ditemukan.");
    }

    const data = await response.json();

    displayWeather(data);
    cityInput.value= "";
  } catch (error) {
      if (error.message === "Kota tidak ditemukan.") {
        weatherResult.innerHTML = `<p> Kota tidak ditemukan.</p>`;
      } else {
        weatherResult.innerHTML = `<p>Gagal mengambil data. Periksa koneksi internet.</p>`;
      }
  }
}

function updateBackground(condition) {
  const body = document.body;

  if (condition.includes("clear")) {
    body.style.background = "linear-gradient(135deg, #56ccf2, #2f80ed)";
  } 
  else if (condition.includes("rain")) {
    body.style.background = "linear-gradient(135deg, #4b6cb7, #182848)";
  } 
  else if (condition.includes("cloud")) {
    body.style.background = "linear-gradient(135deg, #757f9a, #d7dde8)";
  } 
  else {
    body.style.background = "linear-gradient(135deg, #1e3a8a, #4f46e5)";
  }
}

function displayWeather(data) {

    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const wind = data.wind.speed;

    let description = data.weather[0].description;
    description = description.charAt(0).toUpperCase() + description.slice(1);

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const condition = data.weather[0].main.toLowerCase();
    updateBackground(condition);

    weatherResult.innerHTML = `
    <div>
    <h2>${data.name}</h2>
    <img src="${iconUrl}" alt="weather icon">
    <h1>${temp}°C</h1>
    <p>${description}</p>
    <hr>
    <p>Feels like: ${feelsLike}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind: ${wind} m/s</p>
    </div>
    `;
}

const savedCity = localStorage.getItem("lastCity");
if(savedCity) {
  fetchWeather(savedCity);
}