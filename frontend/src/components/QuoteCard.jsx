import React from "react";
import {Card, CardContent, Typography} from "@mui/material";
import "./styles/QuoteCard.css";
import PropTypes from "prop-types";

/**
 * QuoteCard component to display a single quote.
 * @param {Object} props - The properties for the component.
 * @param {string} props.quote - The quote text.
 * @param {string} props.author - The author of the quote.
 */
const QuoteCard = ({quote, author = "Unknown"}) => {
    const header = "Quote of the Day";
    const body = `"${quote}" - ${author}`;
    return (
        <Card className="quote-card">
            <CardContent align={"center"}>
                <Typography variant="h6" className="quote-title">
                    {header}
                </Typography>
                <Typography variant="body" className="quote-text">
                    {body}
                </Typography>
            </CardContent>
        </Card>
    );
};
QuoteCard.propTypes = {
    quote: PropTypes.string.isRequired, author: PropTypes.string,
};

export default QuoteCard;
