import faker from 'faker';

export function randomGroups(
	isManager = false,
	maxNumGroups = 4,
	maxGroupMembers = 20,
) {
	const min = +isManager;
	const maxGroups = faker.random.number({ min, max: maxNumGroups });

	let groups = {
		list: [],
	};

	for (let i = 0; i < maxGroups; i++) {
		const groupId = faker.random.uuid().split('-')[0];
		const maxMembers = faker.random.number({ min, max: maxGroupMembers });

		let members = [];
		for (let j = 0; j < maxMembers; j++) {
			const memberId = faker.random.uuid().split('-')[0];
			const name = `${faker.name.lastName()}, ${faker.name.firstName()}`;

			members.push({ id: memberId, name });
		}

		groups.list.push({
			id: groupId,
			name: faker.company.companyName(),
			members,
		});
	}

	const user = {
		lName: isManager ? '' : faker.name.lastName(),
		fName: isManager ? '' : faker.name.firstName(),
	};

	return [groups, user];
}
