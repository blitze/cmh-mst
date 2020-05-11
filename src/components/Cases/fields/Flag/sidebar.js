import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import List from './List';
import Card from '../../../Card';

function FlagSidebar({ selected = '', applyFilter }) {
	const onSelect = flagId => {
		applyFilter('flag', flagId);
	};

	return (
		<Card>
			<Card.Header>Filter By Flag</Card.Header>
			<List current={selected} onSelect={onSelect} />
		</Card>
	);
}

FlagSidebar.propTypes = {
	selected: PropTypes.string,
	applyFilter: PropTypes.func.isRequired,
};

export default observer(FlagSidebar);
