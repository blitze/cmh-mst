import React from 'react';
import PropTypes from 'prop-types';

const Select = ({ children, options = [], value, ...rest }) => (
	<div className="form-group row">
		<label className="col-sm-3 col-form-label">{children}</label>
		<div className="col">
			<select className="custom-select" defaultValue={value} {...rest}>
				{options.map((option, i) => (
					<option key={i} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	</div>
);

Select.propTypes = {
	children: PropTypes.node,
	options: PropTypes.array.isRequired,
	value: PropTypes.string,
};

export default Select;
