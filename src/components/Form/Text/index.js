import React from 'react';
import PropTypes from 'prop-types';

const Text = ({ type = 'text', placeholder, children, value, ...rest }) => (
	<div className="form-group row">
		<label className="col-sm-3 col-form-label">{children}</label>
		<div className="col">
			<input
				type={type}
				className="form-control"
				placeholder={placeholder}
				defaultValue={value}
				{...rest}
			/>
		</div>
	</div>
);

Text.propTypes = {
	type: PropTypes.string,
	placeholder: PropTypes.string,
	value: PropTypes.string,
	children: PropTypes.node,
};

export default Text;
