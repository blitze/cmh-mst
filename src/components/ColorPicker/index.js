import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable, action, decorate } from 'mobx';
import { SketchPicker } from 'react-color';

class ColorPicker extends Component {
	static propTypes = {
		name: PropTypes.string,
		onChange: PropTypes.func,
	};

	displayColorPicker = false;
	color = this.props.color || '#000';

	handleClick = () => {
		this.displayColorPicker = !this.displayColorPicker;
	};

	handleClose = () => {
		this.displayColorPicker = false;
	};

	handleChange = color => {
		this.color = color.hex;

		if (this.props.onChange) {
			this.props.onChange({
				target: {
					name: this.props.name,
					value: color.hex,
				},
			});
		}
	};

	render() {
		const styles = {
			color: {
				width: '18px',
				height: '18px',
				borderRadius: '2px',
				background: this.color,
			},
			swatch: {
				padding: '5px',
				background: '#fff',
				borderRadius: '1px',
				boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
				display: 'inline-block',
				cursor: 'pointer',
			},
			popover: {
				position: 'absolute',
				zIndex: '2',
			},
			cover: {
				position: 'fixed',
				top: '0px',
				right: '0px',
				bottom: '0px',
				left: '0px',
			},
		};

		return (
			<div className="mr-3">
				<div style={styles.swatch} onClick={this.handleClick}>
					<div style={styles.color} />
				</div>
				{this.displayColorPicker ? (
					<div style={styles.popover}>
						<div style={styles.cover} onClick={this.handleClose} />
						<SketchPicker
							color={this.color}
							onChange={this.handleChange}
						/>
					</div>
				) : null}
			</div>
		);
	}
}

decorate(ColorPicker, {
	displayColorPicker: observable,
	color: observable,

	handleClick: action,
	handleClose: action,
	handleChange: action,
});

export default observer(ColorPicker);
