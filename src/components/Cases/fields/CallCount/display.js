import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

const CallCountDisplay = ({ value, row }) => (
	<span>
		{value} / {row.callBacks}
	</span>
);

CallCountDisplay.propTypes = {
	value: PropTypes.number.isRequired,
};

export default observer(CallCountDisplay);
