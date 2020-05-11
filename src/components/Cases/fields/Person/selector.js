import { ucwords } from '../../../../utils';

export const getPeople = (field, cases = []) => {
	return cases.reduce((people, row) => {
		const name = ucwords(row[field]);
		people[name] = (people[name] || 0) + 1;
		return people;
	}, {});
};

export default function applyFilter(field, person, cases) {
	console.log(person);
	return cases.filter(x => x[field] === person);
}
