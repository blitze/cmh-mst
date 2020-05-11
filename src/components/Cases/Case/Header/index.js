import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';

import { getHeaderProps } from '../../../../utils';
import * as fields from '../../fields';

function Header({ row, user, recomputeHeights }) {
	return (
		<>
			{user.headers.map(headerId => {
				const {
					field,
					size,
					type,
					align = 'center',
					mobile = false,
				} = getHeaderProps(row.group, headerId);

				if (!fields[type]) return null;

				const Display = fields[type].display;
				const className = classnames({
					[`col col-md-${size}`]: true,
					[`text-${align}`]: true,
					'd-none d-md-block': !mobile,
					'text-truncate': field !== 'status',
					'text-dark': true,
				});

				return (
					<div key={headerId} className={className}>
						<Display
							value={row[field]}
							field={field}
							row={row}
							recomputeHeights={recomputeHeights}
						/>
					</div>
				);
			})}
		</>
	);
}

Header.propTypes = {
	row: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
};

export default inject('user')(observer(Header));
