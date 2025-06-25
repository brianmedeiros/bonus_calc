import type { Employee, WeatherData } from "../types";
import { getRecentBonusDate } from "../utils/dateUtils";


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

export const calculateBonus = (
    employee: Employee,
    weather: WeatherData
): number => {
    let bonusPercentage = {
        Executive: 0.2,
        Supervisor: 0.1,
        Manager: 0.08,
        Employee: 0.05,
    }[employee.team];

    if (weather.temperatureF > 86) bonusPercentage += 0.1;
    else if (weather.temperatureF >= 68) bonusPercentage += 0.05;

    return employee.salary * bonusPercentage;
};
