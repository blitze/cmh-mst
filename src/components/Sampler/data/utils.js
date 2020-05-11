import faker from 'faker';

export function randomProps(elements, props = []) {
	if (!elements) return props;

	const array =
		Object.prototype.toString.call(elements) === '[object Object]'
			? Object.keys(elements)
			: elements;
	const element = faker.random.arrayElement(array);

	props.push(element);

	return randomProps(elements[element], props);
}
