import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { Link, NavLink, useRouteMatch } from 'react-router-dom';

import Alerts from '../Alerts';
import Tools from '../Tools';
import { useOutsideClick } from '../../hooks';

const settingsOptions = ['General', 'Groups', 'Statuses', 'Resources'];

// const settingsList = hideDropdown =>
// 	settingsOptions.map((option, i) => (
// 		<NavLink
// 			key={i}
// 			className="dropdown-item"
// 			activeClassName="active"
// 			to={`/settings/${option.toLowerCase()}`}
// 			onClick={hideDropdown}
// 		>
// 			{option}
// 		</NavLink>
// 	));

// const groupsList = list => hideDropdown =>
// 	list.map(row => (
// 		<NavLink
// 			key={row.id}
// 			to={'/group/' + row.id}
// 			onClick={hideDropdown}
// 			className="dropdown-item"
// 			activeClassName="active"
// 		>
// 			{row.name}
// 		</NavLink>
// 	));

const NavItem = ({
	itemClass,
	className,
	to,
	title,
	icon,
	exact,
	children,
	...rest
}) => {
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
			<Link
				id={`navitem${to}`}
				className={classes.link}
				to={to}
				{...rest}
				aria-haspopup="true"
				aria-expanded="false"
			>
				<i className={`fa fa-${icon} mr-1`} />
				{title}
			</Link>
			{children}
		</li>
	);
};

const DropdownItem = ({
	to,
	children,
	itemClass = 'dropdown',
	dropdownClass,
	...rest
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const ref = React.useRef();

	const toggle = e => {
		e.preventDefault();
		setIsOpen(!isOpen);
	};

	const close = () => setIsOpen(false);

	const className = classnames('dropdown-menu shadow', {
		[dropdownClass]: !!dropdownClass,
		show: isOpen,
	});

	useOutsideClick(ref.current, isOpen, close);

	return (
		<NavItem
			itemClass={itemClass}
			className="dropdown-toggle"
			onClick={toggle}
			to={to}
			{...rest}
		>
			<div
				ref={ref}
				className={className}
				style={{ zIndex: 2000 }}
				aria-labelledby={`navitem${to}`}
			>
				{children(close)}
			</div>
		</NavItem>
	);
};

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
							<NavItem
								to="/"
								icon="home"
								title="My Cases"
								exact
							/>
						)}

						{groups.isSet && (
							<DropdownItem
								to="/group"
								icon="users"
								title="Groups"
							>
								{close =>
									groups.list.map(row => (
										<NavLink
											key={row.id}
											to={'/group/' + row.id}
											onClick={close}
											className="dropdown-item"
											activeClassName="active"
										>
											{row.name}
										</NavLink>
									))
								}
							</DropdownItem>
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
									{close => <Tools />}
								</DropdownItem>

								<DropdownItem
									to="/settings"
									icon="cog"
									title="Settings"
								>
									{close =>
										settingsOptions.map((option, i) => (
											<NavLink
												key={i}
												className="dropdown-item"
												activeClassName="active"
												to={`/settings/${option.toLowerCase()}`}
												onClick={close}
											>
												{option}
											</NavLink>
										))
									}
								</DropdownItem>
							</>
						)}

						<NavItem to="/about" icon="info" title="About" />
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
