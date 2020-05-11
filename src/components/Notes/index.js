import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import EditableList from '../EditableList';
import { Form, InputGroup, Button } from '../Form';
import Dropdown from '../Dropdown';

function Notes({ row, className, color = 'danger' }) {
	const handleChange = note => text => note.update({ text });
	const handleDelete = note => () => note.delete();
	const handleSubmit = data => {
		row.addNote(data);
	};
	const renderRow = row => {
		const handleClick = e => e.stopPropagation();
		const handleChange = e => row.toggle();

		return (
			<div className="d-flex">
				<input
					className="flex-fill mt-2"
					type="checkbox"
					checked={!!row.done}
					onChange={handleChange}
					onClick={handleClick}
				/>
				<div className="flex-grow-1 mx-3">
					{row.done ? <s>{row.text}</s> : row.text}
				</div>
			</div>
		);
	};

	return (
		<Dropdown
			arrow
			className={className}
			dropdownClass="col-12 col-sm-5"
			renderTrigger={toggle => (
				<button
					type="button"
					className={`btn btn-${color}`}
					onClick={toggle}
				>
					My Notes{' '}
					<span className="badge badge-light">
						{row.notes.length}
					</span>
				</button>
			)}
			renderContent={() => (
				<div className="fw-editable p-3">
					<Form onSubmit={handleSubmit} reset>
						<InputGroup name="text" placeholder="Note...">
							<Button className="btn btn-info">Add</Button>
						</InputGroup>
					</Form>

					<EditableList
						field="text"
						editorType="TEXTAREA"
						list={row.notes}
						renderer={renderRow}
						changeHandler={handleChange}
						deleteHandler={handleDelete}
					/>
				</div>
			)}
		/>
	);
}

Notes.propTypes = {
	row: PropTypes.object.isRequired,
	className: PropTypes.string,
	color: PropTypes.string,
};

export default observer(Notes);
