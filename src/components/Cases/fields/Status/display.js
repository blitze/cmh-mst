import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { format } from 'date-fns';

import Dropdown from '../../../Dropdown';

function StatusDisplay({ field, value, row, statuses, recomputeHeights }) {
	const updateStatus = status => {
		row.update({
			status,
			lastTouched: new Date(),
		});
		recomputeHeights();
	};

	const status = statuses.byIds.get(row.timedStatus);

	const title = row.lastTouched
		? format(row.lastTouched, 'EEEE, MMMM do yyyy, h:mm:ss a')
		: '';

	const dispProps = {
		className: 'badge badge-pill badge-primary py-1',
		style: { background: status.color },
		title,
	};

	const handleClick = e => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleStatusChange = (status, close) => e => {
		e.preventDefault();

		updateStatus(status);
		close();
	};

	return (
		<Dropdown
			onClick={handleClick}
			renderTrigger={toggle => (
				<a href="/" {...dispProps} onClick={toggle}>
					{status.text}
				</a>
			)}
			renderContent={close => {
				return statuses.selectables.map(row => {
					const style = {
						background: row.color,
					};
					return (
						<a
							key={row.id}
							className="dropdown-item d-flex align-items-center"
							onClick={handleStatusChange(row.id, close)}
							href="/"
						>
							<span className="badge mr-2 p-2" style={style}>
								{' '}
							</span>
							{row.text}
						</a>
					);
				});
			}}
		/>
	);
}

StatusDisplay.propTypes = {
	field: PropTypes.string.isRequired,
	value: PropTypes.object.isRequired,
	row: PropTypes.object,
	statuses: PropTypes.object,
	recomputeHeights: PropTypes.func.isRequired,
};

export default inject('statuses')(observer(StatusDisplay));
