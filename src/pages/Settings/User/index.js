import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import { ROLES } from '../../../constants';
import DnDColumns from '../../../components/DnDColumns';
import Purger from '../../../components/Purger';
import Sampler from '../../../components/Sampler';

const UserSettings = ({ user }) => {
	const handleChange = name => event => {
		user.update(name, event.target.value);
	};

	const handleRadioClick = name => event => {
		user.update(name, event.target.value !== 'false');
	};

	return (
		<>
			<div className="form-group row">
				<label htmlFor="role" className="col-sm-3 col-form-label">
					Select your Role:
				</label>
				<div className="col-sm-3">
					<select
						className="form-control"
						id="role"
						value={user.role}
						onChange={handleChange('role')}
					>
						{ROLES.map(option => (
							<option key={option.id} value={option.id}>
								{option.text}
							</option>
						))}
					</select>
				</div>
			</div>
			{user.role !== 'mg' && (
				<>
					<div className="form-group row">
						<label
							htmlFor="fName"
							className="col-sm-3 col-form-label"
						>
							First Name:
						</label>
						<div className="col-sm-3">
							<input
								id="fName"
								type="text"
								value={user.fName}
								className="form-control"
								onChange={handleChange('fName')}
							/>
						</div>
					</div>
					<div className="form-group row">
						<label
							htmlFor="lName"
							className="col-sm-3 col-form-label"
						>
							Last Name:
						</label>
						<div className="col-sm-3">
							<input
								id="lName"
								type="text"
								value={user.lName}
								className="form-control"
								onChange={handleChange('lName')}
							/>
						</div>
					</div>
				</>
			)}
			<div className="form-group row">
				<label
					htmlFor="trackPending"
					className="col-sm-3 col-form-label"
				>
					Track your 'Closed/Pending Fix' cases?
				</label>
				<div className="col-sm-9">
					<div className="form-check form-check-inline">
						<input
							type="radio"
							id="trackPendingYes"
							name="trackPending"
							value="true"
							checked={user.trackPending}
							onChange={handleRadioClick('trackPending')}
							className="form-check-input"
						/>
						<label
							className="form-check-label"
							htmlFor="trackPendingYes"
						>
							Yes
						</label>
					</div>
					<div className="form-check form-check-inline">
						<input
							type="radio"
							id="trackPendingNo"
							name="trackPending"
							value="false"
							checked={!user.trackPending}
							onChange={handleRadioClick('trackPending')}
							className="form-check-input"
						/>
						<label
							className="form-check-label"
							htmlFor="trackPendingNo"
						>
							No
						</label>
					</div>
				</div>
			</div>
			<div className="form-group row">
				<label htmlFor="headers" className="col-sm-3 col-form-label">
					Select columns
				</label>
				<div className="col-sm-5">
					<DnDColumns
						name="headers"
						value={user.headers}
						onChange={handleChange('headers')}
					/>
				</div>
			</div>
			{user.role === 'mg' && (
				<div className="d-flex justify-content-end mt-5">
					<Link to="/settings/groups">
						Manage Groups <i className="fa fa-chevron-right ml-2" />
					</Link>
				</div>
			)}
			<div className="clearfix" />
			<hr />
			<div className="d-flex justify-content-between">
				<Purger />
				<Sampler />
			</div>
		</>
	);
};

UserSettings.propTypes = {
	user: PropTypes.object,
};

export default inject('user')(observer(UserSettings));
