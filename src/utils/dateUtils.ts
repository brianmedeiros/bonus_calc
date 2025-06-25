import { DateTime } from "luxon";

/**
 * Finds the most recent month before (or including) the given one that has the requested day. Falls back to the last valid day of the closest matching month if needed.
 */
export function findLastValidBirthdayDay(
    targetDay: number,
    startMonth: number,
    startYear: number
): DateTime {
    let searchMonth = startMonth;
    let searchYear = startYear;
    let attempts = 12;

    while (attempts-- > 0) {
        searchMonth -= 1;
        if (searchMonth < 1) {
            searchMonth = 12;
            searchYear -= 1;
        }

        const daysInMonth = DateTime.local(searchYear, searchMonth).daysInMonth!;
        if (targetDay <= daysInMonth) {
            return DateTime.fromObject(
                { year: searchYear, month: searchMonth, day: targetDay },
                { zone: "America/New_York" }
            );
        }
    }

    // Fallback: use the last valid day of that final month
    const fallbackDay = DateTime.local(searchYear, searchMonth).daysInMonth!;
    return DateTime.fromObject(
        { year: searchYear, month: searchMonth, day: fallbackDay },
        { zone: "America/New_York" }
    );
}

/**
 * Returns the most recent valid day (in NY time) on or before today,
 * matching the employee’s birthday day of month. Handles fallback logic for 29/30/31-day birthdays.
 */
export function getRecentBonusDate(birthday: string): string {
    const birth = DateTime.fromISO(birthday);
    const today = DateTime.now().setZone("America/New_York");

    let bonusMonth = today.month;
    let bonusYear = today.year;

    // Step back a month if today is earlier in the month than the birthday
    if (today.day < birth.day) {
        bonusMonth -= 1;
        if (bonusMonth < 1) {
            bonusMonth = 12;
            bonusYear -= 1;
        }
    }

    let bonusDate = DateTime.fromObject(
        { year: bonusYear, month: bonusMonth, day: birth.day },
        { zone: "America/New_York" }
    );

    if (!bonusDate.isValid) {
        bonusDate = findLastValidBirthdayDay(birth.day, bonusMonth, bonusYear);
    }

    return bonusDate.toISODate()!;
}
