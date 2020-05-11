import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Progress = ({ value, bgClass = '' }) => {
	const style = {
		width: `${value}%`,
	};
	const className = classnames(
		'progress-bar progress-bar-striped progress-bar-animated',
		{ [bgClass]: true },
	);

	return (
		<div className="progress d-inline-flex w-75 py-0">
			<div
				className={className}
				role="progressbar"
				aria-valuenow={value}
				aria-valuemin="0"
				aria-valuemax="100"
				style={style}
			>
				{value}%
			</div>
		</div>
	);
};

Progress.propTypes = {
	value: PropTypes.number,
	bgClass: PropTypes.string,
};

export default Progress;
