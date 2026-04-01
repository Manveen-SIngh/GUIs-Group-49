// weatherApi.js
// Central service file — all API calls, unit conversion functions, activity
// score calculations, and background image selection live here so the rest of
// the app doesn't have to deal with raw API responses directly.

import axios from "axios";

// Background Asset Imports
// We import every background SVG up front so webpack bundles them correctly.
// The right one is chosen at runtime based on weather condition + day/night.
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
import rainyBg from '../assets/backgrounds/weather-rainy.svg';
import rainyNightBg from '../assets/backgrounds/weather-rainyNight.svg';

// API key from the .env file
const apiKey = process.env.REACT_APP_OPENWEATHER_KEY;

// API helpers

// geocodeCity takes a city name string and returns { lat, lon, name }.
// Throws if the city isn't found so callers can handle the error.
export const geocodeCity = async (city) => {
  const res = await axios.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
  );
  if (!res.data.length) throw new Error(`City "${city}" not found.`);
  const { lat, lon, name } = res.data[0];
  return { lat, lon, name };
};

// fetchOneCall gets the full OneCall 3.0 response (current + hourly + daily)
// in metric units. Conversion to the user's preferred units happens later
export const fetchOneCall = async (lat, lon) => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );
  return res.data;
};

// Unit Conversion Logic

// getUnitSettings reads the user's unit preferences from localStorage.
// If nothing is saved yet, fall back to metric defaults
export const getUnitSettings = () => {
  const saved = localStorage.getItem("unitSettings");
  let settings = saved ? JSON.parse(saved) : {
    Temperature: "Celsius (C)",
    "Wind Speed": "Kilometers per hour (km/h)",
    Precipitation: "Millimeters (mm)",
    Distance: "Kilometers (km)",
  };

  return settings;
};

// convertTemp converts a Celsius value to the target unit.
// The API always returns metric, so celsius is the base
export const convertTemp = (celsius, setting) => {
  if (setting === "Fahrenheit (F)") return (celsius * 9/5) + 32;
  return celsius; // default
};

// convertWind converts from m/s (the API's unit) to whatever the user prefers.
// Default (no match) falls to km/h.
export const convertWind = (ms, setting) => {
  if (setting === "Miles per hour (mph)") return ms * 2.237;
  if (setting === "Meters per second (m/s)") return ms;
  if (setting === "Knots (kn)") return ms * 1.94384;
  return ms * 3.6; // km/h
};

// convertDist converts from metres (the API's unit) to the user's preference.
// Default falls to km.
export const convertDist = (m, setting) => {
  if (setting === "Miles (mi)") return m / 1609.34;
  if (setting === "Meters (m)") return m;
  return m / 1000; // km
};

// getUnitLabels builds a small { temp, wind, dist, precip } object of display
// strings (e.g. "°C", "km/h") based on current settings. 
// Used internally when building the api weather payload
const getUnitLabels = (settings) => ({
  temp: settings.Temperature === "Fahrenheit (F)" ? "°F" : "°C",
  wind: settings["Wind Speed"] === "Miles per hour (mph)" ? "mph" : settings["Wind Speed"] === "Meters per second (m/s)" ? "m/s" : settings["Wind Speed"] === "Knots (kn)" ? "kn" : "km/h",
  dist: settings.Distance === "Miles (mi)" ? "mi" : settings.Distance === "Meters (m)" ? "m" : "km",
  precip: settings.Precipitation === "Inches (in)" ? "in" : settings.Precipitation === "Centimeters (cm)" ? "cm" : "mm"
});

// Utility

// uvLabel converts a numeric UV index to a descriptive string for display
export const uvLabel = (uvi) => {
  if (uvi < 3)  return "Low";
  if (uvi < 6)  return "Moderate";
  if (uvi < 8)  return "High";
  if (uvi < 11) return "Very High";
  return "Extreme";
};

