import React from 'react';
import PropTypes from 'prop-types';

const SortLink = ({
	children,
	field,
	applySorting,
	recomputeHeights,
	...rest
}) => {
	const handleClick = e => {
		e.preventDefault();
		applySorting(field);
		recomputeHeights();
	};
	return (
		<a href="/" className="text-info" onClick={handleClick} {...rest}>
			{children}
		</a>
	);
};

SortLink.propTypes = {
	children: PropTypes.node,
	applySorting: PropTypes.func.isRequired,
	recomputeHeights: PropTypes.func.isRequired,
};

export default SortLink;
