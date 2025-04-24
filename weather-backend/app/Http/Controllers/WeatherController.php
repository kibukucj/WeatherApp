<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    public function getWeather(Request $request)
{
    $city = $request->query('city', 'nairobi');
    $unit = $request->query('unit', 'metric');
    $apiKey = env('OPENWEATHER_API_KEY', 'cca7e48184d667dcb1b8ce072bf5e369');

    // Step 1: Geocoding
    $geoResponse = Http::get("http://api.openweathermap.org/geo/1.0/direct", [
        'q' => $city,
        'limit' => 1,
        'appid' => $apiKey,
    ]);

    $geoData = $geoResponse->json(); //decode first

    if (!$geoResponse->successful() || empty($geoData) || !isset($geoData[0]['lat'])) {
        return response()->json(['error' => 'City not found'], 404);
    }

    $lat = $geoData[0]['lat'];
    $lon = $geoData[0]['lon'];

    // Step 2: Weather data
    $weatherResponse = Http::get("https://api.openweathermap.org/data/2.5/onecall", [
        'lat' => $lat,
        'lon' => $lon,
        'exclude' => 'minutely,hourly,alerts',
        'units' => $unit,
        'appid' => $apiKey,
    ]);

    if (!$weatherResponse->successful()) {
        return response()->json(['error' => 'Failed to fetch weather data'], 500);
    }

    $data = $weatherResponse->json();

    // Step 3: Format & return
    return response()->json([
        'name' => $city,
        'main' => [
            'temp' => round($data['current']['temp']),
            'humidity' => $data['current']['humidity'],
        ],
        'weather' => $data['current']['weather'],
        'wind' => ['speed' => $data['current']['wind_speed']],
        'forecast' => array_map(function ($day) {
            return [
                'dt' => $day['dt'],
                'temp' => ['day' => $day['temp']['day']],
                'weather' => $day['weather'],
            ];
        }, array_slice($data['daily'], 1, 3)), // next 3 days
    ]);
}

}
