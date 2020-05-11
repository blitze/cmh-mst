export default function applyFilter(field, statuses, cases) {
	if (!statuses.length) {
		return cases;
	}

	return cases.filter(row => statuses.includes(row.timedStatus));
}
