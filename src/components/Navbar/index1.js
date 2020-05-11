import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { Link, useRouteMatch } from 'react-router-dom';

import Alerts from '../Alerts';
import Tools from '../Tools';
import Dropdown from '../Dropdown';

const settingsOptions = ['General', 'Groups', 'Statuses', 'Resources'];

const settingsList = hideDropdown =>
	settingsOptions.map((option, i) => (
		<NavLink
			key={i}
			className="dropdown-item"
			activeClassName="active"
			to={`/settings/${option.toLowerCase()}`}
			onClick={hideDropdown}
		>
			{option}
		</NavLink>
	));

const groupsList = list => hideDropdown =>
	list.map(row => (
		<NavLink
			key={row.id}
			to={'/group/' + row.id}
			onClick={hideDropdown}
			className="dropdown-item"
			activeClassName="active"
		>
			{row.name}
		</NavLink>
	));

const NavLink = ({ itemClass, className, to, exact, children, ...rest }) => {
	const match = useRouteMatch({
		path: to,
		exact,
	});

	const classes = {
		list: classnames('nav-item', {
			[itemClass]: !!itemClass,
			active: match,
		}),
		link: classnames('nav-link', {
			[className]: !!className,
		}),
	};

	return (
		<li className={classes.list}>
			<Link className={classes.link} to={to} {...rest}>
				{children}
			</Link>
		</li>
	);
};

const DropdownItem = ({
	to,
	title,
	icon,
	listFunc,
	children,
	itemClass = 'dropdown',
	dropdownClass,
}) => (
	<Dropdown
		type={null}
		dropdownClass={dropdownClass}
		renderTrigger={toggle => (
			<NavLink
				itemClass={itemClass}
				path={to}
				className="dropdown-toggle"
				onClick={toggle}
				to={to}
			>
				<i className={`fa fa-${icon} mr-1`} />
				{title}
			</NavLink>
		)}
		renderContent={close => children || listFunc(close)}
	/>
);

function Navbar({ groups, user }) {
	const [showNav, setShowNav] = useState(false);

	const collapseClasses = classnames({
		'collapse navbar-collapse offcanvas-collapse': true,
		show: showNav,
	});

	const toggleNav = e => {
		e.preventDefault();
		setShowNav(!showNav);
	};

	return (
		<header>
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
				<Link to="/" className="navbar-brand">
					ECS Case Management Helper
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					onClick={toggleNav}
					aria-controls="navbarText"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon" />
				</button>
				<Alerts />
				<div className={collapseClasses}>
					<ul className="navbar-nav ml-auto">
						{user.isSet && !user.isManager && (
							<NavLink to="/" exact>
								<i className="fa fa-home mr-1" />
								My Cases
							</NavLink>
						)}

						{groups.isSet && (
							<DropdownItem
								to="/group"
								icon="users"
								title="Groups"
								listFunc={groupsList(groups.list)}
							/>
						)}

						{((user.isSet && !user.isManager) || groups.isSet) && (
							<>
								<DropdownItem
									itemClass={false}
									dropdownClass="w-100 rounded-0"
									to="/tools"
									icon="wrench"
									title="Tools"
								>
									<Tools />
								</DropdownItem>

								<DropdownItem
									to="/settings"
									icon="cog"
									title="Settings"
									listFunc={settingsList}
								/>
							</>
						)}

						<NavLink to="/about">
							<i className="fa fa-info mr-1" />
							About
						</NavLink>
					</ul>
				</div>
			</nav>
		</header>
	);
}

Navbar.propTypes = {
	groups: PropTypes.object,
	user: PropTypes.object,
};

export default inject('groups', 'user')(observer(Navbar));
