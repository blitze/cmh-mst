import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import EasyEdit, { Types } from 'react-easy-edit';

import ColorPicker from '../../../components/ColorPicker';
import { REMINDERS, STATUSES } from '../../../constants';
import {
	Form,
	Select,
	Text,
	Button,
	Checkbox,
	CustomInput,
} from '../../../components/Form';

function Toggler({ id = 'id', field, value, onSave }) {
	const handleChange = e => onSave({ [field]: !value });
	const key = `switch-${id}-${field}`;

	return (
		<div className="custom-control custom-switch">
			<input
				id={key}
				className="custom-control-input"
				type="checkbox"
				name={field}
				value={value}
				checked={!!value}
				onChange={handleChange}
			/>
			<label className="custom-control-label" htmlFor={key} />
		</div>
	);
}

const reminderOptions = Object.values(REMINDERS);

function StatusSettings({ statuses }) {
	const handleSave = (field, row) => value => row.update({ [field]: value });

	return (
		<div className="row">
			<div className="col-sm mb-3">
				<div className="table-responsive-sm">
					<table className="table table-bordered">
						<thead className="thead-light">
							<tr>
								<th scope="col">Status</th>
								<th scope="col">Reminder</th>
								<th scope="col">Show</th>
								<th scope="col">Selectable</th>
								<th scope="col" />
							</tr>
						</thead>
						<tbody>
							{statuses.list.map(row => {
								const isDefaultStatus = !!STATUSES[row.id];
								return (
									<tr key={row.id}>
										<td>
											<div className="d-flex align-items-center">
												<ColorPicker
													color={row.color}
													name="color"
													onChange={row.update}
												/>
												{!isDefaultStatus ? (
													<EasyEdit
														type={Types.TEXT}
														value={row.text}
														attributes={{
															className:
																'form-control',
														}}
														onSave={handleSave(
															'text',
															row,
														)}
													/>
												) : (
													row.text
												)}
											</div>
										</td>
										<td className="align-middle">
											<EasyEdit
												type={Types.SELECT}
												value={row.reminder}
												attributes={{
													className: 'form-control',
												}}
												options={reminderOptions}
												onSave={handleSave(
													'reminder',
													row,
												)}
											/>
										</td>
										<td>
											<div className="d-flex justify-content-center align-items-center">
												<Toggler
													id={row.id}
													field="active"
													value={!!row.active}
													onSave={row.update}
												/>
											</div>
										</td>
										<td>
											<div className="d-flex justify-content-center align-items-center">
												<Toggler
													id={row.id}
													field="selectable"
													value={!!row.selectable}
													onSave={row.update}
												/>
											</div>
										</td>
										<td>
											{!isDefaultStatus && (
												<button
													type="button"
													className="close"
													aria-label="Close"
													onClick={row.delete}
												>
													<span aria-hidden="true">
														&times;
													</span>
												</button>
											)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
			<div className="col-sm mb-3">
				<div className="card">
					<div className="card-header">Add New Status</div>
					<div className="card-body">
						<Form onSubmit={statuses.add} reset>
							<Text name="text">Status</Text>
							<Select name="reminder" options={reminderOptions}>
								Reminder
							</Select>
							<CustomInput name="color" label="Color">
								<ColorPicker />
							</CustomInput>
							<Checkbox
								name="active"
								value={false}
								options={[{ value: 1, label: '' }]}
							>
								Filter
							</Checkbox>
							<Checkbox
								name="selectable"
								value={false}
								options={[{ value: 1, label: '' }]}
							>
								Selectable
							</Checkbox>
							<Button type="submit" className="btn btn-primary">
								Submit
							</Button>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
}

StatusSettings.propTypes = {
	statuses: PropTypes.object.isRequired,
};

export default inject('statuses')(observer(StatusSettings));
