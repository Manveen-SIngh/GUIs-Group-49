import axios from "axios";

// ─── Background Asset Imports ─────────────────────────────────────────────────
import sunnyBg from '../assets/backgrounds/weather-sunny.svg';
import nightBg from '../assets/backgrounds/weather-night.svg';
import cloudyBg from '../assets/backgrounds/weather-cloudy.svg';
import cloudyNightBg from '../assets/backgrounds/weather-cloudyNight.svg';
import partlyCloudyBg from '../assets/backgrounds/weather-partly-cloudy.svg';
import partlyCloudyNightBg from '../assets/backgrounds/weather-partyCloudyNight.svg';
import stormyBg from '../assets/backgrounds/weather-stormy.svg';
import stormyNightBg from '../assets/backgrounds/weather-stormyNight.svg';
import windyBg from '../assets/backgrounds/weather-windy.svg';
import windyNightBg from '../assets/backgrounds/weather-windyNight.svg';

const apiKey = process.env.REACT_APP_OPENWEATHER_KEY;

export const geocodeCity = async (city) => {
  const res = await axios.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
  );
  if (!res.data.length) throw new Error(`City "${city}" not found.`);
  const { lat, lon, name } = res.data[0];
  return { lat, lon, name };
};

export const fetchOneCall = async (lat, lon) => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );
  return res.data;
};

// ─── Unit Conversion Logic ────────────────────────────────────────────────────

// Get saved preferences, or use defaults
const getUnitSettings = () => {
  const saved = localStorage.getItem("unitSettings");
  return saved ? JSON.parse(saved) : {
    Temperature: "Celsius (C)",
    "Wind Speed": "Kilometers per hour (km/h)",
    Precipitation: "Millimeters (mm)",
    Distance: "Kilometers (km)",
  };
};

// Converters (Base from API is Celsius, m/s, mm, and meters)
const convertTemp = (celsius, setting) => {
  if (setting === "Fahrenheit (F)") return (celsius * 9/5) + 32;
  if (setting === "Kelvin (K)") return celsius + 273.15;
  return celsius;
};

const convertWind = (ms, setting) => {
  if (setting === "Miles per hour (mph)") return ms * 2.237;
  if (setting === "Meters per second (m/s)") return ms;
  if (setting === "Knots (kn)") return ms * 1.94384;
  return ms * 3.6; // Default to km/h
};

const convertDist = (m, setting) => {
  if (setting === "Miles (mi)") return m / 1609.34;
  if (setting === "Meters (m)") return m;
  return m / 1000; // Default to km
};

// UI Label Helpers
const getUnitLabels = (settings) => ({
  temp: settings.Temperature === "Fahrenheit (F)" ? "°F" : settings.Temperature === "Kelvin (K)" ? "K" : "°C",
  wind: settings["Wind Speed"] === "Miles per hour (mph)" ? "mph" : settings["Wind Speed"] === "Meters per second (m/s)" ? "m/s" : settings["Wind Speed"] === "Knots (kn)" ? "kn" : "km/h",
  dist: settings.Distance === "Miles (mi)" ? "mi" : settings.Distance === "Meters (m)" ? "m" : "km",
  precip: settings.Precipitation === "Inches (in)" ? "in" : settings.Precipitation === "Centimeters (cm)" ? "cm" : "mm"
});

// ─── Utility ──────────────────────────────────────────────────────────────────

export const uvLabel = (uvi) => {
  if (uvi < 3)  return "Low";
  if (uvi < 6)  return "Moderate";
  if (uvi < 8)  return "High";
  if (uvi < 11) return "Very High";
  return "Extreme";
};

const localDateKey = (dt, tz) => {
  const d = new Date((dt + tz) * 1000);
  return [d.getUTCFullYear(), String(d.getUTCMonth() + 1).padStart(2, "0"), String(d.getUTCDate()).padStart(2, "0")].join("-");
};

const localTimeStr = (dt, tz) => {
  const d = new Date((dt + tz) * 1000);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
};

const localHour = (dt, tz) => {
  const d = new Date((dt + tz) * 1000);
  return d.getUTCHours() + d.getUTCMinutes() / 60;
};

export const getBackgroundImage = (condition, isNight) => {
  if (isNight) {
    if (condition === "Clear") return nightBg;
    if (condition === "Clouds") return cloudyNightBg;
    if (condition === "Rain" || condition === "Drizzle" || condition === "Thunderstorm") return stormyNightBg;
    if (condition === "Wind" || condition === "Tornado" || condition === "Squall") return windyNightBg;
    return partlyCloudyNightBg; 
  } else {
    if (condition === "Clear") return sunnyBg;
    if (condition === "Clouds") return cloudyBg;
    if (condition === "Rain" || condition === "Drizzle" || condition === "Thunderstorm") return stormyBg;
    if (condition === "Wind" || condition === "Tornado" || condition === "Squall") return windyBg;
    return partlyCloudyBg; 
  }
};

