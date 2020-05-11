import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { observable, decorate, action } from 'mobx';
import Notification from 'react-web-notification';

class Notifier extends Component {
	static propTypes = {
		row: PropTypes.object.isRequired,
	};

	timeout;
	show = false;

	handleNotificationOnClick = (e, tag) => {
		this.hideNotification();
	};

	handleNotificationOnShow(e, tag) {
		this.playSound();
	}

	showNotification() {
		this.show = true;
	}

	hideNotification() {
		this.show = false;
	}

	playSound(filename) {
		document.getElementById('sound').play();
	}

	clearTimeout() {
		clearTimeout(this.timeout);
		this.timeout = undefined;
	}

	componentWillUnmount() {
		this.clearTimeout();
	}

	render() {
		const { alerts, row } = this.props;

		if (row.customDueDate) {
			const minutesLeft = moment(row.dueDate * 1000).diff(
				moment(),
				'minutes',
			);

			if (minutesLeft > 0 && minutesLeft <= 5) {
				this.clearTimeout();

				// update status to past due 1 second later
				setTimeout(
					() => row.update({ status: 'pd', customDueDate: 0 }),
					moment(row.dueDate * 1000).diff(moment()) + 1000,
				);

				if (!alerts.items.includes(row.caseId)) {
					alerts.add(row.caseId);
					this.showNotification();

					// we set status to follow up if not already set
					if (row.status.id !== 'cs') {
						row.update({ status: 'cs' });
					}
				}
			}
		}

		if (this.show) {
			const options = {
				tag: row.caseId,
				body: row.caseId,
				icon:
					'//georgeosddev.github.io/react-web-notification/example/Notifications_button_24.png',
				lang: 'en',
				dir: 'ltr',
			};

			return (
				<React.Fragment>
					<Notification
						title="Reminder"
						options={options}
						onClick={this.handleNotificationOnClick}
					/>
					<audio id="sound" preload="auto">
						<source
							src="//georgeosddev.github.io/react-web-notification/example/sound.mp3"
							type="audio/mpeg"
						/>
						<source
							src="//georgeosddev.github.io/react-web-notification/example/sound.ogg"
							type="audio/ogg"
						/>
						<embed
							hidden={true}
							autostart="false"
							loop={false}
							src="//georgeosddev.github.io/react-web-notification/example/sound.mp3"
						/>
					</audio>
				</React.Fragment>
			);
		}

		return null;
	}
}

decorate(Notifier, {
	show: observable,
	showNotification: action,
	hideNotification: action,
});

export default inject('alerts')(observer(Notifier));