// localDateKey turns a Unix timestamp + timezone offset into a "YYYY-MM-DD"
// string in the location's local time (not the browser's local time).
const localDateKey = (dt, tz) => {
  const d = new Date((dt + tz) * 1000);
  return [d.getUTCFullYear(), String(d.getUTCMonth() + 1).padStart(2, "0"), String(d.getUTCDate()).padStart(2, "0")].join("-");
};

// localTimeStr returns "HH:MM" in the location's local timezone
const localTimeStr = (dt, tz) => {
  const d = new Date((dt + tz) * 1000);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
};

// localHour returns the hour as a decimal (e.g. 14.5 = 14:30) in local time
// Used for the sunrise/sunset comparison in OdAPage to decide day vs night
const localHour = (dt, tz) => {
  const d = new Date((dt + tz) * 1000);
  return d.getUTCHours() + d.getUTCMinutes() / 60;
};

// getBackgroundImage picks the right SVG asset based on the weather condition
// string from the API and whether it's currently night at the location.
// Unrecognised conditions fall back to the partly-cloudy asset
export const getBackgroundImage = (condition, isNight) => {
  if (isNight) {
    if (condition === "Clear") return nightBg;
    if (condition === "Clouds") return cloudyNightBg;
    if (condition === "Rain" || condition === "Drizzle") return rainyNightBg;
    if (condition === "Thunderstorm") return stormyNightBg;
    if (condition === "Wind" || condition === "Tornado" || condition === "Squall") return windyNightBg;
    return partlyCloudyNightBg; // fallback
  } else {
    if (condition === "Clear") return sunnyBg;
    if (condition === "Clouds") return cloudyBg;
    if (condition === "Rain" || condition === "Drizzle") return rainyBg; 
    if (condition === "Thunderstorm") return stormyBg;
    if (condition === "Wind" || condition === "Tornado" || condition === "Squall") return windyBg;
    return partlyCloudyBg; // fallback
  }
};


// Advanced score computation 

// lerp does linear interpolation across a list of [x, y] control points.
// This let us define non-linear score curves rather than hard steps.
// e.g. a temperature of 20°C maps to a score somewhere between the two
// nearest control points.
const lerp = (val, pts) => {
  if (val <= pts[0][0]) return pts[0][1];
  if (val >= pts[pts.length - 1][0]) return pts[pts.length - 1][1];
  for (let i = 0; i < pts.length - 1; i++) {
    if (val <= pts[i + 1][0]) {
      const t = (val - pts[i][0]) / (pts[i + 1][0] - pts[i][0]);
      return pts[i][1] + t * (pts[i + 1][1] - pts[i][1]);
    }
  }
  return pts[pts.length - 1][1];
};

