import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { getHeaderProps } from '../../../../utils';
import DateTimePicker from '../../../DateTimePicker';
import DateTime from '../../fields/DateTime/display';
import Person from '../../fields/Person/display';
import Tickets from '../../fields/Tickets/display';

function Footer({ row }) {
	const handleDateChange = field => date => {
		row.update({ [field]: date });
	};

	const handleTicketChange = tickets => {
		row.update({ tickets });
	};

	const { field, text } = getHeaderProps(row.group, 'ab');
	const today = new Date();

	return (
		<div className="position-relative row row-cols-1 row-cols-md-4 justify-content-between py-2">
			<div className="col-md-auto">
				<dl className="d-flex mb-0">
					<dt>Product:</dt>
					<dd className="ml-2 text-truncate">{row.product}</dd>
				</dl>
				<dl className="d-flex mb-0">
					<dt>Case Type:</dt>
					<dd className="ml-2 text-truncate">{row.caseType}</dd>
				</dl>
				<dl className="d-flex mb-0">
					<dt>Sub Type:</dt>
					<dd className="ml-2 text-truncate">{row.subType}</dd>
				</dl>
			</div>
			<div className="col-md-auto">
				<dl className="d-flex mb-0">
					<dt>Started:</dt>
					<dd className="ml-2 text-truncate">
						<DateTime value={row.insertDate} />
					</dd>
				</dl>
				<dl className="d-flex mb-0">
					<dt>Updated:</dt>
					<dd className="ml-2 text-truncate">
						<DateTime value={row.updateDate} />
					</dd>
				</dl>
				<dl className="d-flex mb-0">
					<dt>Assigned:</dt>
					<dd className="ml-2 text-truncate">
						<DateTime value={row.assignedDate} />
						<DateTimePicker
							className="d-inline ml-1"
							maxDate={today}
							selected={row.assignedDate}
							onChange={handleDateChange('assignedDate')}
						/>
					</dd>
				</dl>
			</div>
			<div className="col-md-auto">
				<dl className="d-flex mb-0">
					<dt className="text-nowrap">Started By:</dt>
					<dd className="ml-2 text-truncate">
						<Person
							field="insertByName"
							row={row}
							value={row.insertByName}
						/>
					</dd>
				</dl>
				<dl className="d-flex mb-0">
					<dt className="text-nowrap">Updated By:</dt>
					<dd className="ml-2 text-truncate">
						<Person
							field="updateByName"
							row={row}
							value={row.updateByName}
						/>
					</dd>
				</dl>
				<dl className="d-flex mb-0">
					<dt className="text-nowrap">{text}:</dt>
					<dd className="ml-2 text-truncate">
						<Person field={field} row={row} value={row[field]} />
					</dd>
				</dl>
			</div>
			<div className="col-md-auto position-static">
				<dl className="d-flex mb-0">
					<dt>Due:</dt>
					<dd className="ml-2 text-truncate">
						<DateTime value={row.dueDate} />
						<DateTimePicker
							className="d-inline ml-1"
							minDate={today}
							selected={row.dueDate}
							onChange={handleDateChange('customDueDate')}
						/>
					</dd>
				</dl>
				<dl className="d-flex mb-0">
					<dt>Touched:</dt>
					<dd className="ml-2 text-truncate">
						<DateTime value={row.lastTouched} />
					</dd>
				</dl>
				<dl className="d-flex mb-0">
					<dt>Ticket:</dt>
					<dd className="mb-0 ml-2">
						<Tickets
							value={row.tickets}
							onSave={handleTicketChange}
						/>
					</dd>
				</dl>
			</div>
		</div>
	);
}

Footer.propTypes = {
	row: PropTypes.object.isRequired,
};

export default observer(Footer);
