import type { Employee, WeatherData } from "../types";

// Get the most recent birthday date
const getMostRecentBirthday = (birthday: string): string => {
  const birthDate = new Date(birthday);
  const today = new Date();

  const currentYearBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );

  if (currentYearBirthday > today) {
    currentYearBirthday.setFullYear(today.getFullYear() - 1);
  }

  return currentYearBirthday.toISOString().split("T")[0]; // YYYY-MM-DD format
};

export const fetchWeather = async (birthday: string): Promise<WeatherData> => {
    const recentBirthday = getMostRecentBirthday(birthday);
    // open-metro - weather using NYC as location
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=40.7143&longitude=-74.006&daily=temperature_2m_max&timezone=America%2FNew_York&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch&start_date=${recentBirthday}&end_date=${recentBirthday}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    const temperatureF = data.daily.temperature_2m_max[0];
    return { temperatureF };
};

export const calculateBonus = (employee: Employee, weather: WeatherData): number => {
    let bonusPercentage = {
        Executive: 0.20,
        Supervisor: 0.10,
        Manager: 0.08,
        Employee: 0.05,
    }[employee.team];

    // weather bonus based on temperature
    if (weather.temperatureF > 86) bonusPercentage += 0.10;
    else if (weather.temperatureF >= 68) bonusPercentage += 0.05;

    return employee.salary * bonusPercentage;
};
