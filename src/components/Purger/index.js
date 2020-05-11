import React from 'react';
import { inject } from 'mobx-react';
import { applySnapshot } from 'mobx-state-tree';

const Purger = ({ cases, groups, resources, statuses, user }) => {
	const handleClick = () => {
		applySnapshot(cases, {
			byIds: undefined,
			group: undefined,
			filterStack: undefined,
		});
		applySnapshot(groups, { list: undefined });
		applySnapshot(resources, { list: undefined });
		applySnapshot(statuses, { byIds: undefined });
		user.update('fName', '');
		user.update('lName', '');
	};

	return (
		<button type="button" className="btn btn-danger" onClick={handleClick}>
			Purge All Data
		</button>
	);
};

export default inject('cases', 'groups', 'resources', 'statuses', 'user')(
	Purger,
);
