import React from 'react';
import { inject, observer } from 'mobx-react';
import { applySnapshot } from 'mobx-state-tree';
import Papa from 'papaparse';

import { randomCases } from './data/cases';
import { randomGroups } from './data/groups';
import { randomResources } from './data/resources';
import Dropdown from '../Dropdown';

const Sampler = ({
	type = 'data',
	onComplete,
	cases,
	groups,
	resources,
	user,
}) => {
	const loadData = () => {
		const [sampleGroups, sampleUser] = randomGroups(user.isManager);

		applySnapshot(groups, sampleGroups);
		applySnapshot(resources, randomResources());

		if (user.isManager || !user.fullName) {
			user.update('fName', sampleUser.fName);
			user.update('lName', sampleUser.lName);
		}
	};

	const loadCases = close => e => {
		e.preventDefault();
		close();
		const sampleCases = randomCases(cases.cases, [
			...new Set([
				...Object.keys(groups.members),
				user.fullName.toUpperCase(),
			]),
		]);

		if (typeof onComplete === 'function') {
			onComplete(Papa.unparse(sampleCases));
		}
	};

	return type === 'cases' ? (
		<Dropdown
			containerClass="btn btn-secondary p-0"
			renderTrigger={toggle => (
				<div
					className=" dropdown-toggle dropdown-toggle-split w-100 h-100 px-2 pt-1"
					onClick={toggle}
				>
					<span className="sr-only">Toggle Dropdown</span>
				</div>
			)}
			renderContent={close => (
				<a
					className="dropdown-item"
					href="/"
					onClick={loadCases(close)}
				>
					Generate sample cases
				</a>
			)}
		/>
	) : (
		<button
			type="button"
			className="btn btn-secondary d-inline"
			onClick={loadData}
		>
			Load Sample Data
		</button>
	);
};

export default inject('cases', 'groups', 'resources', 'user')(
	observer(Sampler),
);
