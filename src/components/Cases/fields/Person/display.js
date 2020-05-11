import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import EasyEdit, { Types } from 'react-easy-edit';

const handleClick = e => e.stopPropagation();

function CustomDisplay({ field, value, row }) {
	const titles = {
		assignedByName: '- Updated',
		assignToName: '- Status',
		insertByName: '- Question',
		updateByName: '',
	};

	const mailTo = `mailto:${row[field]}?subject=${row.caseId} ${
		titles[field]
	}`;

	return (
		<>
			<a href={mailTo} className="mr-2" onClick={handleClick}>
				<i className="fa fa-envelope-o" />
			</a>
			<span>{value}</span>
		</>
	);
}

function PersonDisplay({ field, value, row }) {
	const handleChange = value => row.update({ [field]: value });

	if (field !== 'assignedByName') {
		return <CustomDisplay field={field} value={value} row={row} />;
	}

	return (
		<div className="d-inline-block" onClick={handleClick}>
			<EasyEdit
				type={Types.TEXT}
				value={value}
				onSave={handleChange}
				displayComponent={
					<CustomDisplay field={field} value={value} row={row} />
				}
				attributes={{
					className: 'form-control d-inline py-0 m-0',
					style: { height: 'auto' },
					title: 'Enter to save, Esc to cancel',
				}}
				viewAttributes={{ className: 'd-inline' }}
				hideSaveButton={true}
				hideCancelButton={true}
			/>
		</div>
	);
}

PersonDisplay.propTypes = {
	field: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	row: PropTypes.object.isRequired,
};

export default observer(PersonDisplay);
