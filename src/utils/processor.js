import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { getReminderDays, ucwords } from './';

const reasonKeys = {
	Resolved: 'rs',
	'Pending Fix': 'pf',
};

/**
 * Hide social security numbers in string
 * @param string str
 * @return string
 */
export function hideSocials(str) {
	return ('' + (str || '')).replace(
		/\s+[0-9]{3}[-\s]?[0-9]{2}[-\s]?([0-9]{4})/g,
		' *****$1',
	);
}

/**
 * Get incident numbers from case notes
 * @param object csvRow
 * @return array
 */
export function getTickets(csvRow) {
	return csvRow['ProblemDescription'].match(/INC[0-9]{9}/gi) || [];
}

/**
 * Get case status
 * @param object csvRow
 * @param object existingCase
 * @param string currentUser
 * @param bool trackPendingFix
 * @return string|false
 */
export function getStatus(
	csvRow,
	existingCase,
	statuses,
	currentUser = '',
	trackPendingFix = false,
) {
	let status = false;

	// case is open
	if (csvRow['Status'] === 'Open') {
		// case is already in db
		if (existingCase) {
			status = existingCase.status.id;

			// case is no longer assigned to the person in db
			if (
				existingCase.assignToName.toUpperCase() !==
				csvRow['AssignToName']
			) {
				status = 'ra';
			} else if (existingCase.status.id === 'rs') {
				// case is closed in db but it has been reopened
				status = 'ro';
			} else if (csvRow['CallCount'] > existingCase.callCount) {
				// call count has increased, set status to updated
				// if it was last updated by someone other than the case owner
				status =
					existingCase.assignToName.toUpperCase() !==
					csvRow['UpdateByName']
						? 'ud'
						: existingCase.status.id;
			}
		} else if (csvRow['UpdateByName'] === csvRow['AssignToName']) {
			// case is not in db, it is still open and was last updated by case owner
			// So we assume case owner is researching the case
			status = 're';
		} else {
			status = 'ut';
		}
	} else {
		// if trackPendingFix is enabled, we get all new/existing cases that are
		// closed / pending fix and belong to currentUser
		if (
			trackPendingFix &&
			csvRow['AssignToName'] === currentUser &&
			csvRow['StatusReason'] === 'Pending Fix'
		) {
			status = 'pf';
		} else if (existingCase) {
			// case is in db and is now closed (resolved/pending fix)
			// if it has been closed for atleast the status' reminder days,
			// we remove it from db
			const statusId = reasonKeys[csvRow['StatusReason']] || 'cc';
			const { reminder } = statuses.get(statusId) || { reminder: '7d' };
			const daysSinceLastUpdate = differenceInCalendarDays(
				new Date(),
				new Date(csvRow['UpdateDate']),
			);
			const reminderDays = getReminderDays(reminder);

			status = daysSinceLastUpdate < reminderDays ? statusId : false;
		}
	}

	return status;
}

/**
 * Get case group
 * @param object csvRow
 * @param object members
 * @param string currentUser
 * @return string
 */
export function getGroup(csvRow, members, currentUser) {
	const { AssignToName, InsertByName, UpdateByName } = csvRow;

	let group = members[AssignToName] || '';

	// case is not assigned to current user but he/she touched the case, so we track it
	if (
		AssignToName !== currentUser &&
		(InsertByName === currentUser || UpdateByName === currentUser)
	) {
		group += ' touched';
	}

	return group.trim();
}

/**
 * Process a row from csv file
 * @param object data
 * @param object cases
 * @param object statuses
 * @param object members
 * @param string currentUser
 * @param object user
 * @return object|false
 */
export function processStep(
	csvRow,
	cases,
	statuses,
	members,
	currentUser,
	user,
) {
	const caseId = `R${csvRow.CaseId}`;
	let group = getGroup(csvRow, members, currentUser);
	let status = getStatus(
		csvRow,
		cases.get(caseId),
		statuses,
		currentUser,
		user.trackPending,
	);

	if (!status || !group) {
		return false;
	}

	const updateDate = new Date(csvRow['UpdateDate']);
	const updateByName = ucwords(csvRow['UpdateByName']);
	const assignToName = ucwords(csvRow['AssignToName']);

	let item = {},
		tickets = getTickets(csvRow);

	if (cases.has(caseId)) {
		const dbRow = cases.get(caseId);
		const callCount = csvRow['CallCount'] || dbRow.callCount || 1;
		item = {
			...dbRow,
			callBacks: callCount - dbRow.callCount,
			callCount,
		};

		// case is already in db and is no longer assigned to the currentUser
		// but it is now assigned to another rep we are tracking
		if (group !== dbRow.group) {
			item.callBacks = 0;
			delete item.lastTouched;
		}

		// if user touched case, it should retain that until case is closed
		if (!group.includes('touched') && dbRow.group.includes('touched')) {
			group += ' touched';
		}

		tickets = [...tickets, ...dbRow.tickets.split(',')];
	}

	if (
		assignToName === updateByName &&
		(!item.lastTouched || updateDate > item.lastTouched)
	) {
		item.lastTouched = updateDate;
	}

	return {
		caseId,
		callBacks: 0,
		flag: '',
		...item,
		problem: hideSocials(csvRow['ProblemDescription']),
		product: csvRow['Product'].toString(),
		caseType: csvRow['CaseType'].toString(),
		subType: csvRow['SubType'].toString(),
		callCount: csvRow['CallCount'],
		insertByName: ucwords(csvRow['InsertByName']),
		assignedByName: ucwords(csvRow['UpdateByName']),
		updateByName,
		assignToName,
		assignedDate: updateDate,
		insertDate: new Date(csvRow['InsertDate']),
		updateDate,
		status,
		group,
		tickets: [...new Set(tickets)].sort().join(','),
	};
}