// METRIC_CURVES defines per-activity, per-metric score as arrays of
// input_value and score control points. lerp interpolates between them.
// Each activity has different curves because cyclists care more about
// wind than campers do.
const METRIC_CURVES = {
  rain: {
    cycling: [[0,10],[15,9],[30,6],[50,3],[70,1],[100,1]],
    hiking:  [[0,10],[25,9],[45,6],[65,3],[90,1],[100,1]],
    camping: [[0,10],[10,9],[25,5],[40,2],[70,1],[100,1]],
    running: [[0,10],[30,9],[55,7],[75,4],[90,2],[100,1]],
  },
  temp: {
    cycling: [[-10,2],[0,5],[10,9],[18,10],[25,10],[30,7],[35,4],[40,1]],
    hiking:  [[-10,2],[0,4],[8,8],[15,10],[22,9],[28,5],[33,2],[40,1]],
    camping: [[-5,2],[5,5],[10,8],[15,10],[22,10],[27,7],[32,4],[40,1]],
    running: [[-10,2],[0,4],[8,9],[12,10],[18,9],[24,5],[28,2],[35,1]],
  },
  humidity: {
    cycling: [[0,10],[55,10],[70,7],[80,5],[90,3],[100,1]],
    hiking:  [[0,10],[50,10],[65,7],[75,5],[85,3],[100,1]],
    camping: [[0,10],[60,10],[75,7],[85,5],[95,2],[100,1]],
    running: [[0,10],[45,10],[60,7],[70,4],[80,2],[90,1],[100,1]],
  },
  visibility: {
    cycling: [[0,1],[2,2],[5,5],[8,8],[10,10],[16,10]],
    hiking:  [[0,1],[1,3],[3,6],[6,9],[8,10],[16,10]],
    camping: [[0,2],[1,5],[2,8],[3,10],[16,10]],
    running: [[0,1],[1,3],[3,7],[5,9],[7,10],[16,10]],
  },
  wind: {
    cycling: [[0,10],[10,10],[15,8],[20,5],[30,2],[50,1]],
    hiking:  [[0,9],[8,10],[20,9],[30,7],[45,4],[60,2],[80,1]],
    camping: [[0,8],[5,10],[15,9],[25,6],[40,3],[60,1]],
    running: [[0,10],[10,10],[18,8],[25,5],[35,2],[50,1]],
  },
  uv: {
    cycling: [[0,10],[2,10],[4,8],[6,5],[8,3],[10,2],[11,1]],
    hiking:  [[0,10],[2,10],[3,8],[5,5],[7,2],[9,1],[11,1]],
    camping: [[0,10],[3,10],[5,9],[7,6],[9,3],[11,1]],
    running: [[0,10],[2,10],[4,8],[6,5],[8,2],[10,1],[11,1]],
  },
};

// ACTIVITY_WEIGHTS for the advanced scorer — same idea as WEIGHTS above but
// with more metrics (humidity and visibility added). Must sum to 1.0 each.
const ACTIVITY_WEIGHTS = {
  cycling: { rain: 0.25, temp: 0.20, wind: 0.25, humidity: 0.10, visibility: 0.10, uv: 0.10 },
  hiking:  { rain: 0.20, temp: 0.20, wind: 0.15, humidity: 0.15, visibility: 0.10, uv: 0.20 },
  running: { rain: 0.20, temp: 0.25, wind: 0.15, humidity: 0.20, visibility: 0.05, uv: 0.15 },
  camping: { rain: 0.30, temp: 0.20, wind: 0.20, humidity: 0.15, visibility: 0.05, uv: 0.10 },
};

// computeScore is the main scoring function used by OdAPage and the activity
// score widgets. It takes a normalised today object and unit labels, converts
// everything to metric internally (°C and km) so the curves always work the
// same way, then applies lerp with a weighted sum to produce a 1–10 score.
export const computeScore = (actKey, today, labels) => {
  const w = ACTIVITY_WEIGHTS[actKey];
  const c = METRIC_CURVES;

  // Convert from the user's units back to metric for the score curves
  const tempC   = labels.temp === "°F" ? (today.tempHigh - 32) * 5 / 9 : today.tempHigh;
  const visKm   = labels.dist === "mi" ? today.visibilityHigh * 1.60934 : labels.dist === "m"  ? today.visibilityHigh / 1000 : today.visibilityHigh;
  const windKmh = today.windSpeedMs * 3.6;

  const weighted =
    lerp(today.pop, c.rain[actKey])* w.rain + 
    lerp(tempC,c.temp[actKey])* w.temp +
    lerp(today.humidityHigh,c.humidity[actKey])* w.humidity +
    lerp(visKm, c.visibility[actKey]) * w.visibility +
    lerp(windKmh, c.wind[actKey]) * w.wind +
    lerp(today.uvi,c.uv[actKey])* w.uv;

  //[1, 10] and round to a whole number
  return Math.max(1, Math.min(10, Math.round(weighted)));
};

// scoreColor maps a 1–10 score to a colour:
// green(>=8) is great conditions
// orange>=5 is okay conditions
// red<5 is bad conditions
export const scoreColor = (score) => {
  if (score >= 8) return "#3BC50F";
  if (score >= 5) return "#FFAB1C";
  return "#FF4A3A";
};

