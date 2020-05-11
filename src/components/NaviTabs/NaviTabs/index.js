import React from 'react';
import PropTypes from 'prop-types';

import '../style.css';

const NaviTabs = ({ children, direction = 'horizontal' }) => (
	<div
		className={
			direction === 'vertical' ? 'd-flex flex-row mt-2 vertical-tabs' : ''
		}>
		{children}
	</div>
);

NaviTabs.propTypes = {
	children: PropTypes.node.isRequired,
	direction: PropTypes.string,
};

export default NaviTabs;
