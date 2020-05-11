import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { FLAGS } from '../../../../constants';
import Dropdown from '../../../Dropdown';
import List from './List';

function Flag({
	flag,
	updateFlag,
	className,
	color = 'success',
	defaultFlag = 'fg',
}) {
	const toggleFlag = () => {
		const flagId = !flag ? defaultFlag : '';
		updateFlag({ flag: flagId });
	};

	const handleClick = close => flag => {
		updateFlag({ flag });
		close();
	};

	return (
		<Dropdown
			className={`btn-group ${className}`}
			renderTrigger={toggle => (
				<>
					<button
						type="button"
						className={`btn btn-${color}`}
						onClick={toggleFlag}
					>
						<i className="fa fa-flag mr-1" />
						{flag ? FLAGS[flag].title : 'Flag It!'}
					</button>
					<button
						type="button"
						className={`btn btn-${color} dropdown-toggle dropdown-toggle-split`}
						onClick={toggle}
					>
						<span className="sr-only">Toggle Dropdown</span>
					</button>
				</>
			)}
			renderContent={close => (
				<List current={flag} onSelect={handleClick(close)} />
			)}
		/>
	);
}

Flag.propTypes = {
	className: PropTypes.string,
	color: PropTypes.string,
	flag: PropTypes.string.isRequired,
	updateFlag: PropTypes.func.isRequired,
	defaultFlag: PropTypes.string,
};

export default observer(Flag);
