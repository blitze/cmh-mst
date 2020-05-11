import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import EasyEdit, { Types } from 'react-easy-edit';

const DisplayRow = observer(({ row, field, renderer, onDelete }) => {
	const handleClick = e => {
		e.stopPropagation();
		onDelete();
	};
	return (
		<>
			<div>{renderer(row) || row[field]}</div>
			<button
				type="button"
				className="close"
				aria-label="Close"
				onClick={handleClick}
			>
				<span aria-hidden="true">&times;</span>
			</button>
		</>
	);
});

function ListItem({
	inNav,
	row,
	field,
	editorType,
	renderer,
	onSave,
	onDelete,
}) {
	const hideButtons = editorType !== 'TEXTAREA';
	return (
		<li className={!inNav ? 'list-group-item' : ''}>
			<EasyEdit
				type={Types[editorType]}
				value={row[field]}
				onSave={onSave(row)}
				attributes={{
					className: 'form-control',
				}}
				viewAttributes={{
					className:
						'd-flex justify-content-between align-items-start',
				}}
				displayComponent={
					<DisplayRow
						row={row}
						field={field}
						renderer={renderer}
						onDelete={onDelete(row)}
					/>
				}
				hideSaveButton={hideButtons}
				hideCancelButton={hideButtons}
			/>
		</li>
	);
}

ListItem.propTypes = {
	inNav: PropTypes.bool,
	row: PropTypes.object,
	field: PropTypes.string,
	editorType: PropTypes.string.isRequired,
	renderer: PropTypes.func,
	onSave: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};

ListItem.defaultProps = {
	renderer: f => null,
};

export default observer(ListItem);
