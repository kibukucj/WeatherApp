<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Carbon;

class WeatherController extends Controller
{
    public function getWeather(Request $request)
    {
        $city = $request->query('city', 'nairobi');
        $unit = $request->query('unit', 'metric');
        $apiKey = env('OPENWEATHER_API_KEY', 'your-default-api-key');

        // Step 1: Get coordinates from city
        $geoResponse = Http::get("http://api.openweathermap.org/geo/1.0/direct", [
            'q' => $city,
            'limit' => 1,
            'appid' => $apiKey,
        ]);

        $geoData = $geoResponse->json();

        if (!$geoResponse->successful() || empty($geoData) || !isset($geoData[0]['lat'])) {
            return response()->json(['error' => 'City not found'], 404);
        }

        $lat = $geoData[0]['lat'];
        $lon = $geoData[0]['lon'];

        // Step 2: Get current weather
        $currentResponse = Http::get("https://api.openweathermap.org/data/2.5/weather", [
            'lat' => $lat,
            'lon' => $lon,
            'units' => $unit,
            'appid' => $apiKey,
        ]);

        if (!$currentResponse->successful()) {
            return response()->json(['error' => 'Failed to fetch current weather'], 500);
        }

        $currentData = $currentResponse->json();

        // Step 3: Get forecast (3-hour intervals for 5 days)
        $forecastResponse = Http::get("https://api.openweathermap.org/data/2.5/forecast", [
            'lat' => $lat,
            'lon' => $lon,
            'units' => $unit,
            'appid' => $apiKey,
        ]);

        if (!$forecastResponse->successful()) {
            return response()->json(['error' => 'Failed to fetch forecast'], 500);
        }

        $forecastData = $forecastResponse->json();

        // Step 4: Extract next 3 days' 12:00 PM forecasts
        $forecast = [];
        $seenDates = [];

        foreach ($forecastData['list'] as $entry) {
            $dt = Carbon::parse($entry['dt_txt']);
            $date = $dt->format('Y-m-d');

            if (!in_array($date, $seenDates) && $dt->hour === 12) {
                $forecast[] = [
                    'dt' => $entry['dt'],
                    'date' => $date,
                    'temp' => round($entry['main']['temp']),
                    'weather' => $entry['weather'],
                ];
                $seenDates[] = $date;
            }

            if (count($forecast) >= 3) {
                break;
            }
        }

        // Step 5: Return JSON response
        return response()->json([
            'name' => $city,
            'coord' => ['lat' => $lat, 'lon' => $lon],
            'main' => [
                'temp' => round($currentData['main']['temp']),
                'humidity' => $currentData['main']['humidity'],
            ],
            'wind' => ['speed' => $currentData['wind']['speed']],
            'weather' => $currentData['weather'],
            'forecast' => $forecast,
        ]);
    }
}
