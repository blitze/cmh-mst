import { resources } from './constants';

export function randomResources() {
	return { list: resources };
}

// import faker from 'faker';

// import { products } from './constants';
// import { randomProps } from './utils';

// export function randomResources(max = 100) {
// 	const maxResources = faker.random.number(max);

// 	let resources = {};
// 	let cache = {};
// 	let notes = new Array(max).fill('');

// 	for (let i = 0, size = Math.round(maxResources / 2); i < size; i++) {
// 		notes.push(faker.lorem.words());
// 	}

// 	for (let i = 0; i < maxResources; i++) {
// 		const title = faker.hacker.verb();
// 		const product = randomProps(products)
// 			.slice(0, faker.random.number(3))
// 			.join(' > ');

// 		if (!product) continue;

// 		if (!cache[title]) {
// 			const resourceId = faker.random.uuid().split('-')[0];
// 			const resource = [
// 				faker.internet.url(),
// 				'mailto:' + faker.internet.email(),
// 			];

// 			cache[title] = resourceId;
// 			resources[resourceId] = {
// 				id: resourceId,
// 				title,
// 				resource: resource.slice(0, faker.random.number(2)).join('\n'),
// 				notes: faker.random.arrayElement(notes),
// 				products: [product],
// 			};
// 		} else {
// 			const resourceId = cache[title];
// 			resources[resourceId].products.push(product);
// 		}
// 	}

// 	return { list: Object.values(resources) };
// }
