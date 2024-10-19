/**
 * Converts a unified emoji code (in hex format) to its corresponding emoji character(s).
 *
 * @param {string} unifiedCode - The unified emoji code, formatted as a string (e.g., '1F600-1F3FB').
 * @returns {string} The corresponding emoji character(s) or an empty string if the input is invalid.
 *
 * @example
 * // Returns the grinning face emoji
 * const emoji = convertUnifiedToEmoji('1F600');
 */
export const convertUnifiedToEmoji = (unifiedCode) => {
    if (!unifiedCode || typeof unifiedCode !== "string") {
        return ""; // Return an empty string if the input is invalid
    }

    // Split the unified code string into individual code points
    const codePoints = unifiedCode.split("-");

    // Convert each hex code point to its corresponding Unicode value
    const unicodeValues = codePoints.map(hexCode => parseInt(hexCode, 16));

    // Convert the Unicode values to the corresponding emoji character(s)
    return String.fromCodePoint(...unicodeValues);
};

/**
 * Converts an emoji object to its corresponding emoji character.
 *
 * The function checks for an existing emoji property in the emoji object. If not found,
 * it attempts to convert the unified code property (if available) to an emoji character.
 *
 * @param {Object} emojiObject - An object representing the emoji, which may contain:
 *   - {string} emoji - The emoji character (if available).
 *   - {string} unified - The unified emoji code (if emoji is not available).
 * @returns {string} The corresponding emoji character or an empty string if the input is invalid.
 *
 * @example
 * // Returns the grinning face emoji
 * const emoji = convertEmojiObjectToEmoji({ unified: '1F600' });
 */
export const convertEmojiObjectToEmoji = (emojiObject) => {
    if (!emojiObject || typeof emojiObject !== "object") {
        return ""; // Return an empty string if the input is invalid
    }

    // Return emoji if present, otherwise convert unified code to emoji
    return emojiObject.emoji ?? convertUnifiedToEmoji(emojiObject.unified) ?? "";
};
