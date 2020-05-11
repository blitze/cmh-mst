import React from 'react';
import { inject, observer } from 'mobx-react';

import Cases from '../../components/Cases';

const Group = ({ groups, match }) => {
	const renderTitle = groupId => (
		<span className="badge badge-warning">{groups.names[groupId]}</span>
	);

	const groupId = match.params.groupId;

	return <Cases key={groupId} group={groupId} renderTitle={renderTitle} />;
};

export default inject('groups')(observer(Group));
