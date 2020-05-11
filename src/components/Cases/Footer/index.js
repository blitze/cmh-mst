import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { action, decorate, observable } from 'mobx';
import Papa from 'papaparse';

import Progress from '../../Progress';
import Uploader from '../../Uploader';
import { processStep } from '../../../utils/processor';
import { config } from '../../../utils';

class Footer extends Component {
	static propTypes = {
		cases: PropTypes.object.isRequired,
		statuses: PropTypes.object.isRequired,
		groups: PropTypes.object,
		user: PropTypes.object.isRequired,
	};

	progress = false;

	updateProgress(progress = false) {
		this.progress = progress;
	}

	onUploadComplete = csv => {
		const total = csv.split(/\r\n|\n/).length - 1;
		const currentUser = this.props.user.fullName.toUpperCase();
		const members = {
			...this.props.groups.members,
			[currentUser]: 'self',
		};

		this.progress = false;

		let count = 0;
		let data = {};

		Papa.parse(csv, {
			header: true,
			dynamicTyping: true,
			step: step => {
				let result = processStep(
					step.data,
					this.props.cases.byIds,
					this.props.statuses.byIds,
					members,
					currentUser,
					this.props.user,
				);

				if (result) {
					data[result.caseId] = result;
				}

				count++;
				this.progress = Math.round(count / total) * 100;
			},
			complete: () => {
				this.props.cases.import(data);
				setTimeout(() => {
					this.updateProgress();
				}, 2000);
			},
		});
	};

	render() {
		return (
			<nav className="navbar fixed-bottom navbar-expand-sm navbar-dark bg-dark py-2">
				<div className="container">
					<div className="row w-100 text-white d-flex justify-content-between align-items-center">
						<div className="col d-none d-md-block">
							To update cases:
						</div>
						<div className="col d-none d-md-block">
							<span className="badge badge-info mr-1">1</span>
							<a
								className="text-white"
								href={config.reportsUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								Generate Report
								<i className="fa fa-external-link ml-1" />
							</a>
						</div>
						<div className="col d-none d-md-block">
							<span className="badge badge-info mr-1">2</span>
							<span>Export and Save Report</span>
						</div>
						<div className="col">
							<span className="badge badge-info d-none d-md-inline mr-1">
								3
							</span>
							{this.progress !== false ? (
								<Progress
									value={this.progress}
									bgClass="bg-success"
								/>
							) : (
								<Uploader
									className="btn btn-success w-75 py-0"
									sampler="cases"
									onComplete={this.onUploadComplete}
								/>
							)}
						</div>
					</div>
				</div>
			</nav>
		);
	}
}

decorate(Footer, {
	progress: observable,
	updateProgress: action,
});

export default inject('cases', 'groups', 'statuses', 'user')(observer(Footer));
