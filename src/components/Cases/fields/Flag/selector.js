export default function applyFilter(field, selected, cases) {
	return cases.filter(row => {
		return row.flag === selected || (selected === 'fg' && row.flag);
	});
}
