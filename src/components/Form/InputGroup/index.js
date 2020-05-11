import React from 'react';
import PropTypes from 'prop-types';

const InputGroup = ({ children, value, ...rest }) => (
	<div className="input-group mb-4">
		<input
			type="text"
			className="form-control"
			defaultValue={value}
			{...rest}
		/>
		<div className="input-group-append">{children}</div>
	</div>
);

InputGroup.propTypes = {
	children: PropTypes.node,
	value: PropTypes.string,
};

export default InputGroup;
