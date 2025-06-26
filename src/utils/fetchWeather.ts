import { getRecentBonusDate } from "../utils/dateUtils";

// Fetches weather data for a given employee's adjusted birthday
export const fetchWeather = async (
  birthday: string
): Promise<{ temperatureF: number; dateUsed: string }> => {
  const dateUsed = getRecentBonusDate(birthday);

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=40.7143&longitude=-74.006&daily=temperature_2m_max&timezone=America%2FNew_York&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch&start_date=${dateUsed}&end_date=${dateUsed}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }

  const data = await response.json();
  const temperatureF = data.daily.temperature_2m_max[0];

  return { temperatureF, dateUsed };
};
