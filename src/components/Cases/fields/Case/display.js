import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { config } from '../../../../utils';

function CaseDisplay({ value, row }) {
	const handleClick = e => e.stopPropagation();

	return (
		<a
			href={config.caseUrl + value}
			target={value}
			className="text-nowrap"
			title={row.problem}
			onClick={handleClick}
		>
			{value}
		</a>
	);
}

CaseDisplay.propTypes = {
	value: PropTypes.string.isRequired,
	row: PropTypes.object.isRequired,
};

export default observer(CaseDisplay);
