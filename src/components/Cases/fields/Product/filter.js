import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { getProducts, setNestedObject } from './selector';

function ProductFilter({
	field,
	selected = {},
	cases,
	applyFilter,
	recomputeHeights,
}) {
	const handleChange = (cat, path, numSiblings) => e => {
		function getPath(p, o) {
			return p.reduce((xs, x) => xs[x], o);
		}

		let delKey;
		if (e.target.checked) {
			const obj = getPath(path, selected);
			const numSelectedSibblings = Object.keys(obj).length + 1;
			// here we are trying to avoid adding unnecessary filters
			// If all children of a branch are selected,
			// we only need to filter by the parent
			if (numSelectedSibblings < numSiblings) {
				path = [...path, cat];
			} else if (!path.length) {
				selected = {};
			}
		} else {
			delKey = cat;
		}

		setNestedObject(selected, path, delKey);

		applyFilter(field, selected);
		recomputeHeights();
	};

	const showOptions = (object, products = {}, path = []) => {
		if (path.length && Object.keys(object).length < 2) return null;

		return (
			<ul className="list-group list-group-flush">
				{Object.keys(object)
					.sort()
					.map((cat, i) => (
						<li key={i} className="list-group-item py-1 pr-0">
							<div className="d-flex justify-content-between align-items-center">
								<div className="form-check mr-3">
									<label className="form-check-label">
										<input
											className="form-check-input"
											type="checkbox"
											checked={!!products[cat]}
											value="1"
											onChange={handleChange(
												cat,
												path,
												Object.keys(object).length,
											)}
										/>
										{cat}
									</label>
								</div>
								<div className="badge badge-info badge-pill pull-right">
									{object[cat].count}
								</div>
							</div>
							{products[cat] &&
								showOptions(object[cat].types, products[cat], [
									...path,
									cat,
								])}
						</li>
					))}
			</ul>
		);
	};

	return (
		<div
			className="my-2 mr-3"
			style={{ maxHeight: 450, overflowY: 'auto' }}
		>
			{showOptions(getProducts(cases), selected)}
		</div>
	);
}

ProductFilter.propTypes = {
	cases: PropTypes.array,
	selected: PropTypes.object,
	field: PropTypes.string.isRequired,
	applyFilter: PropTypes.func.isRequired,
	recomputeHeights: PropTypes.func.isRequired,
};

export default observer(ProductFilter);
