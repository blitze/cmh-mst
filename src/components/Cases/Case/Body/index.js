import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Flag from '../../fields/Flag/display';
import Notes from '../../../Notes';
import WorkIt from '../../../WorkIt';

function Body({ row }) {
	return (
		<div>
			<div className="pull-right">
				<WorkIt className="d-inline-block mr-1" row={row} />
				<Notes className="d-inline-block mr-1" row={row} />
				<Flag
					className="mr-4"
					flag={row.flag}
					updateFlag={row.update}
				/>
			</div>
			<div className="clearfix" />
			<div>
				<strong>Problem:</strong>
				<p>{row.problem}</p>
			</div>
		</div>
	);
}

Body.propTypes = {
	row: PropTypes.object.isRequired,
};

export default observer(Body);
