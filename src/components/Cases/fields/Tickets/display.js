import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, decorate, observable } from 'mobx';

import { config } from '../../../../utils';

class TicketDisplay extends Component {
	static propTypes = {
		value: PropTypes.string,
		onSave: PropTypes.func.isRequired,
	};

	error = false;
	show = false;
	ticket = '';

	get tickets() {
		return this.props.value.split(',').filter(Boolean);
	}

	validateTicket(ticket) {
		const pattern = /INC[0-9]{9}/gi;
		return pattern.test(ticket);
	}

	handleClick = e => {
		e.preventDefault();
		this.show = !this.show;
	};

	handleChange = e => {
		this.ticket = e.target.value;
	};

	handleDelete = index => e => {
		const tickets = this.tickets;

		tickets.splice(index, 1);
		this.props.onSave(tickets.join(','));
	};

	handleSubmit = e => {
		e.preventDefault();

		if (this.validateTicket(this.ticket)) {
			const newTicket = this.ticket.toUpperCase();
			const currentTickets = this.tickets;
			if (!currentTickets.includes(newTicket)) {
				this.props.onSave([newTicket, ...currentTickets].join(','));
			}

			this.error = false;
			this.show = false;
			this.ticket = '';
		} else {
			this.error = true;
		}
	};

	render() {
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col p-0 pr-2">
						<form
							className={this.show ? 'd-block' : 'd-none'}
							onSubmit={this.handleSubmit}
						>
							<input
								type="text"
								name="ticket"
								value={this.ticket}
								onChange={this.handleChange}
								style={{ width: '122px', height: '33px' }}
								className={
									'form-control p-2' +
									(this.error ? ' is-invalid' : '')
								}
							/>
						</form>
						<ul className="list-inline m-0">
							{this.tickets.map((ticket, i) => (
								<li
									key={i}
									className="list-inline-item d-flex align-items-center"
								>
									<button
										className="btn btn-link p-0 pr-1"
										onClick={this.handleDelete(i)}
										title="Remove"
									>
										<i className="fa fa-minus" />
									</button>
									<a
										href={config.ticketUrl + ticket}
										target="_blank"
										rel="noopener noreferrer"
									>
										{ticket}
									</a>
								</li>
							))}
						</ul>
					</div>
					<a
						className="col-auto p-0"
						href="/"
						onClick={this.handleClick}
					>
						<i
							className={`fa ${
								this.show ? 'fa-close' : 'fa-plus'
							}`}
						/>
					</a>
				</div>
			</div>
		);
	}
}

decorate(TicketDisplay, {
	error: observable,
	show: observable,
	ticket: observable,

	handleClick: action,
	handleChange: action,
	handleSubmit: action,
});

export default observer(TicketDisplay);
