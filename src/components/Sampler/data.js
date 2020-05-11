import faker from 'faker';

import { FLAGS, STATUSES } from './constants';

let products = [];
let groupUsers = [
	{
		name: `${faker.name.lastName()}, ${faker.name.firstName()}`,
		groupId: 'self',
	},
];

function getChanceArrayItems(numItems = 1, chancePercent = 10, fillWith = '') {
	const numEmptyItems = numItems * (Math.round(100 / chancePercent) - 1);
	return [...Array(numEmptyItems)].fill(fillWith);
}

function ISOStringToUnix(s) {
	return (s.getTime() / 1000) | 0;
}

function getGroups(maxNumGroups = 4, maxGroupMembers = 20) {
	const maxGroups = faker.random.number(maxNumGroups);

	let groups = {
		list: [],
	};

	for (let i = 0; i < maxGroups; i++) {
		const groupId = faker.random.uuid().split('-')[0];
		const maxMembers = faker.random.number(maxGroupMembers);

		let members = [];
		for (let j = 0; j < maxMembers; j++) {
			const memberId = faker.random.uuid().split('-')[0];
			const name = `${faker.name.lastName()}, ${faker.name.firstName()}`;

			groupUsers.push({ groupId, name });
			members.push({ id: memberId, name });
		}

		groups.list.push({
			id: groupId,
			name: faker.company.companyName(),
			members,
		});
	}

	return groups;
}

function getCases(max = 1000) {
	const maxCases = faker.random.number(max);
	const currentUser = groupUsers[0].name;

	const getTickets = () => {
		const maxTickets = faker.random.number(3);

		let tickets = [];
		for (let j = 0; j < maxTickets; j++) {
			tickets.push('INC' + faker.finance.account(9));
		}

		return tickets.join(',');
	};

	let cases = {
		byIds: {},
		group: 'self',
		sorting: { field: 'updateDate', dir: 'a' },
	};

	for (let i = 0; i < maxCases; i++) {
		const caseId = 'R' + faker.finance.account(6);

		if (!cases.byIds[caseId]) {
			const insertDays = faker.random.number(90);
			const updateDays = faker.random.number(insertDays);
			const user = faker.random.arrayElement(groupUsers);
			const insertByName = `${faker.name.lastName()}, ${faker.name.firstName()}`;
			const possibleUpdater = `${faker.name.lastName()}, ${faker.name.firstName()}`;
			const updateByName = faker.random.arrayElement([
				...getChanceArrayItems(1, 1, possibleUpdater),
				groupUsers[0].name,
			]);
			const product = faker.commerce.department();
			const caseType = faker.hacker.adjective();
			const subType = faker.hacker.noun();
			const updateDate = ISOStringToUnix(faker.date.recent(updateDays));
			const status = faker.random.arrayElement(Object.keys(STATUSES));
			const flags = Object.keys(FLAGS);
			const group =
				user.groupId +
				(updateByName === currentUser && user.name !== currentUser
					? ' touched'
					: '');

			products.push({ product, caseType, subType });

			cases.byIds[caseId] = {
				caseId,
				problem: faker.hacker.phrase(),
				product,
				caseType,
				subType,
				group,
				status,
				insertByName,
				updateByName,
				assignToName: user.name,
				assignedByName: updateByName,
				insertDate: ISOStringToUnix(faker.date.recent(insertDays)),
				updateDate,
				assignedDate: ISOStringToUnix(faker.date.recent()),
				lastTouched: ISOStringToUnix(faker.date.recent()),
				callCount: faker.random.number({ min: 1, max: 9 }),
				callBacks: faker.random.number(9),
				tickets: faker.random.arrayElement([
					...getChanceArrayItems(),
					getTickets(),
				]),
				flag: faker.random.arrayElement([
					...getChanceArrayItems(flags.length),
					...flags,
				]),
				notes: [],
			};
		}
	}

	return cases;
}

function getResources(max = 100) {
	const maxResources = faker.random.number(max);

	let resources = {};
	let cache = {};

	for (let i = 0; i < maxResources; i++) {
		const title = faker.hacker.verb();
		const randomProduct = faker.random.arrayElement([
			...products,
			{
				product: faker.commerce.department(),
				caseType: faker.hacker.adjective(),
				subType: faker.hacker.noun(),
			},
		]);
		const product = [
			randomProduct.product,
			randomProduct.caseType,
			randomProduct.subType,
		]
			.slice(0, faker.random.number(3))
			.join(' > ');

		if (!product) continue;

		if (!cache[title]) {
			const resourceId = faker.random.uuid().split('-')[0];
			const notes = faker.lorem.words();
			const resource = [
				faker.internet.url(),
				'mailto:' + faker.internet.email(),
			];

			cache[title] = resourceId;
			resources[resourceId] = {
				id: resourceId,
				title,
				resource: resource.slice(0, faker.random.number(2)).join('\n'),
				notes: faker.random.arrayElement([
					...getChanceArrayItems(),
					notes,
				]),
				products: [product],
			};
		} else {
			const resourceId = cache[title];
			resources[resourceId].products.push(product);
		}
	}

	return { list: Object.values(resources) };
}

function setNotes(cases) {
	const caseIds = Object.keys(cases.byIds);
	const max = caseIds.length * 0.2;

	for (let i = 0; i < max; i++) {
		const caseId = faker.random.arrayElement(caseIds);

		cases.byIds[caseId].notes.push({
			id: faker.random.uuid().split('-')[0],
			text: faker.lorem.sentence(),
			done: faker.random.boolean(),
		});
	}
}

export function getSampleData() {
	const groups = getGroups();
	// const cases = getCases();
	// const username = groupUsers[0].name.toLowerCase().split(',');

	// setNotes(cases);

	return {
		// cases,
		groups,
		resources: getResources(),
		// user: {
		// 	fName: username[1].trim(),
		// 	lName: username[0].trim(),
		// 	role: faker.random.arrayElement(['hd', 'rp', 'mg']),
		// 	trackPending: faker.random.arrayElement([true, false]),
		// 	headers: ['ca', 'ab', 'lu', 'pr', 'cc', 'ss'],
		// },
	};
}
