import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { action, decorate, observable } from 'mobx';

function StatusFilter({ field, selected = [], cases, applyFilter, statuses }) {
	const handleChange = e => {
		const status = e.target.value;

		if (e.target.checked) {
			selected.push(status);
		} else {
			const index = selected.indexOf(status);
			if (index > -1) {
				selected.splice(index, 1);
			}
		}

		applyFilter(field, selected);
	};

	const clearAll = e => {
		e.preventDefault();

		applyFilter(field, []);
	};

	const resetSelected = e => {
		e.preventDefault();

		applyFilter(field, statuses.activeIds);
	};

	const statusCountsById = statuses.countCases(cases);

	return (
		<div className="my-0">
			<ul className="list-group list-group-flush w-100">
				<li className="list-group-item d-flex justify-content-between active align-items-center py-1">
					<a href="/" className="text-white" onClick={clearAll}>
						Clear All
					</a>
					<a href="/" className="text-white" onClick={resetSelected}>
						Reset
					</a>
				</li>
				{statuses.list.map(row => {
					const style = {
						background: row.color,
					};
					return (
						<li
							key={row.id}
							className="list-group-item d-flex justify-content-between align-items-center py-1 w-100"
						>
							<div className="form-check mr-1">
								<input
									className="form-check-input"
									type="checkbox"
									value={row.id}
									checked={selected.includes(row.id)}
									onChange={handleChange}
								/>
								<label className="form-check-label">
									{row.text}
								</label>
							</div>
							<span className="badge badge-info" style={style}>
								{statusCountsById[row.id] || 0}
							</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

StatusFilter.propTypes = {
	field: PropTypes.string.isRequired,
	cases: PropTypes.array,
	selected: PropTypes.array,
	statuses: PropTypes.object.isRequired,
	applyFilter: PropTypes.func.isRequired,
};

decorate(StatusFilter, {
	selected: observable,

	clearAll: action,
	handleChange: action,
	resetSelected: action,
});

export default inject('statuses')(observer(StatusFilter));
