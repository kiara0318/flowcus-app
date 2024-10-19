import {createTheme} from "@mui/material/styles";

const baseFontFamily = "Roboto, Arial, sans-serif";
const headingFontFamily = "Fredoka One, sans-serif";
const theme = createTheme({
    palette: {
        primary: {
            main: "#fb48a7", // Customize primary color
        },
    },

    typography: {
        fontFamily: baseFontFamily,
        // Generate heading styles dynamically
        ...Array.from({length: 6}, (_, index) => {
            const headingKey = `h${index + 1}`; // Generates h1, h2, h3, ..., h6
            return {[headingKey]: {fontFamily: headingFontFamily}};
        }).reduce((acc, curr) => Object.assign(acc, curr), {}),
    },
});

export default theme;