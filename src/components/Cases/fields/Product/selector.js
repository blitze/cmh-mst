const buildNestedObject = (object, keys) => {
	if (!keys.length) {
		return object;
	}

	const key = keys.shift();

	if (object.hasOwnProperty(key)) {
		object[key].count++;
	} else {
		object[key] = {
			count: 1,
			types: {},
		};
	}

	object[key].types = buildNestedObject(object[key].types, keys);
	return object;
};

export const setNestedObject = (base, path, delKey) => {
	const lastKey = path.pop();
	let lastObj = path.reduce(
		(obj, name) => (obj[name] = obj[name] || {}),
		base,
	);

	if (delKey) {
		if (!lastKey) {
			delete lastObj[delKey];
		} else {
			// console.log(lastObj, lastKey, delKey);
			delete lastObj[lastKey][delKey];
		}
	} else if (lastKey) {
		lastObj[lastKey] = {};
	} else {
		lastObj = {};
	}
};

export const getProducts = (cases = []) => {
	return cases.reduce((products, row) => {
		const { product, caseType, subType } = row;
		return buildNestedObject(products, [product, caseType, subType]);
	}, {});
};

export default function applyFilter(
	field,
	products,
	caseList,
	fields = ['product', 'caseType', 'subType'],
) {
	return Object.keys(products).reduce((list, name) => {
		const [field, ...rest] = fields;

		const filteredCases = caseList.filter(row => row[field] === name);

		const subList = Object.keys(products[name]).length
			? applyFilter(field, products[name], filteredCases, rest)
			: filteredCases;

		return [...list, ...subList];
	}, []);
}
