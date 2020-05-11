import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Dropdown from '../Dropdown';

function Alerts({ alerts }) {
	if (!alerts.items.length) return null;

	return (
		<Dropdown
			className="mx-2"
			renderTrigger={(ref, toggleDropdown) => (
				<a
					ref={ref}
					href="/"
					className="text-warning"
					onClick={toggleDropdown}
				>
					<i className="fa fa-bell mr-1" />
					{alerts.items.length}
				</a>
			)}
			renderContent={(
				ref,
				style,
				placement,
				isDropped,
				toggleDropdown,
			) => (
				<Dropdown.Popover
					title="Alerts"
					show={isDropped}
					style={style}
					data-placement={placement}
					innerRef={ref}
				>
					<div className="list-group">
						{alerts.items.map((row, i) => (
							<a
								key={i}
								href="/"
								className="list-group-item list-group-item-action"
							>
								{row.entry.caseId}
							</a>
						))}
					</div>
				</Dropdown.Popover>
			)}
		/>
	);
}

Alerts.propTypes = {
	alerts: PropTypes.object,
};

export default inject('alerts')(observer(Alerts));
