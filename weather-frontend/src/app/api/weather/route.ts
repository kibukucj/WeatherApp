import { NextRequest, NextResponse} from "next/server";

export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");
    
  
  let url = "";
  if(address) {
    url = "https://api.openweathermap.org/data/2.5/weather?q=" 
    + address + 
    "&appid=" + 
    "cca7e48184d667dcb1b8ce072bf5e369";
} else { 
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=cca7e48184d667dcb1b8ce072bf5e369`;
}
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json({ data });
}
