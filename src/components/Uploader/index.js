import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Progress from '../Progress';
import Sampler from '../Sampler';

export default class Uploader extends PureComponent {
	static propTypes = {
		sampler: PropTypes.string,
		onComplete: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			progress: false,
		};
	}

	errorHandler = e => {
		switch (e.target.error.code) {
			case e.target.error.NOT_FOUND_ERR:
				alert('File Not Found!');
				break;
			case e.target.error.NOT_READABLE_ERR:
				alert('File is not readable');
				break;
			case e.target.error.ABORT_ERR:
				break;
			default:
				alert('An error occurred reading this file.');
		}
	};

	abort = e => alert('File read cancelled');

	start = e => {
		this.setState({
			progress: 0,
		});
	};

	updateProgress = e => {
		if (e.lengthComputable) {
			const progress = Math.round((e.loaded / e.total) * 100);

			if (progress < 100) {
				this.setState({
					progress,
				});
			}
		}
	};

	stop = e => {
		this.setState({
			progress: 100,
		});

		setTimeout(() => {
			this.setState({ progress: false }, () =>
				this.props.onComplete(e.target.result),
			);
		}, 1000);
	};

	handleUpload = e => {
		let reader = new FileReader();
		reader.onerror = this.errorHandler;
		reader.onprogress = this.updateProgress;
		reader.onabort = this.abort;
		reader.onloadstart = this.start;
		reader.onload = this.stop;

		// Read in the image file as a binary string.
		reader.readAsText(e.target.files[0]);
	};

	renderButton() {
		const styles = {
			button: {
				position: 'relative',
				overflow: 'hidden',
				cursor: 'pointer',
			},
			input: {
				position: 'absolute',
				right: 0,
				top: 0,
				opacity: 0,
			},
		};

		const { sampler, onComplete } = this.props;

		return (
			<div className="btn-group">
				<div
					className="file btn btn-success d-inline py-1"
					style={styles.button}
					onChange={this.handleUpload}
				>
					<i className="fa fa-upload mr-2" />
					Upload Report
					<input type="file" accept=".csv" style={styles.input} />
				</div>

				{sampler && <Sampler type={sampler} onComplete={onComplete} />}
			</div>
		);
	}

	render() {
		return this.state.progress === false ? (
			this.renderButton()
		) : (
			<Progress value={this.state.progress} />
		);
	}
}
