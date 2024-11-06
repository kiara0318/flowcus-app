import React from "react";
import "./styles/Marquee.css";
import PropTypes from "prop-types";

/**
 * Marquee component displays a scrolling text animation.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.text - The text to display in the marquee.
 * @param {Function} [props.onAnimationEnd] - Optional callback function triggered when the animation ends.
 * @param {string} [props.className] - Optional additional class name for custom styling.
 * @returns {JSX.Element} Rendered Marquee component.
 */
const Marquee = ({text, onAnimationEnd, className = ""}) => {
    return (
        <div className={className} onAnimationEnd={onAnimationEnd}>
            <div className="marquee-content">{text}</div>
        </div>
    );
};

Marquee.propTypes = {
    text: PropTypes.string.isRequired,
    onAnimationEnd: PropTypes.func,
    className: PropTypes.string,
};

export default Marquee;


