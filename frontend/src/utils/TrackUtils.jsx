/**
 * Formats the artist names.
 *
 * @param {Array} artists - Array of artist objects.
 * @returns {string} - Formatted artist names.
 */
export const formatArtists = (artists) => {
    if (artists.length === 1) return artists[0].name;
    if (artists.length === 2) return `${artists[0].name} & ${artists[1].name}`;
    const lastArtist = artists.pop();
    return `${artists.map((artist) => artist.name).join(", ")}, & ${lastArtist.name}`;
};