import React from "react";
import PropTypes from "prop-types";
import {QuoteCard} from "./index";

/**
 * QuoteDisplay component is responsible for displaying a daily quote.
 *
 * @param {Object} dailyQuote - The daily quote object.
 * @param {string} dailyQuote.author - The author of the quote.
 * @param {string} dailyQuote.quote - The text of the quote.
 * @returns {JSX.Element} Rendered QuoteCard component displaying the quote and author.
 */
const QuoteDisplay = ({dailyQuote}) => {
    const {author, quote} = dailyQuote;
    return <QuoteCard quote={quote} author={author}/>;
};

QuoteDisplay.propTypes = {
    dailyQuote: PropTypes.shape({
        author: PropTypes.string,
        quote: PropTypes.string,
    }).isRequired,
};

export default QuoteDisplay;


