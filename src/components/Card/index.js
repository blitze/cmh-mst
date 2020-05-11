import React, { Component } from 'react';

import Header from './Header';
import Body from './Body';

export default class Card extends Component {
	static Header = Header;
	static Body = Body;

	render() {
		return <div className="card">{this.props.children}</div>;
	}
}
