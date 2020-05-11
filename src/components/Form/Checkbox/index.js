import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ name, onChange, children, options = [] }) => {
	const handleChange = e =>
		onChange({
			target: {
				name,
				value: e.target.checked ? 1 : 0,
			},
		});
	return (
		<div className="form-group row align-items-center">
			<label className="col-sm-3 col-form-label">{children}</label>
			<div className="col">
				{options.map((option, i) => {
					const id = `checkbox-${name}-${option.value}`;
					return (
						<div key={i} className="custom-control custom-checkbox">
							<input
								type="checkbox"
								className="custom-control-input"
								id={id}
								name={name}
								value={option.value}
								onChange={handleChange}
							/>
							<label
								htmlFor={id}
								className="custom-control-label"
							>
								{option.label}
							</label>
						</div>
					);
				})}
			</div>
		</div>
	);
};

Checkbox.propTypes = {
	name: PropTypes.string,
	options: PropTypes.array.isRequired,
	onChange: PropTypes.func,
	children: PropTypes.node,
};

export default Checkbox;