// activityMessage returns a short text for the current score tier.
// tier 2 = great, tier 1 = okay, tier 0 = bad.
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

// reverseGeocode converts lat/lon back into a city name string.
// Returns "Your Location" if the API doesn't find a matching name.
export const reverseGeocode = async (lat, lon) => {
  const res = await axios.get(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
  );
  return res.data.length ? res.data[0].name : "Your Location";
};

// buildWeatherPayload is the main data-building function — it takes the raw
// OneCall API response and converts it into the structured object the rest
// of the app uses. Handles unit conversion, score calculation, and
// hourly stats.
export const buildWeatherPayload = (lat, lon, name, data, settingsOverride = null) => {
  const { current, daily, hourly, timezone_offset: tz } = data;

  // Allow callers to pass custom unit settings (used by OdAPage unit toggles)
  // otherwise read from localStorage as usual
  const settings = settingsOverride || getUnitSettings();
  const unitLabels = getUnitLabels(settings);

  const today    = daily[0];
  const tomorrow = daily[1];
  const todayKey = localDateKey(today.dt, tz);

  // Filter the hourly array to only entries that fall on today's local date
  const todayHourly  = hourly.filter((h) => localDateKey(h.dt, tz) === todayKey);
  const humidities   = todayHourly.map((h) => h.humidity);
  // Some hourly entries have visibility = 0, which doesn't make sense, so filter them
  const visibilities = todayHourly.map((h) => h.visibility || 0).filter((v) => v > 0);

  // todayData collects the most useful stats for the "today" summary panel
  const todayData = {
    tempHigh:        Math.round(convertTemp(today.temp.max, settings.Temperature)),
    tempLow:         Math.round(convertTemp(today.temp.min, settings.Temperature)),
    humidity:        today.humidity,
    humidityHigh:    humidities.length ? Math.max(...humidities) : today.humidity,
    humidityLow:     humidities.length ? Math.min(...humidities) : today.humidity,
    windSpeed:       Math.round(convertWind(today.wind_speed, settings["Wind Speed"])),
    windSpeedMs:     today.wind_speed, // keep raw m/s for score calculations
    // If there's no gust data, use the average wind speed as a fallback
    windGust:        today.wind_gust ? Math.round(convertWind(today.wind_gust, settings["Wind Speed"])) : Math.round(convertWind(today.wind_speed, settings["Wind Speed"])),
    windDeg:         today.wind_deg,
    pop:             Math.round((today.pop || 0) * 100), // convert 0–1 fraction to 0–100 %
    uvi:             today.uvi,
    uvLabel:         uvLabel(today.uvi),
    condition:       today.weather[0].main,
    description:     today.weather[0].description,
    // Visibility high/low from today's hourly data, fall back to current if none
    visibilityHigh:  visibilities.length ? parseFloat(convertDist(Math.max(...visibilities), settings.Distance).toFixed(1)) : parseFloat(convertDist(current.visibility || 10000, settings.Distance).toFixed(1)),
    visibilityLow:   visibilities.length ? parseFloat(convertDist(Math.min(...visibilities), settings.Distance).toFixed(1)) : parseFloat(convertDist(current.visibility || 10000, settings.Distance).toFixed(1)),
    visibilityCurrent: parseFloat(convertDist(current.visibility || 10000, settings.Distance).toFixed(1)),
  };

  // normalizedHourly is a clean list of the next 12 hours for the hourly chart
  const normalizedHourly = hourly.slice(0, 12).map((h) => ({
    time:      localTimeStr(h.dt, tz),
    temp:      Math.round(convertTemp(h.temp, settings.Temperature)),
    rain:      `${Math.round((h.pop || 0) * 100)}%`,
    wind:      Math.round(convertWind(h.wind_speed, settings["Wind Speed"])),
    windDeg:   h.wind_deg ?? 0,
    condition: h.weather[0].main,
  }));

  // windDirLabel converts a bearing in degrees to a compass direction string
  // (N, NNE, NE, ENE, E, ...) using 16 compass points, each covering 22.5°
  const windDirLabel = (deg) => {
    const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return dirs[Math.round(deg / 22.5) % 16];
  };

  // Return a big structured object that all pages and components can use
  return {
    locationName: name,
    lat,
    lon,
    unitLabels,
    current: {
      temp:        Math.round(convertTemp(current.temp, settings.Temperature)),
      feelsLike:   Math.round(convertTemp(current.feels_like, settings.Temperature)),
      humidity:    current.humidity,
      windSpeed:   Math.round(convertWind(current.wind_speed, settings["Wind Speed"])),
      windGust:    current.wind_gust ? Math.round(convertWind(current.wind_gust, settings["Wind Speed"])) : Math.round(convertWind(current.wind_speed, settings["Wind Speed"])),
      windDeg:     current.wind_deg,
      windDir:     windDirLabel(current.wind_deg), // e.g. "NW"
      visibility:  parseFloat(convertDist(current.visibility || 10000, settings.Distance).toFixed(1)),
      uvi:         current.uvi,
      uvLabel:     uvLabel(current.uvi),
      condition:   current.weather[0].main,
      description: current.weather[0].description,
      pop:         Math.round((current.pop || 0) * 100),
      sunrise:     localTimeStr(current.sunrise, tz),
      sunset:      localTimeStr(current.sunset, tz),
      sunriseHour: localHour(current.sunrise, tz), // decimal hour for day/night comparison
      sunsetHour:  localHour(current.sunset, tz),
      nowHour:     localHour(Math.floor(Date.now() / 1000), tz),
    },
    today: todayData,
    tomorrow: {
      pop:       Math.round((tomorrow.pop || 0) * 100),
      condition: tomorrow.weather[0].main,
    },
    // Pre-compute all four activity scores so widgets don't have to do it themselves
    scores: {
      cycling: computeScore("cycling", todayData, { temp: "°C", dist: "km" }),
      hiking:  computeScore("hiking",  todayData, { temp: "°C", dist: "km" }),
      running: computeScore("running", todayData, { temp: "°C", dist: "km" }),
      camping: computeScore("camping", todayData, { temp: "°C", dist: "km" }),
    },
    hourly:    normalizedHourly,
    rawHourly: hourly,   // kept for cases where the raw OneCall hourly is needed
    daily,
    timezone_offset: tz,
  };
};

