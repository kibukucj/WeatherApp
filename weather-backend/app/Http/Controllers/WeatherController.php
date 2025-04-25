<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Carbon;

class WeatherController extends Controller
{
    /**
     * Handle the request to get current weather and forecast data.
     */
    public function getWeather(Request $request)
    {
        // Get query parameters with default values
        $city = $request->query('city', 'nairobi');
        $unit = $request->query('unit', 'metric');
        $apiKey = env('OPENWEATHER_API_KEY', 'your-default-api-key');

        // Step 1: Get coordinates from city name using OpenWeather Geocoding API
        $geoResponse = Http::get("http://api.openweathermap.org/geo/1.0/direct", [
            'q' => $city,        // City name from request
            'limit' => 1,        // Limit to 1 result
            'appid' => $apiKey,  // API key
        ]);

        $geoData = $geoResponse->json();

        // If the geocoding API fails or returns no data, respond with 404
        if (!$geoResponse->successful() || empty($geoData) || !isset($geoData[0]['lat'])) {
            return response()->json(['error' => 'City not found'], 404);
        }

        // Extract latitude and longitude
        $lat = $geoData[0]['lat'];
        $lon = $geoData[0]['lon'];

        // Step 2: Get current weather data using coordinates
        $currentResponse = Http::get("https://api.openweathermap.org/data/2.5/weather", [
            'lat' => $lat,
            'lon' => $lon,
            'units' => $unit,
            'appid' => $apiKey,
        ]);

        // If current weather API fails, respond with 500
        if (!$currentResponse->successful()) {
            return response()->json(['error' => 'Failed to fetch current weather'], 500);
        }

        $currentData = $currentResponse->json();

        // Step 3: Get 5-day/3-hour forecast using coordinates
        $forecastResponse = Http::get("https://api.openweathermap.org/data/2.5/forecast", [
            'lat' => $lat,
            'lon' => $lon,
            'units' => $unit,
            'appid' => $apiKey,
        ]);

        // If forecast API fails, respond with 500
        if (!$forecastResponse->successful()) {
            return response()->json(['error' => 'Failed to fetch forecast'], 500);
        }

        $forecastData = $forecastResponse->json();

        // Step 4: Extract one forecast for each of the next 3 days at 12:00 PM
        $forecast = [];
        $seenDates = [];

        foreach ($forecastData['list'] as $entry) {
            $dt = Carbon::parse($entry['dt_txt']);     // Parse datetime string
            $date = $dt->format('Y-m-d');              // Extract date

            // Include only one forecast per day, at 12 PM
            if (!in_array($date, $seenDates) && $dt->hour === 12) {
                $forecast[] = [
                    'dt' => $entry['dt'],              // Timestamp
                    'date' => $date,                   // Date string
                    'temp' => round($entry['main']['temp']),  // Rounded temperature
                    'weather' => $entry['weather'],    // Weather details
                ];
                $seenDates[] = $date;
            }

            // Limit to 3 forecast entries
            if (count($forecast) >= 3) {
                break;
            }
        }

        // Step 5: Build and return JSON response
        return response()->json([
            'name' => $city,               // City name
            'coord' => ['lat' => $lat, 'lon' => $lon], // Coordinates
            'main' => [
                'temp' => round($currentData['main']['temp']), // Current temperature
                'humidity' => $currentData['main']['humidity'], // Current humidity
            ],
            'wind' => ['speed' => $currentData['wind']['speed']], // Wind speed
            'weather' => $currentData['weather'],   // Weather description and icon
            'forecast' => $forecast,                // Next 3-day forecast data
        ]);
    }
}
