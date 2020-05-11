import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Form extends PureComponent {
	defaults = {};
	resetOnSubmit = false;

	static propTypes = {
		onSubmit: PropTypes.func.isRequired,
		children: PropTypes.node.isRequired,
		reset: PropTypes.bool,
	};

	static defaultProps = {
		reset: false,
	};

	constructor(props) {
		super(props);

		this.state = {
			entries: {},
		};
	}
	handleChange = e => {
		this.setState({
			entries: {
				...this.state.entries,
				[e.target.name]: e.target.value,
			},
		});
	};
	handleSubmit = e => {
		e.preventDefault();
		this.props.onSubmit({
			...this.defaults,
			...this.state.entries,
		});

		if (this.resetOnSubmit) {
			e.target.reset();
			this.setState({
				entries: this.defaults,
			});
		}
	};
	render() {
		const { children, reset, ...rest } = this.props;

		this.resetOnSubmit = reset;

		const childWithProp = React.Children.map(children, child => {
			const { name, value } = child.props;
			if (name && value) {
				this.defaults[name] = value;
			}

			return React.cloneElement(child, {
				...child.props,
				onChange: this.handleChange,
			});
		});

		return (
			<form
				{...rest}
				onChange={this.handleChange}
				onSubmit={this.handleSubmit}
			>
				{childWithProp}
			</form>
		);
	}
}