// ─── Activity scoring (Kept using original metric logic so scores don't break) ───

const scoreTmp = (t) => {
  if (t < 0)   return 1;
  if (t < 5)   return 3;
  if (t < 10)  return 5;
  if (t < 15)  return 7;
  if (t <= 22) return 10;
  if (t <= 28) return 7;
  if (t <= 34) return 5;
  return 3;
};
const scoreRain = (pop) => Math.max(1, Math.round(10 - pop / 10));
const scoreWind = (mph, activity) => {
  const cyclingPenalty = activity === "cycling" ? 2 : 0;
  if (mph < 5)  return 10;
  if (mph < 10) return 9;
  if (mph < 15) return 7 - cyclingPenalty;
  if (mph < 20) return 5 - cyclingPenalty;
  if (mph < 25) return 3;
  return 1;
};
const scoreUV = (uvi) => {
  if (uvi < 3)  return 10;
  if (uvi < 6)  return 8;
  if (uvi < 8)  return 5;
  if (uvi < 11) return 3;
  return 1;
};

const WEIGHTS = {
  cycling: { temp: 0.30, rain: 0.35, wind: 0.25, uv: 0.10 },
  hiking:  { temp: 0.30, rain: 0.28, wind: 0.20, uv: 0.22 },
  running: { temp: 0.35, rain: 0.28, wind: 0.22, uv: 0.15 },
  camping: { temp: 0.25, rain: 0.40, wind: 0.25, uv: 0.10 },
};

export const calculateActivityScore = (todayRaw, activity) => {
  const w = WEIGHTS[activity] || WEIGHTS.hiking;
  // Use raw metric data to ensure scores remain consistent regardless of user unit preference
  const raw =
    scoreTmp(todayRaw.temp.max)                * w.temp +
    scoreRain(todayRaw.pop * 100)              * w.rain +
    scoreWind(todayRaw.wind_speed * 2.237, activity) * w.wind + // convert ms to mph for the score algo
    scoreUV(todayRaw.uvi)                      * w.uv;
  return Math.max(1, Math.min(10, Math.round(raw)));
};

export const scoreColor = (score) => {
  if (score >= 8) return "#3BC50F";
  if (score >= 5) return "#FFAB1C";
  return "#FF4A3A";
};

export const activityMessage = (activity, score) => {
  const msgs = {
    cycling: ["Avoid cycling today", "It's an alright day to cycle", "Perfect conditions for cycling!"],
    hiking:  ["Not great for hiking today", "Decent conditions for a hike", "It's a great day to go on a hike!"],
    running: ["Avoid running today", "Almost great for a marathon", "Perfect conditions for a run!"],
    camping: ["Not ideal camping conditions", "Maybe wait for another day", "Great night for camping!"],
  };
  const tier = score >= 8 ? 2 : score >= 5 ? 1 : 0;
  return (msgs[activity] || msgs.hiking)[tier];
};

export const reverseGeocode = async (lat, lon) => {
  const res = await axios.get(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
  );
  return res.data.length ? res.data[0].name : "Your Location";
};

// ─── Shared data processor ────────────────────────────────────────────────────