// fetchYesterdayPrecip uses the OneCall timemachine endpoint to get yesterday's
// precipitation data. Used by OdAPage to show a "previous rain" comparison.
export const fetchYesterdayPrecip = async (lat, lon) => {
  const dt  = Math.floor(Date.now() / 1000) - 86400; // 86400 seconds = 24 hours ago
  const res = await axios.get(
    `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&appid=${apiKey}`
  );
  const point    = res.data.data[0];
  const rainMm   = point.rain?.["1h"] ?? 0; // "1h" is the hourly rain field
  const condition = point.weather[0].main;
  return { condition, rainMm };
};

// fetchWeatherByCity is a convenience wrapper. geocode city -> fetch OneCall
// -> build payload. Takes an optional settingsOverride for unit toggling.
export const fetchWeatherByCity = async (city, settingsOverride = null) => {
  const { lat, lon, name } = await geocodeCity(city);
  const data = await fetchOneCall(lat, lon);
  return buildWeatherPayload(lat, lon, name, data, settingsOverride);
};

// fetchWeatherByCoords is the same but starting from coordinates (used when
// the browser supplies the user's GPS position). Runs geocode and OneCall
// in parallel since neither depends on the other's result.
export const fetchWeatherByCoords = async (lat, lon, settingsOverride = null) => {
  const [name, data] = await Promise.all([
    reverseGeocode(lat, lon),
    fetchOneCall(lat, lon),
  ]);
  return buildWeatherPayload(lat, lon, name, data, settingsOverride);
};
