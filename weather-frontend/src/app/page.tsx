"use client";
import React, { useEffect, useState } from "react";

type WeatherData = {
  name: string;
  weather: { description: string; icon: string }[];
  main: { temp: number; humidity: number };
  wind: { speed: number };
  forecast?: { dt: number; temp: { day: number }; weather: { icon: string }[] }[];
};

function getCurrentDate(): string {
  const now = new Date();
  return now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Home() {
  console.log("Rendering Home");

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState("Nairobi");
  const [unit, setUnit] = useState("metric"); // "metric" for °C, "imperial" for °F

  async function fetchData(cityName: string) {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/weather?city=${cityName}&unit=${unit}`
      );   
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }   

      const data = await res.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }

  useEffect(() => {
    fetchData(city);
  }, [unit]);

  const toggleUnit = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  return (
    <main className="min-h-screen bg-base-200 p-8 text-base-content flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Weather App 🌤️</h1>
      <p className="text-lg mb-6">Get the Latest Weather Updates!</p>

      {/* City Selection */}
      {/* Search Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchData(city);
        }}
        className="flex gap-2 items-center w-full max-w-lg mb-6"
      >
        <input
          type="text"
          placeholder="Enter city name"
          className="input input-bordered w-full"
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="btn btn-primary">Search</button>
        <button
          type="button"
          onClick={toggleUnit}
          className="btn btn-outline ml-2"
        >
          {unit === "metric" ? "°C" : "°F"}
        </button>
      </form>

      {/* Weather Display */}
      {weatherData ? (
        <section className="card w-full max-w-lg bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Current Info */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-5xl font-bold">
                  {weatherData.main.temp}°{unit === "metric" ? "C" : "F"}
                </p>
                <p className="uppercase text-sm text-gray-500">
                  {weatherData.weather[0].description}
                </p>
              </div>
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="w-20 h-20"
              />
            </div>

            {/* Date & Location */}
            <div className="text-sm text-right text-gray-400">
              <p>{getCurrentDate()}</p>
              <p>{weatherData.name}</p>
            </div>

            {/* Forecast Section */}
            {weatherData.forecast && (
              <div className="grid grid-cols-3 gap-2 mt-6">
                {weatherData.forecast.map((day, index) => (
                  <div
                    key={index}
                    className="bg-base-200 rounded-xl p-4 text-center shadow"
                  >
                    <p className="font-semibold">
                      {new Date(day.dt * 1000).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                      })}
                    </p>
                    <img
                      src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt=""
                      className="w-12 mx-auto"
                    />
                    <p>{Math.round(day.temp.day)}°</p>
                  </div>
                ))}
              </div>
            )}

            {/* Wind & Humidity */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-base-200 p-4 rounded-xl shadow">
                <h3 className="text-sm font-bold mb-2">Wind Status</h3>
                <p className="text-lg">{weatherData.wind.speed} km/h</p>
              </div>
              <div className="bg-base-200 p-4 rounded-xl shadow">
                <h3 className="text-sm font-bold mb-2">Humidity</h3>
                <p className="text-lg">{weatherData.main.humidity}%</p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="mt-12">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      )}
    </main>
  );
}
