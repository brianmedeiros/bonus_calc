import type { Employee, WeatherData } from "../types";

export const fetchWeather = async (date: string): Promise<WeatherData> => {
    // open-metro - weather using NYC as location
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=40.7143&longitude=-74.006&daily=temperature_2m_max&timezone=America%2FNew_York&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch&start_date=${date}&end_date=${date}`;

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
