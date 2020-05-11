import React from 'react';
import PropTypes from 'prop-types';

const TabPane = props => (
	<div className="tab-content w-100">
		<div className="tab-pane show active" role="tabpanel">
			{props.children}
		</div>
	</div>
);

TabPane.propTypes = {
	children: PropTypes.node.isRequired,
};

export default TabPane;
