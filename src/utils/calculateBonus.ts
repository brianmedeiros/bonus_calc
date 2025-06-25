import type { Employee, WeatherData } from "../types";
import { DateTime } from "luxon";

// Get the most recent same-day-of-month before today, adjusting for short months
const getRecentBonusDate = (birthday: string): string => {
    const birth = DateTime.fromISO(birthday);
    const today = DateTime.now().setZone("America/New_York");

    let bonusMonth = today.month;
    let bonusYear = today.year;

    // If today's day is before the birthday's day, move back a month
    if (today.day < birth.day) {
        bonusMonth -= 1;
        if (bonusMonth < 1) {
            bonusMonth = 12;
            bonusYear -= 1;
        }
    }

    // Try to construct that date in NY time
    let bonusDate = DateTime.fromObject(
        {
            year: bonusYear,
            month: bonusMonth,
            day: birth.day,
        },
        { zone: "America/New_York" }
    );

    // If invalid (e.g., June 31), fallback to last day of the month
    if (!bonusDate.isValid) {
        bonusDate = DateTime.fromObject(
            {
                year: bonusYear,
                month: bonusMonth,
                day: DateTime.local(bonusYear, bonusMonth).daysInMonth,
            },
            { zone: "America/New_York" }
        );
    }

    return bonusDate.toISODate() ?? "";
};



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
