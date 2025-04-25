"use client";
import React, { useEffect, useState } from "react";

type WeatherData = {
  name: string;
  weather: { description: string; icon: string }[];
  main: { temp: number; humidity: number };
  wind: { speed: number };
  forecast?: { dt: number; temp: number; weather: { icon: string }[] }[];
};

function getCurrentDate(): string {
  const now = new Date();
  return now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState("Nairobi");
  const [unit, setUnit] = useState("metric");

  async function fetchData(cityName: string) {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/weather?city=${cityName}&unit=${unit}`
      );
      if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
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
    <main className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-6xl rounded-3xl backdrop-blur-2xl shadow-2xl p-10">
        {/* Top Section: Search + Toggle */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchData(city);
          }}
          className="flex flex-col sm:flex-row items-center gap-5 mb-10"
        >
          <input
            type="text"
            className="input input-bordered w-full text-white placeholder:text-white/60 backdrop-blur-md"
            placeholder="Enter city"
            onChange={(e) => setCity(e.target.value)}
          />
          <div className="flex gap-2">
            <button className="btn btn-primary" type="submit">
              Search
            </button>
            <button
              type="button"
              onClick={toggleUnit}
              className="btn text-white bg-white/10 backdrop-blur-md hover:bg-white/20"
            >
              {unit === "metric" ? "°C" : "°F"}
            </button>
          </div>
        </form>

        {/* Weather Details Section */}
        {weatherData && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Current Weather Card */}
            <div className="rounded-2xl p-6 text-white shadow-lg backdrop-blur-xl w-full lg:w-1/2">
              <div className="mb-4">
                <p className="text-xl font-semibold">{getCurrentDate()}</p>
                <p className="text-sm opacity-80">{weatherData.name}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <h2 className="text-6xl font-bold">
                    {Math.round(weatherData.main.temp)}°
                    {unit === "metric" ? "C" : "F"}
                  </h2>
                  <p className="capitalize text-lg">{weatherData.weather[0].description}</p>
                </div>
                <img
                  src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt="weather icon"
                  className="w-20 h-20"
                />
              </div>
            </div>

            {/* Weather Extras + Forecast */}
            <div className="rounded-2xl p-6 text-white shadow-lg backdrop-blur-xl w-full lg:w-1/2 space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm opacity-60">PRECIPITATION</p>
                  <p className="text-lg font-semibold">0%</p>
                </div>
                <div>
                  <p className="text-sm opacity-60">HUMIDITY</p>
                  <p className="text-lg font-semibold">{weatherData.main.humidity}%</p>
                </div>
                <div>
                  <p className="text-sm opacity-60">WIND</p>
                  <p className="text-lg font-semibold">{weatherData.wind.speed} km/h</p>
                </div>
              </div>

              <div className="text-center font-semibold pt-4">
                Forecast For The Next 3 Days
              </div>

              {/* Forecast Cards */}
              {weatherData.forecast && (
                <div className="grid grid-cols-3 gap-4">
                  {weatherData.forecast.slice(0, 3).map((day, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center bg-white/10 p-4 rounded-xl text-white backdrop-blur-sm"
                    >
                      <p className="text-sm font-semibold">
                        {new Date(day.dt * 1000).toLocaleDateString("en-GB", {
                          weekday: "short",
                        })}
                      </p>
                      <img
                        src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                        alt="forecast icon"
                        className="w-10"
                      />
                      <p className="text-sm">
                        {typeof day.temp === "number"
                          ? `${Math.round(day.temp)}°`
                          : "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
