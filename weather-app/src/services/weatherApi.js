import axios from "axios";

const apiKey = process.env.REACT_APP_OPENWEATHER_KEY;

// ─── Raw API calls ────────────────────────────────────────────────────────────

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

// ─── Utility ──────────────────────────────────────────────────────────────────

const msToMph = (ms) => Math.round(ms * 2.237);
const mToMi  = (m)  => parseFloat((m / 1609.34).toFixed(1));

export const uvLabel = (uvi) => {
  if (uvi < 3)  return "Low";
  if (uvi < 6)  return "Moderate";
  if (uvi < 8)  return "High";
  if (uvi < 11) return "Very High";
  return "Extreme";
};

const localDateKey = (dt, tz) => {
  const d = new Date((dt + tz) * 1000);
  return [
    d.getUTCFullYear(),
    String(d.getUTCMonth() + 1).padStart(2, "0"),
    String(d.getUTCDate()).padStart(2, "0"),
  ].join("-");
};

const localTimeStr = (dt, tz) => {
  const d = new Date((dt + tz) * 1000);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
};

const localHour = (dt, tz) => {
  const d = new Date((dt + tz) * 1000);
  return d.getUTCHours() + d.getUTCMinutes() / 60;
};

// ─── Activity scoring ─────────────────────────────────────────────────────────

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

export const calculateActivityScore = (todayData, activity) => {
  const w = WEIGHTS[activity] || WEIGHTS.hiking;
  const raw =
    scoreTmp(todayData.tempHigh)           * w.temp +
    scoreRain(todayData.pop)               * w.rain +
    scoreWind(todayData.windSpeed, activity) * w.wind +
    scoreUV(todayData.uvi)                 * w.uv;
  return Math.max(1, Math.min(10, Math.round(raw)));
};

export const scoreColor = (score) => {
  if (score >= 8) return "#3BC50F";
  if (score >= 5) return "#FFAB1C";
  return "#FF4A3A";
};

export const activityMessage = (activity, score) => {
  const msgs = {
    cycling: ["Avoid cycling today",          "It's an alright day to cycle",       "Perfect conditions for cycling!"],
    hiking:  ["Not great for hiking today",    "Decent conditions for a hike",        "It's a great day to go on a hike!"],
    running: ["Avoid running today",           "Almost great for a marathon",         "Perfect conditions for a run!"],
    camping: ["Not ideal camping conditions",  "Maybe wait for another day",          "Great night for camping!"],
  };
  const tier = score >= 8 ? 2 : score >= 5 ? 1 : 0;
  return (msgs[activity] || msgs.hiking)[tier];
};

// ─── Main fetch ───────────────────────────────────────────────────────────────

export const fetchWeatherByCity = async (city) => {
  const { lat, lon, name } = await geocodeCity(city);
  const data = await fetchOneCall(lat, lon);
  const { current, daily, hourly, timezone_offset: tz } = data;

  const today    = daily[0];
  const tomorrow = daily[1];
  const todayKey = localDateKey(today.dt, tz);

  const todayHourly  = hourly.filter((h) => localDateKey(h.dt, tz) === todayKey);
  const humidities   = todayHourly.map((h) => h.humidity);
  const visibilities = todayHourly.map((h) => h.visibility || 0).filter((v) => v > 0);

  const todayData = {
    tempHigh:        Math.round(today.temp.max),
    tempLow:         Math.round(today.temp.min),
    humidity:        today.humidity,
    humidityHigh:    humidities.length ? Math.max(...humidities) : today.humidity,
    humidityLow:     humidities.length ? Math.min(...humidities) : today.humidity,
    windSpeed:       msToMph(today.wind_speed),
    windGust:        today.wind_gust ? msToMph(today.wind_gust) : msToMph(today.wind_speed),
    windDeg:         today.wind_deg,
    pop:             Math.round((today.pop || 0) * 100),
    uvi:             today.uvi,
    uvLabel:         uvLabel(today.uvi),
    condition:       today.weather[0].main,
    description:     today.weather[0].description,
    visibilityHigh:  visibilities.length ? mToMi(Math.max(...visibilities)) : mToMi(current.visibility || 10000),
    visibilityLow:   visibilities.length ? mToMi(Math.min(...visibilities)) : mToMi(current.visibility || 10000),
    visibilityCurrent: mToMi(current.visibility || 10000),
  };

  // Hourly items normalized for WeatherBox (first 12 h)
  const normalizedHourly = hourly.slice(0, 12).map((h) => ({
    time:      localTimeStr(h.dt, tz),
    temp:      `${Math.round(h.temp)}°C`,
    rain:      `${Math.round((h.pop || 0) * 100)}%`,
    wind:      `${msToMph(h.wind_speed)}mph`,
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
    current: {
      temp:        Math.round(current.temp),
      feelsLike:   Math.round(current.feels_like),
      humidity:    current.humidity,
      windSpeed:   msToMph(current.wind_speed),
      windGust:    current.wind_gust ? msToMph(current.wind_gust) : msToMph(current.wind_speed),
      windDeg:     current.wind_deg,
      windDir:     windDirLabel(current.wind_deg),
      visibility:  mToMi(current.visibility || 10000),
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
      cycling: calculateActivityScore(todayData, "cycling"),
      hiking:  calculateActivityScore(todayData, "hiking"),
      running: calculateActivityScore(todayData, "running"),
      camping: calculateActivityScore(todayData, "camping"),
    },
    hourly:    normalizedHourly,
    rawHourly: hourly,
    daily,
    timezone_offset: tz,
  };
};
