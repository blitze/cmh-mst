import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames';

import * as fields from '../fields';
import Search from '../../Search';
import { getFilterStackedCaseIds } from '../../../utils';
import { useOutsideClick } from '../../../hooks';

let styles = {
	container: { right: 15, zIndex: 1030 },
	sidebar: { width: 350 },
	toggler: {
		width: '35px',
		cursor: 'pointer',
		top: 0,
		right: 0,
	},
};

function Sidebar({ cases, recomputeHeights }) {
	const [open, setOpen] = useState(false);
	const ref = useRef();

	const handleClick = e => {
		e.preventDefault();
		toggleSidebar();
	};

	const toggleSidebar = () => {
		setOpen(!open);
	};

	useOutsideClick(ref.current, open, () => setOpen(false));

	const containerClass = classnames({
		'row bg-light h-100': true,
		'position-absolute shadow': open,
	});

	const sidebarClass = classnames({
		'col pt-4': true,
		'd-none': !open,
	});

	return (
		<div ref={ref} className={containerClass} style={styles.container}>
			<div
				className="col-auto pt-3"
				style={styles.toggler}
				onClick={handleClick}
			>
				<i className="fa fa-bars" />
			</div>
			<div className={sidebarClass} style={styles.sidebar}>
				<Search applyFilter={cases.applyFilter} />
				{open &&
					Object.keys(fields).map((name, i) => {
						const SidebarItem = fields[name].sidebar;
						const field = name.toLowerCase();

						if (SidebarItem) {
							const filterCases = getFilterStackedCaseIds(
								field,
								cases,
							);
							return (
								<div className="my-2" key={i}>
									<SidebarItem
										field={field}
										cases={filterCases}
										selected={cases.filters[field]}
										applyFilter={cases.applyFilter}
										recomputeHeights={recomputeHeights}
										from="sidebar"
									/>
								</div>
							);
						}
						return null;
					})}
			</div>
		</div>
	);
}

Sidebar.propTypes = {
	cases: PropTypes.object.isRequired,
	recomputeHeights: PropTypes.func.isRequired,
};

export default inject('cases')(observer(Sidebar));
