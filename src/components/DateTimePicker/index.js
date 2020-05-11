import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Dropdown from '../Dropdown';

const DateTimePicker = ({ className, ...rest }) => (
	<Dropdown
		arrow
		className={className}
		renderTrigger={toggle => (
			<a className={className} href="/" onClick={toggle}>
				<i className="fa fa-calendar" />
			</a>
		)}
		renderContent={close => (
			<DatePicker
				calendarClassName="border-0 my-0 mx-2"
				showTimeSelect
				timeFormat="HH:mm"
				timeIntervals={15}
				timeCaption="Time"
				{...rest}
				inline
				shouldCloseOnSelect={false}
			/>
		)}
	/>
);

DateTimePicker.propTyes = {
	className: PropTypes.string,
};

export default observer(DateTimePicker);
