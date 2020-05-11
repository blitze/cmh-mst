import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';

import { getHeaderProps, getFilterStackedCaseIds } from '../../../utils';
import Dropdown from '../../Dropdown';
import * as fields from '../fields';
import SortLink from './SortLink';

const HeaderItemFilter = ({ cases, header, recomputeHeights }) => {
	const { field, type } = header;
	const Filter = fields[type].filter;

	return (
		<Dropdown
			className="d-inline-block"
			renderTrigger={toggle => (
				<a href="/" onClick={toggle}>
					<i
						className={
							'fa fa-filter ' +
							(cases.filters[field]
								? cases.filterKeys[0] === field
									? 'text-primary'
									: 'text-success'
								: 'text-muted')
						}
					/>
				</a>
			)}
			renderContent={(close, isOpen) =>
				isOpen && (
					<Filter
						from="header"
						field={field}
						header={header}
						cases={getFilterStackedCaseIds(field, cases)}
						selected={cases.filters[field]}
						applyFilter={cases.applyFilter}
						recomputeHeights={recomputeHeights}
						close={close}
					/>
				)
			}
		/>
	);
};

function Header({ cases, user, recomputeHeights }) {
	const showSortIcon = ({ field, sortable }) => {
		if (!sortable) {
			return;
		}

		const key = cases.sorting.get('field');
		const dir = cases.sorting.get('dir');
		const dirKeys = { a: 'up', d: 'down' };
		const className = classnames({
			fa: true,
			[`fa-chevron-${dirKeys[dir]}`]: true,
			invisible: field !== key,
		});

		return <i className={className} />;
	};

	const showHeader = ({ field, text, title, sortable }) => {
		return sortable ? (
			<SortLink
				className="mx-1"
				title={title}
				field={field}
				applySorting={cases.applySorting}
				recomputeHeights={recomputeHeights}
			>
				{text}
			</SortLink>
		) : (
			<span title={title} className="mx-1">
				{text}
			</span>
		);
	};

	return (
		<nav className="navbar sticky-top navbar-light bg-light my-1">
			<div className="d-flex align-items-center">
				<div className="flex-grow-1 row text-nowrap text-info">
					{user.headers.map(headerId => {
						const header = getHeaderProps(cases.group, headerId);
						const {
							align = 'center',
							size,
							mobile = false,
						} = header;
						const className = classnames({
							[`col col-md-${size}`]: true,
							[`text-${align}`]: true,
							'd-none d-md-block': !mobile,
							'px-0': align === 'center',
						});
						return (
							<div key={headerId} className={className}>
								{showSortIcon(header)}
								{showHeader(header)}
								{fields[header.type].filter && (
									<HeaderItemFilter
										header={header}
										cases={cases}
										recomputeHeights={recomputeHeights}
									/>
								)}
							</div>
						);
					})}
				</div>
				<a href="/">
					<i className="fa fa-chevron-up" />
				</a>
			</div>
		</nav>
	);
}

Header.propTypes = {
	cases: PropTypes.object,
	user: PropTypes.object,
	recomputeHeights: PropTypes.func.isRequired,
};

export default inject('cases', 'user')(observer(Header));
