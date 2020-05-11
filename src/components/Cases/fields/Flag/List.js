import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import { FLAGS } from '../../../../constants';

function List({ current, onSelect }) {
	const handleClick = flag => e => {
		e.preventDefault();
		onSelect(flag !== current ? flag : '');
	};

	return (
		<Fragment>
			{Object.keys(FLAGS).map(id => {
				const row = FLAGS[id];
				const className = classnames(
					'badge',
					{ [`badge-${row.color}`]: true },
					'mr-2 p-2',
				);
				return (
					<a
						key={id}
						className="dropdown-item d-flex align-items-center"
						onClick={handleClick(id)}
						href="/"
					>
						<span className={className}> </span>
						{row.title}
						{current === id && (
							<i className="fa fa-check pull-right ml-2" />
						)}
					</a>
				);
			})}
		</Fragment>
	);
}

List.propTypes = {
	current: PropTypes.string,
	onSelect: PropTypes.func.isRequired,
};

export default observer(List);
