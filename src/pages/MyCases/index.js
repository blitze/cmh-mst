import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';

import Cases from '../../components/Cases';

const touchedExplain =
	"These are cases you've touched at some point that are still open but are not currently assigned to you";

function MyCases({ cases, groups, user, match }) {
	if (!user.isSet || user.isManager) {
		if (groups.isSet) {
			const groupId = Object.keys(groups.names).shift();
			return <Redirect to={`/group/${groupId}`} />;
		}
		return <Redirect to="/welcome" />;
	}

	const renderTitle = groupId => (
		<div className="pull-right mb-3">
			{groupId === 'touched' ? (
				<Link to="/">&#9668; Go back</Link>
			) : (
				<>
					<Link to="/touched" title={touchedExplain}>
						Touched:
					</Link>
					<span className="badge badge-success ml-1">
						{cases.touchCount}
					</span>
				</>
			)}
		</div>
	);

	const group = match.path === '/touched' ? 'touched' : 'self';

	return <Cases key={group} group={group} renderTitle={renderTitle} />;
}

MyCases.propTypes = {
	cases: PropTypes.object,
	groups: PropTypes.object,
	user: PropTypes.object,
	match: PropTypes.object,
};

export default inject('cases', 'groups', 'user')(observer(MyCases));
