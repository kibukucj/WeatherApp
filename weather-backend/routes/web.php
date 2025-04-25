<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeatherController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| These routes handle incoming requests for the web interface and API.
| The "/" route returns the welcome view.
| The "/api/weather" route invokes the WeatherController to fetch weather data.
|
*/

// Route for the homepage – returns a default welcome view
Route::get('/', function () {
    return view('welcome');
});

// API Route to fetch weather data by city or coordinates
// Handled by the getWeather method in WeatherController
Route::get('/api/weather', [WeatherController::class, 'getWeather']);
