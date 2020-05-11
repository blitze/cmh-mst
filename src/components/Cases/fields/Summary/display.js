import React from 'react';
import PropTypes from 'prop-types';

const SummaryDisplay = ({ value }) => <span>{value}</span>;

SummaryDisplay.propTypes = {
	value: PropTypes.string,
};

export default SummaryDisplay;
