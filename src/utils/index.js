import { HEADERS } from '../constants';

export function getReminderDays(reminder) {
	const [duration, type] = reminder;
	const converter = {
		d: d => d,
		w: d => d * 7,
		m: d => d * 30,
		q: d => d * 90,
	};

	return converter[type](duration);
}

export function getFilterStackedCaseIds(field, cases) {
	const { filterKeys, filterStack } = cases;
	const currFieldStackIndex = filterKeys.indexOf(field);

	let filterCases, prevFilter;
	if (currFieldStackIndex < 0) {
		// if field is not an active filter, we use the cases from the last used filter in stack
		prevFilter = filterKeys[filterKeys.length - 1];
		filterCases = filterStack[prevFilter];
	} else {
		// if field is an active filter, we use the cases from the filter right before this one
		prevFilter = filterKeys[currFieldStackIndex - 1];
		filterCases = filterStack[prevFilter];
	}

	return filterCases || cases.groupCases;
}

/**
 * When viewing group cases, we want to display who owns the case rather than who assigned the case.
 * This function is used to change the header from 'assignedByName' to 'assignToName'
 * @param string groupId
 * @param string headerId
 * @return object
 */
export function getHeaderProps(groupId, headerId) {
	let { field, text, ...rest } = HEADERS[headerId];

	if (groupId !== 'self' && field === 'assignedByName') {
		field = 'assignToName';
		text = 'Assigned To';
	}

	return {
		field,
		text,
		...rest,
	};
}

/**
 * Returns a function that can be used with array.sort(func) to sort array based on
 * the properties of the given object
 * @param object object
 * @param string key
 * @param string direction
 * @return array
 */
export function keySort(object, key, direction = 'a') {
	return function(a, b) {
		if (!object[a].hasOwnProperty(key) || !object[b].hasOwnProperty(key)) {
			// property doesn't exist on either object
			return 0;
		}

		const varA =
			typeof object[a][key] === 'string'
				? object[a][key].toUpperCase()
				: object[a][key];
		const varB =
			typeof object[b][key] === 'string'
				? object[b][key].toUpperCase()
				: object[b][key];

		let comparison = 0;
		if (varA > varB) {
			comparison = 1;
		} else if (varA < varB) {
			comparison = -1;
		}
		return direction === 'a' ? comparison : comparison * -1;
	};
}

/**
 * Converts first character of every word in given string to uppercase
 * and everything else to lowercase
 * @param string str
 * @return string
 */
export const ucwords = str => {
	if (!str) return str;
	return str
		.toLowerCase()
		.split(/[\s,]+/)
		.map(name => {
			const [first, ...rest] = name;
			return [first.toUpperCase(), ...rest].join('');
		})
		.join(', ');
};

let defaultConfig = {
	caseUrl: '/',
	reportsUrl: '/',
	ticketUrl: '/',
	height: '500',
	tools: {},
	onAction: () => null,
};

if (process.env.NODE_ENV !== 'production') {
	defaultConfig.tools = {
		'Category 1': [
			{ title: 'Some Foo Resource', url: '/' },
			{ title: 'Bar Resource', url: '/' },
		],
		'Category 2': [
			{ title: 'Foo Resource', url: '/' },
			{ title: 'Bar Resource', url: '/' },
		],
		'Category 3': [
			{ title: 'Long resource title to test view', url: '/' },
			{ title: 'Bar Resource', url: '/' },
		],
		'Category 4': [
			{ title: 'Foo Resource', url: '/' },
			{ title: 'Bar Resource', url: '/' },
		],
		'Category 5': [
			{ title: 'Foo Resource', url: '/' },
			{ title: 'Bar Resource', url: '/' },
		],
		'Category 6': [
			{ title: 'Foo Resource', url: '/' },
			{ title: 'Bar Resource', url: '/' },
		],
		'Category 7': [
			{ title: 'Foo Resource', url: '/' },
			{ title: 'Bar Resource', url: '/' },
		],
		'Category 8': [
			{ title: 'Foo Resource', url: '/' },
			{ title: 'Bar Resource', url: '/' },
			{ title: 'Foo Resource', url: '/' },
			{ title: 'Bar Resource', url: '/' },
		],
		'Category 9': [
			{ title: 'Foo Resource', url: '/' },
			{ title: 'Bar Resource', url: '/' },
		],
		'Category 10': [
			{ title: 'Foo Resource', url: '/' },
			{ title: 'Bar Resource', url: '/' },
		],
		'Category 11': [
			{ title: 'Foo Resource', url: '/' },
			{ title: 'Bar Resource', url: '/' },
		],
	};
}

export const config = window.config || defaultConfig;
