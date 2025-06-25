import type { Employee, WeatherData } from "../types";

// Get the most recent same-day-of-month before today, adjusting for short months
const getRecentBonusDate = (birthday: string): string => {
  const birthDate = new Date(birthday);
  const today = new Date();
  const birthDay = birthDate.getDate();

  let bonusMonth = today.getMonth();
  let bonusYear = today.getFullYear();

  if (today.getDate() < birthDay) {
    bonusMonth -= 1;
    if (bonusMonth < 0) {
      bonusMonth = 11;
      bonusYear -= 1;
    }
  }

  // Try to create a date with the same day
  let candidateDate = new Date(bonusYear, bonusMonth, birthDay);

  // If the date rolls over into the next month (June 31 becomes July 1), back up a month
  if (candidateDate.getMonth() !== bonusMonth) {
    bonusMonth -= 1;
    if (bonusMonth < 0) {
      bonusMonth = 11;
      bonusYear -= 1;
    }
    const lastDay = new Date(bonusYear, bonusMonth + 1, 0).getDate();
    candidateDate = new Date(bonusYear, bonusMonth, Math.min(birthDay, lastDay));
  }

  return candidateDate.toISOString().split("T")[0]; // YYYY-MM-DD
};

export const fetchWeather = async (birthday: string): Promise<{ temperatureF: number; dateUsed: string }> => {
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

export const calculateBonus = (employee: Employee, weather: WeatherData): number => {
  let bonusPercentage = {
    Executive: 0.20,
    Supervisor: 0.10,
    Manager: 0.08,
    Employee: 0.05,
  }[employee.team];

  if (weather.temperatureF > 86) bonusPercentage += 0.10;
  else if (weather.temperatureF >= 68) bonusPercentage += 0.05;

  return employee.salary * bonusPercentage;
};
