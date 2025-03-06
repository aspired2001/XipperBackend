// Validation utility functions

/**
 * Validates the format of an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
exports.isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates the format of an Aadhaar number (12 digits)
 * @param {string} aadhaar - Aadhaar number to validate
 * @returns {boolean} True if Aadhaar number is valid, false otherwise
 */
exports.isValidAadhaar = (aadhaar) => {
    return /^\d{12}$/.test(aadhaar);
};

/**
 * Checks if a string is empty or only contains whitespace
 * @param {string} str - String to check
 * @returns {boolean} True if string is empty or whitespace only, false otherwise
 */
exports.isEmpty = (str) => {
    return (!str || str.trim().length === 0);
};

/**
 * Validates a date to ensure it's a valid date in the future
 * @param {Date|string} date - Date to validate
 * @returns {boolean} True if date is valid and in the future, false otherwise
 */
exports.isValidFutureDate = (date) => {
    const dateObj = new Date(date);
    const now = new Date();

    // Check if it's a valid date and is in the future
    return !isNaN(dateObj.getTime()) && dateObj > now;
};