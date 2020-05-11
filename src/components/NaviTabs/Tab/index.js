import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';

const Tab = ({ children, className, ...rest }) => {
	const classNames = classnames('nav-link', {
		[className]: !!className,
	});

	return (
		<li className="nav-item">
			<NavLink
				{...rest}
				className={classNames}
				role="tab"
				activeClassName="active"
			>
				{children}
			</NavLink>
		</li>
	);
};

Tab.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

export default Tab;
