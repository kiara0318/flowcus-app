import React from "react"; // Add this line at the top of your file
/** @type { import("@storybook/react").Preview } */
import "../src/styles/global.css";
import {ThemeProvider} from "@mui/material/styles"; // Adjust based on your theme provider
import theme from "../src/styles/theme"; // Adjust the path to your MUI theme


const preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme}>
                <Story/>
            </ThemeProvider>
        ),
    ],
};

export default preview;

