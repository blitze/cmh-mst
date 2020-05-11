export const statuses = {
	Open: ['Customer Trying Fix', 'Pending Research', 'Awaiting Callback'],
	Closed: [
		'Customer Cancelled',
		'No Resolution',
		'Pending Fix',
		'Resolved',
		'Unsupported',
		'Escalation',
	],
};

export const products = {
	Website: {
		'Browser Issues': [
			'Chrome',
			'Internet Explorer',
			'Safari',
			'Firefox',
			'Edge',
		],
		'Tech Issue': ['Error Code', 'Performance', 'Other'],
		Navigation: ['Site General', 'Profile', 'Customer Service'],
	},
	'Mobile App': {
		Android: ['Login', 'Navigation', 'Tech Issue'],
		iOS: ['Login', 'Navigation', 'Tech Issue'],
	},
	'Phone System': {
		Internal: ['Routing Issue', 'Wrong Number'],
		External: ['Routing Issue', 'Wrong Number', 'Wrong Extension'],
	},
	'Online Security': {
		'2FA': [
			'Not Prompted for code',
			'Cannot receive code',
			'Enable/Disable',
		],
		'Username/Password': ['Blocked Password', 'Create/Change Username'],
	},
	eDelivery: {
		'Email System': ['Undeliverable', 'Received paper', 'Privacy Incident'],
		'Sign-up Issue': ['Invalid email'],
	},
};

export const resources = [
	{
		id: 'res-1',
		title: 'Email Mobile Dev',
		products: ['Mobile App'],
		resource: 'mailto:Mobile Dev Team',
		notes: '',
	},
	{
		id: 'res-2',
		title: 'Email iOS Team',
		products: ['Mobile App > iOS'],
		resource: 'mailto:Mobile iOS Team',
		notes: 'Must provide app version',
	},
	{
		id: 'res-3',
		title: 'Ticket to Mobile Dev',
		products: ['Mobile App > iOS > Tech Issue'],
		resource: 'https://servicenow.com/new',
		notes: 'Assignment group: mobile_app',
	},
	{
		id: 'res-4',
		title: 'Call Back Request',
		products: [
			'Website > Navigation',
			'Online Security',
			'Mobile App > iOS > Navigation',
			'Mobile App > Android > Navigation',
		],
		resource: 'mailto:Call Back Team?subject=Customer requesting callback',
		notes: 'Please provide customer name and call back number',
	},
	{
		id: 'res-5',
		title: 'Access Issue',
		products: ['Online Security'],
		resource: `mailto:Security Team?subject=Cannot access website
		https://servicenow.com/new`,
		notes: 'Assignment group: web_support',
	},
];
