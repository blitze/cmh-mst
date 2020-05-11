import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

function ProductDisplay({ value, row }) {
	return (
		<span title={`${value} > ${row.caseType} > ${row.subType}`}>
			{value}
		</span>
	);
}

ProductDisplay.propTypes = {
	value: PropTypes.string.isRequired,
	row: PropTypes.object.isRequired,
};

export default observer(ProductDisplay);
