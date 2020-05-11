import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { observer } from 'mobx-react';
// import { createSelectable } from 'react-selectable-fast';

import { FLAGS } from '../../../constants';

import Body from './Body';
import Footer from './Footer';
import Header from './Header';
import Notifier from '../../Notifier';

function Case({ row, collapsed, isVisible, toggleCollapse, recomputeHeights }) {
	const handleClick = caseId => e => {
		e.preventDefault();
		e.stopPropagation();
		toggleCollapse(caseId);
	};

	// const { selected, selecting, selectableRef } = this.props;

	// const active = selected || selecting;
	const color = row.flag ? FLAGS[row.flag].color : 'light';

	const cardClass = classnames({
		'card mb-1': true,
		'border border-info': collapsed,
	});

	const iconClass = classnames({
		fa: true,
		[`fa-chevron-${collapsed ? 'up' : 'down'}`]: true,
	});

	const listGroupClass = classnames({
		'list-group-item': true,
		'list-group-item-action': true,
		[`list-group-item-${color}`]: isVisible, //!active,
		// active: active,
		show: collapsed,
	});

	const panelClass = classnames({
		collapse: true,
		show: collapsed,
	});

	const styles = {
		list: { position: 'relative', cursor: 'pointer' },
	};
	// ref={selectableRef}

	return (
		<div className={cardClass}>
			<div
				className="list-group list-group-flush"
				onClick={handleClick(row.caseId)}
			>
				<div className={listGroupClass} style={styles.list}>
					{!isVisible ? (
						<div className="text-center w-100">Loading...</div>
					) : (
						<div className="d-flex align-items-center">
							<div className="flex-grow-1 row">
								<Header
									row={row}
									recomputeHeights={recomputeHeights}
								/>
							</div>
							<a href="/" onClick={handleClick(row.caseId)}>
								<i className={iconClass} />
							</a>
						</div>
					)}
				</div>
			</div>
			<div className={panelClass}>
				<div className="card-body flex-grow-1">
					<Body row={row} />
				</div>
				<div className="card-footer text-muted border-top-0">
					<Footer row={row} />
				</div>
			</div>
			<Notifier row={row} />
		</div>
	);
}

Case.propTypes = {
	row: PropTypes.object.isRequired,
	collapsed: PropTypes.bool.isRequired,
	isVisible: PropTypes.bool.isRequired,
	toggleCollapse: PropTypes.func.isRequired,
	recomputeHeights: PropTypes.func.isRequired,
};

export default observer(Case);
