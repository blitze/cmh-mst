import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import Statuses from './Statuses';
import Resources from './Resources';
import GroupSettings from './Groups';
import UserSettings from './User';
import NoMatch from '../NoMatch';
import Modal from '../../components/Modal';

function Settings({ showModal }) {
	return (
		<div className="container mt-5">
			<Switch>
				<Route path="/settings/general" component={UserSettings} />
				<Route
					path="/settings/groups/:groupId?"
					component={GroupSettings}
				/>
				<Route path="/settings/statuses" component={Statuses} />
				<Route path="/settings/resources" component={Resources} />
				<Route component={NoMatch} />
			</Switch>
			<Modal
				show={showModal}
				title="Confirm Action"
				onSubmit={f => f}
				onCancel={f => f}
			>
				<p>Are you sure?</p>
			</Modal>
		</div>
	);
}

Settings.propTypes = {
	showModal: PropTypes.bool,
};

export default Settings;
