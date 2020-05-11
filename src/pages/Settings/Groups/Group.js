import React, { useState } from 'react';

function GroupItem({ selected, row, ...dragHandlerProps }) {
	const [editing, setEditing] = useState(false);
	const [name, setName] = useState(row.name);

	const toggleEdit = e => setEditing(!editing);
	const handleDelete = () => row.delete();
	const handleChange = e => setName(e.target.value);
	const handleSubmit = e => {
		e.preventDefault();
		row.update({ name });
		setEditing(false);
	};

	return (
		<div className="d-flex align-items-center">
			<div className="fa fa-arrows-v mx-3" {...dragHandlerProps} />
			<div className="d-flex justify-content-between align-items-center w-100">
				{!editing ? (
					<>
						<div className="d-flex align-items-center">
							{row.name}
						</div>
						{selected && (
							<div>
								<button
									className="btn btn-link p-1"
									type="button"
									onClick={toggleEdit}
								>
									<i className="fa fa-pencil" />
								</button>
								<button
									className="btn btn-link p-1"
									type="button"
									onClick={handleDelete}
								>
									<i className="fa fa-close" />
								</button>
							</div>
						)}
					</>
				) : (
					<form onSubmit={handleSubmit}>
						<input
							className="form-control col-11 d-inline mr-2"
							type="text"
							name="group"
							value={name}
							onChange={handleChange}
						/>
						<button
							className="btn btn-link p-0"
							type="button"
							onClick={toggleEdit}
						>
							<i className="fa fa-close" />
						</button>
					</form>
				)}
			</div>
		</div>
	);
}

export default GroupItem;
