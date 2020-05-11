import moment from 'moment';

const LAST_WEEK = moment()
	.subtract(7, 'days')
	.startOf('day');
const YESTERDAY = moment()
	.subtract(1, 'days')
	.startOf('day');
const TODAY = moment().startOf('day');
const TOMORROW = moment()
	.add(1, 'days')
	.startOf('day');
const NEXT_WEEK = moment()
	.add(7, 'days')
	.startOf('day');

const rangeKeys = {
	last_week: {
		a: LAST_WEEK,
		b: 'week',
	},
	yesterday: {
		a: YESTERDAY,
		b: 'day',
	},
	today: { a: TODAY, b: 'day' },
	tomorrow: {
		a: TOMORROW,
		b: 'day',
	},
	this_week: { a: TODAY, b: 'week' },
	next_week: {
		a: NEXT_WEEK,
		b: 'week',
	},
};

export default function applyFilter(field, value, cases) {
	const { a, b } = rangeKeys[value];
	return cases.filter(row => moment(row[field] * 1000).isSame(a, b));
}
