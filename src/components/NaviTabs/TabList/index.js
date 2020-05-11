import React from 'react';
import PropTypes from 'prop-types';

const TabList = props => (
	<ul className="nav nav-tabs" role="navigation">
		{props.children}
	</ul>
);

TabList.propTypes = {
	children: PropTypes.node.isRequired,
};

export default TabList;
