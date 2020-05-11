import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable, action, decorate } from 'mobx';

class Search extends React.Component {
	static propTypes = {
		applyFilter: PropTypes.func.isRequired,
	};

	keyword = '';

	updateKeyword(keyword) {
		this.keyword = keyword;
	}

	handleChange = e => {
		if (e.target.value) {
			this.updateKeyword(e.target.value);
		} else {
			this.props.applyFilter('keyword', '');
		}
	};

	handleSubmit = e => {
		e.preventDefault();
		this.props.applyFilter('keyword', this.keyword);
		this.updateKeyword('');
	};

	render() {
		return (
			<form>
				<div className="input-group mb-3">
					<input
						type="text"
						className="form-control"
						placeholder="Case # / Incident # / Problem description"
						onChange={this.handleChange}
					/>
					<div
						className="input-group-append"
						onClick={this.handleSubmit}
					>
						<span className="input-group-text">
							<i className="fa fa-search" />
						</span>
					</div>
				</div>
			</form>
		);
	}
}

decorate(Search, {
	keyword: observable,
	updateKeyword: action,
});

export default observer(Search);
