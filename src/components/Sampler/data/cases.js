import faker from 'faker';

import { products, statuses } from './constants';
import { randomProps } from './utils';

export function randomCases(currentCases, namesPool = [], maxCases = 15000) {
	let ticketsPool = new Array(maxCases).fill('');
	for (let i = 0, size = Math.round(maxCases / 2); i < size; i++) {
		ticketsPool.push('INC' + faker.finance.account(9));
	}

	const ids = {};
	const cases = getRandomExisting(currentCases, namesPool, ids);
	const max = Math.abs(maxCases - cases.length);

	for (let i = 0; i < max; i++) {
		const [Status, StatusReason] = randomProps(statuses);
		const [Product, CaseType, SubType] = randomProps(products);
		const numTickets = faker.random.number(2);
		const tickets = ticketsPool.slice(
			faker.random.number(ticketsPool.length),
			numTickets,
		);
		const ProblemDescription = [faker.lorem.sentence(), ...tickets]
			.join(' ')
			.trim();

		const CaseId = faker.random.number({ min: 6000000, max: 7000000 });

		if (!ids[CaseId]) {
			cases.push({
				CaseId,
				ProblemDescription,
				Product,
				CaseType,
				SubType,
				Status,
				StatusReason,
				Customer: `${faker.name.lastName()}, ${faker.name.firstName()}`.toUpperCase(),
				InsertDate: new Date(faker.date.past()).toLocaleString(),
				UpdateDate: new Date(faker.date.recent()).toLocaleString(),
				InsertByName: faker.random.arrayElement(namesPool),
				UpdateByName: faker.random.arrayElement(namesPool),
				AssignToName: faker.random.arrayElement(namesPool),
				CallCount: faker.random.number({ min: 1, max: 5 }),
			});
		}

		ids[CaseId] = 1;
	}

	return cases;
}

function getRandomExisting(currentCases, namesPool, ids) {
	const numExisting = Math.round(0.85 * currentCases.length);

	const cases = [];
	for (let i = 0; i < numExisting; i++) {
		const [Status, StatusReason] = randomProps(statuses);
		const {
			caseId: [, ...idArray],
			product,
			caseType,
			subType,
			problem,
			insertDate,
			insertByName,
			assignToName,
			callCount,
		} = faker.random.arrayElement(currentCases);
		const caseId = idArray.join('');

		if (!ids[caseId]) {
			cases.push({
				CaseId: caseId,
				ProblemDescription: problem,
				Product: product,
				CaseType: caseType,
				SubType: subType,
				Status,
				StatusReason,
				Customer: `${faker.name.lastName()}, ${faker.name.firstName()}`.toUpperCase(),
				InsertByName: insertByName,
				InsertDate: new Date(insertDate).toLocaleString(),
				UpdateDate: new Date(faker.date.recent()).toLocaleString(),
				UpdateByName: faker.random.arrayElement(namesPool),
				AssignToName: faker.random.boolean()
					? assignToName
					: faker.random.arrayElement(namesPool),
				CallCount: callCount + +faker.random.boolean(),
			});

			ids[caseId] = 1;
		}
	}

	return cases;
}
