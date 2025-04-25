# 🌦️ Decoupled Weather Application (Next.js + Laravel)

This is a modern, decoupled weather application built with:

- **Frontend:** Next.js (TypeScript) + Tailwind CSS (RippleUI)
- **Backend:** Laravel 12 API using OpenWeatherMap's API
- **API Integration:** Geocoding + Forecast via OpenWeatherMap

The app allows users to search for a city, toggle between Celsius and Fahrenheit, and view the current weather along with a 3-day forecast.  
![Screenshot 2025-04-25 125729](https://github.com/user-attachments/assets/66a77df2-75bb-4ea5-b90d-60822a8d120a)

---

## 🧱 Project Structure

```plaintext
weather-frontend/   # Next.js + RippleUI frontend
weather-backend/    # Laravel 12 API backend
```

---

## 🧠 High-Level Overview

We're building a full-stack weather application where:

- The **frontend** (`Next.js` + `RippleUI` + `TailwindCSS`) displays a UI to enter a city, toggle temperature units, and show current + forecast weather.
- The **backend** (`Laravel`) serves as an API layer, fetching and formatting weather data using the OpenWeather API.

---

## 🔁 Flow Between the Files

### 🔹 1. `page.tsx` (Next.js)

**Role:** The main page where the user interacts with the app.

It has:
- An input for city name
- A toggle for °C / °F
- Displays current weather and 3-day forecast

**It calls:**

```ts
fetch(`http://127.0.0.1:8000/api/weather?city=${city}&unit=${unit}`)
```

→ This hits the Laravel backend API.

---

### 🔹 2. `WeatherController.php` (Laravel)

**Role:** Handles the backend request from the frontend.

It:
- Extracts the city and unit (°C or °F)
- Fetches coordinates from OpenWeather Geo API
- Fetches current weather and forecast
- Processes + returns formatted weather data

→ Returns a JSON response that `page.tsx` consumes.

---

### 🔹 3. `web.php` (Laravel)

**Role:** Defines routes for the Laravel backend.

It registers:

```php
Route::get('/api/weather', [WeatherController::class, 'getWeather']);
```

→ This is the exact endpoint our frontend is calling.

---

### 🔹 4. `layout.tsx` (Next.js)

**Role:** Defines the HTML wrapper layout for all pages in our app.

- Imports RippleUI via CDN
- Sets global fonts (Geist)
- Ensures every page (like `page.tsx`) has consistent layout/styling

---

### 🔹 5. `globals.css` (TailwindCSS)

**Role:** Defines global styles.

- Uses Tailwind for utility classes
- Sets a dark background color
- Applies the custom font (Geist) globally

---

### 🔹 6. `route.ts` (Next.js API route – optional)

**Role:** An alternative local API endpoint in case you want to fetch weather directly from OpenWeather (without Laravel).

- Can fetch by city name or lat/lon
- Used if you want your frontend to bypass Laravel and hit OpenWeather directly

---

## ⚙️ Backend Development (Laravel 12)

### 🧰 Technologies Used
- Laravel 12 (API-only)
- PHP 8.3+
- Laravel HTTP client (for calling external APIs)
- OpenWeatherMap API (for current weather and 5-day forecast)
- Carbon (for date/time handling)

### 🔧 Functionality
- Accepts `city` and `unit` (metric or imperial) as query parameters
- Uses OpenWeatherMap **Geocoding API** to convert city name to coordinates
- Fetches:
  - **Current weather** using `/weather`
  - **Forecast data** using `/forecast` (3-hour intervals)
- Extracts and formats the 12:00 PM weather for the next 3 days

### 🔌 API Endpoint

```
GET /api/weather?city=Nairobi&unit=metric
```

### ✅ Sample Response

```json
{
  "name": "Nairobi",
  "coord": { "lat": -1.29, "lon": 36.82 },
  "main": { "temp": 24, "humidity": 65 },
  "wind": { "speed": 5.2 },
  "weather": [{ "description": "clear sky", "icon": "01d" }],
  "forecast": [
    {
      "dt": 1714339200,
      "temp": 26,
      "weather": [{ "icon": "02d" }]
    }
  ]
}
```

### 🛠️ Setup Instructions

```bash
cd weather-backend
composer install
cp .env.example .env
php artisan key:generate

# Add your OpenWeatherMap API key to the .env
OPENWEATHER_API_KEY=your_api_key_here

php artisan serve
```

App will run at: `http://127.0.0.1:8000`

---

## 💻 Frontend Development (Next.js + RippleUI)

### 🧰 Technologies Used
- Next.js (App Router + TypeScript)
- Tailwind CSS + RippleUI for modern UI components
- Fetch API for AJAX requests
- Responsive and accessible UI

### 🎯 Functionality
- Users can:
  - Enter a city name and submit
  - Toggle temperature units (°C/°F)
  - View:
    - Current weather (temp, icon, condition)
    - Wind and humidity
    - 3-day forecast cards (showing daily icon and temp)

### 🔌 Integration with Backend

```ts
fetch(`http://127.0.0.1:8000/api/weather?city=Nairobi&unit=metric`)
```

- Parses and renders the response data into the UI

### 🛠️ Setup Instructions

```bash
cd weather-frontend
npm install
npm run dev
```

App will run at: `http://localhost:3000`

---

## 🧪 Key Features

| Feature          | Description                          |
|------------------|--------------------------------------|
| 🔍 Search City    | User inputs any global city          |
| 🌡️ Unit Toggle   | Switch between °C and °F             |
| ☀️ Current Weather | Shows current temperature, icon, and condition |
| 📆 3-Day Forecast | Displays temp + weather icon         |
| 💨 Extras         | Humidity, wind speed, etc.           |
| 🎨 UI             | Stylish with RippleUI + Tailwind     |

---

## 🌐 External APIs

- **Geocoding API:**  
  `http://api.openweathermap.org/geo/1.0/direct`
- **Current Weather:**  
  `https://api.openweathermap.org/data/2.5/weather`
- **Forecast:**  
  `https://api.openweathermap.org/data/2.5/forecast`

---

## 🧹 Troubleshooting

| Problem                             | Solution                                                   |
|-------------------------------------|-------------------------------------------------------------|
| CORS errors                         | Update `config/cors.php` in Laravel to allow `localhost:3000` |
| "NaN" temperatures in forecast      | Ensure `temp` is a number, not an object                   |
| Laravel can't fetch from OpenWeather | Check internet, DNS, or curl access                        |

---

## 📄 License

MIT — Free to use, modify, and extend.

---

## 🙌 Credits

- Built by Kibuku Carole June Wanjiku  
- Powered by [OpenWeatherMap](https://openweathermap.org/)

---
