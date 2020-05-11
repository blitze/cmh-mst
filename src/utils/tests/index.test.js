import moment from 'moment';
import { getHeaderProps, keySort, ucwords } from '../';
import { HEADERS } from '../../constants';

describe('Test getHeaderProps', () => {
	it('should return unchanged header props when headerId != "ab"', () => {
		const result = getHeaderProps('self', 'st');
		expect(result.field).toBe('insertDate');
	});

	it('should return unchanged header props when viewing own cases', () => {
		const result = getHeaderProps('self', 'ab');
		expect(result.field).toBe('assignedByName');
		expect(result.text).toBe('Assigned By');
	});

	it('should change header props when viewing group cases', () => {
		const result = getHeaderProps('foo', 'ab');
		expect(result.field).toBe('assignToName');
		expect(result.text).toBe('Assigned To');
	});
});

describe('Test keySort', () => {
	const keyRef = {
		a: { prop1: 2, prop2: 'Serba' },
		b: { prop1: 3, prop2: 'van' },
		c: { prop1: 5, prop2: '' },
		d: { prop1: 1, prop2: '3foo' },
		e: { prop1: 4, prop2: '' },
	};
	const array = ['a', 'b', 'c', 'd'];

	it('it should return original object if property does not exist', () => {
		const result = array.sort(keySort(keyRef, 'foo'));

		expect(result).toEqual(array);
	});

	it('it should sort by numeric keys, ascending by default', () => {
		const result = array.sort(keySort(keyRef, 'prop1'));

		expect(result).toEqual(['d', 'a', 'b', 'c']);
	});

	it('it should sort by mixed string keys, ascending by default', () => {
		const result = array.sort(keySort(keyRef, 'prop2'));

		expect(result).toEqual(['c', 'd', 'a', 'b']);
	});

	it('it should sort by mixed string keys, descending', () => {
		const result = array.sort(keySort(keyRef, 'prop2', 'd'));

		expect(result).toEqual(['b', 'a', 'd', 'c']);
	});
});

describe('Test ucwords', () => {
	it('should convert first character of every word to upper case', () => {
		const str = 'my SAMPLE text';
		const expected = 'My Sample Text';
		const result = ucwords(str);

		expect(result).toBe(expected);
	});
});
