import React from 'react';
import PropTypes from 'prop-types';

const CustomInput = ({ label, children, ...rest }) => {
	const childWithProp = React.Children.map(children, child => {
		return React.cloneElement(child, {
			...child.props,
			...rest,
		});
	});
	return (
		<div className="form-group row align-items-center">
			<label className="col-sm-3 col-form-label">{label}</label>
			<div className="col">{childWithProp}</div>
		</div>
	);
};

CustomInput.propTypes = {
	children: PropTypes.node,
	label: PropTypes.string,
};

export default CustomInput;
