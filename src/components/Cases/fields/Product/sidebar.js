import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Filter from './filter';
import Card from '../../../Card';

function ProductSidebar(props) {
	console.log('rnder sidebar item - products');
	return (
		<Card>
			<Card.Header>Filter By Product</Card.Header>
			<Filter {...props} />
		</Card>
	);
}

ProductSidebar.propTypes = {
	field: PropTypes.string.isRequired,
	selected: PropTypes.object,
	cases: PropTypes.array,
	applyFilter: PropTypes.func.isRequired,
};

export default observer(ProductSidebar);