const buildWeatherPayload = (lat, lon, name, data) => {
  const { current, daily, hourly, timezone_offset: tz } = data;
  
  // 1. Fetch User Settings
  const settings = getUnitSettings();
  const unitLabels = getUnitLabels(settings);

  const today    = daily[0];
  const tomorrow = daily[1];
  const todayKey = localDateKey(today.dt, tz);

  const todayHourly  = hourly.filter((h) => localDateKey(h.dt, tz) === todayKey);
  const humidities   = todayHourly.map((h) => h.humidity);
  const visibilities = todayHourly.map((h) => h.visibility || 0).filter((v) => v > 0);

  // 2. Apply Conversions to Today Data
  const todayData = {
    tempHigh:        Math.round(convertTemp(today.temp.max, settings.Temperature)),
    tempLow:         Math.round(convertTemp(today.temp.min, settings.Temperature)),
    humidity:        today.humidity,
    humidityHigh:    humidities.length ? Math.max(...humidities) : today.humidity,
    humidityLow:     humidities.length ? Math.min(...humidities) : today.humidity,
    windSpeed:       Math.round(convertWind(today.wind_speed, settings["Wind Speed"])),
    windGust:        today.wind_gust ? Math.round(convertWind(today.wind_gust, settings["Wind Speed"])) : Math.round(convertWind(today.wind_speed, settings["Wind Speed"])),
    windDeg:         today.wind_deg,
    pop:             Math.round((today.pop || 0) * 100),
    uvi:             today.uvi,
    uvLabel:         uvLabel(today.uvi),
    condition:       today.weather[0].main,
    description:     today.weather[0].description,
    visibilityHigh:  visibilities.length ? parseFloat(convertDist(Math.max(...visibilities), settings.Distance).toFixed(1)) : parseFloat(convertDist(current.visibility || 10000, settings.Distance).toFixed(1)),
    visibilityLow:   visibilities.length ? parseFloat(convertDist(Math.min(...visibilities), settings.Distance).toFixed(1)) : parseFloat(convertDist(current.visibility || 10000, settings.Distance).toFixed(1)),
    visibilityCurrent: parseFloat(convertDist(current.visibility || 10000, settings.Distance).toFixed(1)),
  };

  // 3. Apply Conversions to Hourly
  const normalizedHourly = hourly.slice(0, 12).map((h) => ({
    time:      localTimeStr(h.dt, tz),
    temp:      Math.round(convertTemp(h.temp, settings.Temperature)),
    rain:      `${Math.round((h.pop || 0) * 100)}%`,
    wind:      Math.round(convertWind(h.wind_speed, settings["Wind Speed"])),
    condition: h.weather[0].main,
  }));

  const windDirLabel = (deg) => {
    const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return dirs[Math.round(deg / 22.5) % 16];
  };

  return {
    locationName: name,
    lat,
    lon,
    unitLabels, // Passed out so the UI knows what to render (e.g., °C vs °F)
    current: {
      temp:        Math.round(convertTemp(current.temp, settings.Temperature)),
      feelsLike:   Math.round(convertTemp(current.feels_like, settings.Temperature)),
      humidity:    current.humidity,
      windSpeed:   Math.round(convertWind(current.wind_speed, settings["Wind Speed"])),
      windGust:    current.wind_gust ? Math.round(convertWind(current.wind_gust, settings["Wind Speed"])) : Math.round(convertWind(current.wind_speed, settings["Wind Speed"])),
      windDeg:     current.wind_deg,
      windDir:     windDirLabel(current.wind_deg),
      visibility:  parseFloat(convertDist(current.visibility || 10000, settings.Distance).toFixed(1)),
      uvi:         current.uvi,
      uvLabel:     uvLabel(current.uvi),
      condition:   current.weather[0].main,
      description: current.weather[0].description,
      pop:         Math.round((current.pop || 0) * 100),
      sunrise:     localTimeStr(current.sunrise, tz),
      sunset:      localTimeStr(current.sunset, tz),
      sunriseHour: localHour(current.sunrise, tz),
      sunsetHour:  localHour(current.sunset, tz),
      nowHour:     localHour(Math.floor(Date.now() / 1000), tz),
    },
    today: todayData,
    tomorrow: {
      pop:       Math.round((tomorrow.pop || 0) * 100),
      condition: tomorrow.weather[0].main,
    },
    scores: {
      cycling: calculateActivityScore(today, "cycling"), // Passing raw daily array to prevent score breaking
      hiking:  calculateActivityScore(today, "hiking"),
      running: calculateActivityScore(today, "running"),
      camping: calculateActivityScore(today, "camping"),
    },
    hourly:    normalizedHourly,
    rawHourly: hourly,
    daily,
    timezone_offset: tz,
  };
};

export const fetchYesterdayPrecip = async (lat, lon) => {
  const dt  = Math.floor(Date.now() / 1000) - 86400; // exactly 24 hours ago
  const res = await axios.get(
    `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&appid=${apiKey}`
  );
  const point    = res.data.data[0];
  const rainMm   = point.rain?.["1h"] ?? 0;
  const condition = point.weather[0].main;
  return { condition, rainMm };
};

export const fetchWeatherByCity = async (city) => {
  const { lat, lon, name } = await geocodeCity(city);
  const data = await fetchOneCall(lat, lon);
  return buildWeatherPayload(lat, lon, name, data);
};

export const fetchWeatherByCoords = async (lat, lon) => {
  const [name, data] = await Promise.all([
    reverseGeocode(lat, lon),
    fetchOneCall(lat, lon),
  ]);
  return buildWeatherPayload(lat, lon, name, data);
};