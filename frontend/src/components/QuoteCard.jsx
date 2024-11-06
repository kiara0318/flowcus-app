import React from "react";
import {Card, CardContent, Typography} from "@mui/material";
import PropTypes from "prop-types";
import "./styles/QuoteCard.css";

/**
 * QuoteCard component displays a quote and its author.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.quote - The text of the quote to be displayed.
 * @param {string} [props.author="Unknown"] - The author of the quote. Defaults to "Unknown" if not provided.
 * @returns {JSX.Element} Rendered Card component containing the quote and author.
 */
const QuoteCard = ({quote, author = "Unknown"}) => (
    <Card className="quote-card">
        <CardContent className="quote-card-content">
            <Typography variant="h6" className="quote-title">
                Quote of the Day
            </Typography>
            <Typography variant="body1" className="quote-text">
                &quot;{quote}&quot;
            </Typography>
            <Typography variant="body2" className="quote-author">
                {author}
            </Typography>
        </CardContent>
    </Card>
);

QuoteCard.propTypes = {
    quote: PropTypes.string.isRequired,
    author: PropTypes.string,
};

export default QuoteCard;
