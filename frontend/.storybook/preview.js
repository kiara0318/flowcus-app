import React from "react";
/** @type { import("@storybook/react").Preview } */
import "../src/styles/global.css";
import {ThemeProvider} from "@mui/material/styles";
import theme from "../src/styles/theme";


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

