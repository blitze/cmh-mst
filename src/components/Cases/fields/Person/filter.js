import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, decorate, observable } from 'mobx';

import { getPeople } from './selector';

class PersonFilter extends Component {
	static propTypes = {
		field: PropTypes.string.isRequired,
		selected: PropTypes.string,
		cases: PropTypes.array,
		applyFilter: PropTypes.func.isRequired,
		recomputeHeights: PropTypes.func.isRequired,
		close: PropTypes.func.isRequired,
	};

	selected = this.props.selected || '';

	handleChange = e => {
		this.selected = e.target.value;
		this.props.applyFilter(this.props.field, this.selected);
		this.props.recomputeHeights();
		this.props.close();
	};

	render() {
		const { cases, field } = this.props;
		const casesPerPerson = getPeople(field, cases);
		return (
			<div
				className="my-2 mr-3"
				style={{ maxHeight: 450, overflowY: 'auto' }}
			>
				<ul className="list-group list-group-flush">
					<li key="all" className="list-group-item py-1 pr-0">
						<div className="form-check mr-1">
							<label className="form-check-label">
								<input
									className="form-check-input"
									type="radio"
									name={this.props.field}
									value=""
									checked={false}
									onChange={this.handleChange}
								/>
								All
							</label>
						</div>
					</li>

					{Object.keys(casesPerPerson).map((name, i) => (
						<li
							key={i}
							className="list-group-item py-1 pr-0 d-flex justify-content-between"
						>
							<div className="form-check mr-2">
								<label className="form-check-label">
									<input
										className="form-check-input"
										type="radio"
										name={this.props.field}
										value={name}
										checked={this.selected === name}
										onChange={this.handleChange}
									/>
									{name}
								</label>
							</div>
							<div className="badge badge-info badge-pill">
								{casesPerPerson[name]}
							</div>
						</li>
					))}
				</ul>
			</div>
		);
	}
}

decorate(PersonFilter, {
	selected: observable,
	handleChange: action,
});

export default observer(PersonFilter);
