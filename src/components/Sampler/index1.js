import React from 'react';
import { inject, observer } from 'mobx-react';
import { applySnapshot } from 'mobx-state-tree';
// import { withRouter } from 'react-router-dom';

// import Progress from '../Progress';
// import { processStep } from '../../utils/processor';
// import getSampleData from '../../data';

const Sampler = ({ cases, groups, resources, statuses, user }) => {
	const [processing, setProcessing] = useState(false);
	const [progress, setProgress] = useState(0);

	const loadData = () => {
		setProgress(0);
		setProcessing(true);

		if (!currentUser) {
			history.push('/settings');
		}

		const sampleData = []; // getSampleData(currentUser);
		const total = sampleData.length;
		let data = {};

		for (let i = 0; i < total; i++) {
			let result = processStep(
				sampleData[i],
				cases.byIds,
				statuses.byIds,
				members,
				currentUser,
				user,
			);

			if (result) {
				data[result.caseId] = result;
			}

			setProgress(Math.round((i / total) * 100));
		}
		cases.import(data);
		setTimeout(() => setProcessing(false), 2000);
	};

	return (
		<button
			type="button"
			className="btn btn-secondary d-inline"
			disabled={processing}
			onClick={loadData}
		>
			{processing ? <Progress value={progress} /> : 'Load Sample'}
		</button>
	);
};

export default inject('cases', 'groups', 'statuses', 'user')(
	observer(withRouter(Sampler)),
);
