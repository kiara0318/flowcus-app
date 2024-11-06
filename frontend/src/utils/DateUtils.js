/**
 * Gets the number representing the next day based on the current day of the week.
 * The days of the week are mapped from 0 (Sunday) to 6 (Saturday).
 *
 * @param {number} currentDay - The current day of the week (0-6).
 * @returns {number} The number representing the next day's day (0-6).
 *                  Returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday.
 * @throws {Error} Will throw an error if currentDay is not between 0 and 6.
 */
export const getNextDayNumber = (currentDay) => {
    if (currentDay < 0 || currentDay > 6) {
        throw new Error("currentDay must be between 0 and 6.");
    }
    return (currentDay + 1) % 7;
};

/**
 * Gets the name of the day based on the number representation.
 * The days of the week are mapped from 0 (Sunday) to 6 (Saturday).
 *
 * @param {number} dayNumber - The number representing the day of the week (0-6).
 * @returns {string} The name of the day (e.g., "Sunday", "Monday", etc.).
 * @throws {Error} Will throw an error if dayNumber is not between 0 and 6.
 */
export const getDayNameFromNumber = (dayNumber) => {
    if (dayNumber < 0 || dayNumber > 6) {
        throw new Error("dayNumber must be between 0 and 6.");
    }

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[dayNumber];
};