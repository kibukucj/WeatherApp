import { NextRequest, NextResponse } from "next/server";

// Handle GET request to the API route
export async function GET(request: any) {
  // Extract query parameters from the request URL
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");     // e.g., city name
  const latitude = searchParams.get("latitude");   // e.g., device lat
  const longitude = searchParams.get("longitude"); // e.g., device lon

  let url = "";

  // If "address" (city name) is provided, use it to form the API URL
  if (address) {
    url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      address +
      "&appid=" +
      "cca7e48184d667dcb1b8ce072bf5e369"; // Your API key here
  } else {
    // Otherwise, use coordinates to form the API URL
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=cca7e48184d667dcb1b8ce072bf5e369`;
  }

  // Fetch weather data from OpenWeather API
  const res = await fetch(url);
  const data = await res.json();

  // Return the JSON response containing weather data
  return NextResponse.json({ data });
}
