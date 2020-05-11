import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { DATE_RANGES } from '../../../../constants';

const DateTimeFilter = ({
	selected,
	header,
	field,
	applyFilter,
	recomputeHeights,
	close,
}) => {
	const handleClick = value => e => {
		e.preventDefault();
		applyFilter(field, value);
		recomputeHeights();
		close();
	};
	return (
		<div className="list-group list-group-flush">
			{DATE_RANGES.filter(
				d => d.range === header.dateRange || d.range === 'both',
			).map(row => (
				<a
					key={row.id}
					href="/"
					className="list-group-item list-group-item-action list-group-item-light d-flex justify-content-between align-items-center py-1"
					onClick={handleClick(row.value)}
				>
					{row.title}
					{selected === row.value && (
						<i className="fa fa-chevron-right pull-right" />
					)}
				</a>
			))}
		</div>
	);
};

DateTimeFilter.propTypes = {
	selected: PropTypes.string,
	header: PropTypes.object,
	field: PropTypes.string.isRequired,
	applyFilter: PropTypes.func.isRequired,
	recomputeHeights: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
};

export default observer(DateTimeFilter);
