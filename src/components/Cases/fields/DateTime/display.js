import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { format } from 'date-fns';
import TimeAgo from 'react-timeago';

function DateTimeDisplay({ value }) {
	return value ? (
		<TimeAgo
			date={value}
			title={format(value, 'EEEE, MMMM do yyyy, h:mm:ss a')}
		/>
	) : (
		'--'
	);
}

DateTimeDisplay.propTypes = {
	value: PropTypes.object,
};

export default observer(DateTimeDisplay);
