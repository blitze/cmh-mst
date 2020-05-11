import moment from 'moment';
import {
	hideSocials,
	getTickets,
	getStatus,
	getGroup,
	processStep,
} from '../processor';
import AppStore from '../../stores';
import { Statuses as StatusStore } from '../../stores/statuses';
import { STATUSES } from '../../constants';

describe('Test hideSocials()', () => {
	it('should not hide account/arbitrary numbers', () => {
		const testString = 'foo x123546789 test';
		const expected = 'foo x123546789 test';
		const result = hideSocials(testString);

		expect(result).toBe(expected);
	});

	it('should hide anything that looks like a social', () => {
		const testString = 'foo 123456789 123-456789 123-45-6789 test';
		const expected = 'foo *****6789 *****6789 *****6789 test';
		const result = hideSocials(testString);

		expect(result).toBe(expected);
	});
});

describe('Test getTickets()', () => {
	it('should capture tickets', () => {
		const row = {
			ProblemDescription:
				'inc123456789 some note INC565854658 foo 123456789',
		};
		const expected = ['inc123456789', 'INC565854658'];
		const result = getTickets(row);

		expect(result).toEqual(expected);
	});
});

describe('Test getStatus()', () => {
	const statuses = StatusStore.create(STATUSES);
	describe('New cases', () => {
		let existingCase;
		describe('Case is Closed', () => {
			let row = {
				Status: 'Closed',
				AssignToName: 'DOE, JOHN',
			};
			let currentUser = 'foo, bar';

			it('should be skipped if not owned by currentUser', () => {
				const result = getStatus(
					row,
					existingCase,
					statuses.byIds,
					currentUser,
				);

				expect(result).toBe(false);
			});

			it('should be skipped if owned by current user and statusReason is Resolved', () => {
				const currentUser = 'DOE, JOHN';
				const result = getStatus(
					{ ...row, StatusReason: 'Resolved' },
					existingCase,
					statuses.byIds,
					currentUser,
				);

				expect(result).toBe(false);
			});

			it('should be Pending Fix (pf) if trackPendingFix is true and owned by current user and statusReason is Pending Fix', () => {
				const currentUser = 'DOE, JOHN';
				const result = getStatus(
					{ ...row, StatusReason: 'Pending Fix' },
					existingCase,
					statuses.byIds,
					currentUser,
					true,
				);

				expect(result).toBe('pf');
			});

			it('should be false if trackPendingFix is false even if owned by current user and statusReason is Pending Fix', () => {
				const currentUser = 'DOE, JOHN';
				const result = getStatus(
					{ ...row, StatusReason: 'Pending Fix' },
					existingCase,
					statuses.byIds,
					currentUser,
					false,
				);

				expect(result).toBe(false);
			});
		});

		describe('Case is Open', () => {
			let row = { Status: 'Open', AssignToName: 'DOE, JOHN' };
			let currentUser = 'DOE, JOHN';

			it('should be Untouched (ut) if last updated by someone else', () => {
				const result = getStatus(
					{ ...row, UpdateByName: 'john, harry' },
					existingCase,
					statuses.byIds,
					currentUser,
				);

				expect(result).toBe('ut');
			});

			it('should be Researching (re) if last updated by case owner', () => {
				const result = getStatus(
					{ ...row, UpdateByName: 'DOE, JOHN' },
					existingCase,
					statuses.byIds,
					currentUser,
				);

				expect(result).toBe('re');
			});
		});
	});

	describe('Existing Case', () => {
		let existingCase = { status: { id: 're' } };
		describe('Case is Closed', () => {
			let row = { Status: 'Closed', AssignToName: 'DOE, JOHN' };
			let currentUser = 'FOO, BAR';

			describe('Last updated less than last x reminder days from status config', () => {
				const { reminder } = statuses.byIds.get('rs');
				let UpdateDate = moment()
					.subtract(reminder.charAt(0) - 1, reminder.charAt(1))
					.format('M/D/YYYY H:m');

				it('should be Resolved (rs) if Closed / Resolved', () => {
					const result = getStatus(
						{ ...row, UpdateDate, StatusReason: 'Resolved' },
						existingCase,
						statuses.byIds,
						currentUser,
					);

					expect(result).toBe('rs');
				});

				it('should be Pending Fix (pf) if Closed / Pending Fix, even if not owned by currentUser', () => {
					const result = getStatus(
						{
							...row,
							UpdateDate,
							StatusReason: 'Pending Fix',
							AssignToName: 'EGO, FRANK',
						},
						existingCase,
						statuses.byIds,
						currentUser,
					);

					expect(result).toBe('pf');
				});

				it('should be Closed (cc) if closed with status reason other than Resolved or Pending Fix', () => {
					const result = getStatus(
						{ ...row, UpdateDate, StatusReason: 'Some reason' },
						existingCase,
						statuses.byIds,
						currentUser,
					);

					expect(result).toBe('cc');
				});
			});

			it('should be removed if closed in last x reminder days or more', () => {
				const { reminder } = statuses.byIds.get('rs');
				let UpdateDate = moment()
					.subtract(reminder.charAt(0) + 1, reminder.charAt(1))
					.format('M/D/YYYY H:m');
				const result = getStatus(
					{ ...row, UpdateDate },
					existingCase,
					statuses.byIds,
					currentUser,
				);

				expect(result).toBe(false);
			});

			it('should be Pending Fix (pf) if trackPendingFix is true and owned by current user and statusReason is Pending Fix', () => {
				const currentUser = 'DOE, JOHN';
				const result = getStatus(
					{ ...row, StatusReason: 'Pending Fix' },
					existingCase,
					statuses.byIds,
					currentUser,
					true,
				);

				expect(result).toBe('pf');
			});

			it('should be removed if trackPendingFix is false even if owned by current user and statusReason is Pending Fix', () => {
				const currentUser = 'DOE, JOHN';
				const result = getStatus(
					{ ...row, StatusReason: 'Pending Fix' },
					existingCase,
					statuses.byIds,
					currentUser,
					false,
				);

				expect(result).toBe(false);
			});
		});

		describe('Case is Open', () => {
			let row = {
				Status: 'Open',
				CallCount: 2,
				AssignToName: 'DOE, JOHN',
				UpdateByName: 'PUFF, KYLE',
			};
			let existingCase = {
				status: { id: 're' },
				group: 'g1',
				callCount: 1,
				assignToName: 'Doe, John',
			};

			it('should be Reassigned (ra) if owner has changed', () => {
				const result = getStatus(
					row,
					{
						...existingCase,
						assignToName: 'Foo, Bar',
					},
					statuses.byIds,
				);

				expect(result).toBe('ra');
			});

			it('should be Updated (ud) if call count has changed and last updated by someone other than owner', () => {
				const result = getStatus(row, existingCase, statuses.byIds);

				expect(result).toBe('ud');
			});

			it('should be the same if call count has changed and last updated by owner', () => {
				const result = getStatus(
					{ ...row, UpdateByName: 'DOE, JOHN' },
					existingCase,
					statuses.byIds,
				);

				expect(result).toBe(existingCase.status.id);
			});

			it('should be Reopened (ro) if existing case is closed', () => {
				const result = getStatus(
					row,
					{
						...existingCase,
						status: { id: 'rs' },
					},
					statuses.byIds,
				);

				expect(result).toBe('ro');
			});

			it('should stay the same if nothing (owner/status/callCount) has changed', () => {
				const result = getStatus(
					{ ...row, CallCount: 1, UpdateByName: 'DOE, JOHN' },
					existingCase,
					statuses.byIds,
				);

				expect(result).toBe(existingCase.status.id);
			});
		});
	});
});

describe('Test getGroup()', () => {
	let currentUser = 'DOE, JOHN';
	let members = {
		'DOE, JOHN': 'self g3',
		'BAR, FOO': 'g1',
		'FOO, BAR': 'g1 g2',
	};

	it('should be "" when case is not assigned to a member and case was not touched by currentUser', () => {
		const row = {
			AssignToName: 'IPSUM, LOREM',
			InsertByName: 'DOLOR, MAN',
			UpdateByName: 'DOLOR, MAN',
		};
		const result = getGroup(row, members, currentUser);

		expect(result).toBe('');
	});

	it('should be "touched" when case is not assigned to a member and case was touched by currentUser', () => {
		const row = {
			AssignToName: 'IPSUM, LOREM',
			InsertByName: 'DOLOR, MAN',
			UpdateByName: 'DOE, JOHN',
		};
		const result = getGroup(row, members, currentUser);

		expect(result).toBe('touched');
	});

	it('should have "touched" when case is assigned to a member and case was touched by currentUser', () => {
		const row = {
			AssignToName: 'FOO, BAR',
			InsertByName: 'DOLOR, MAN',
			UpdateByName: 'DOE, JOHN',
		};
		const result = getGroup(row, members, currentUser);

		expect(result).toBe('g1 g2 touched');
	});

	it('should contain "self" when case is assigned to currentUser', () => {
		const row = {
			AssignToName: 'DOE, JOHN',
			InsertByName: 'DOLOR, MAN',
			UpdateByName: 'FOO, BAR',
		};
		const result = getGroup(row, members, currentUser);

		expect(result).toBe('self g3');
	});

	it('should have a group when case is assigned to member', () => {
		const row = {
			AssignToName: 'FOO, BAR',
			InsertByName: 'DOLOR, MAN',
			UpdateByName: 'IPSUM, DOLOR',
		};
		const result = getGroup(row, members, currentUser);

		expect(result).toBe('g1 g2');
	});

	it('should have "touched" when case is assigned to a member and case was touched by currentUser', () => {
		const row = {
			AssignToName: 'FOO, BAR',
			InsertByName: 'DOLOR, MAN',
			UpdateByName: 'DOE, JOHN',
		};
		const result = getGroup(row, members, currentUser);

		expect(result).toBe('g1 g2 touched');
	});
});

describe('Test processStep()', () => {
	let store = AppStore.create({ statuses: { byIds: STATUSES } });
	let currentUser = 'DOE, JOHN';
	let user = {
		fname: 'john',
		lname: 'doe',
		trackPending: true,
	};
	let members = {
		'DOE, JOHN': 'self',
		'BAR, FOO': 'g1',
		'ZAR, MAN': 'g2',
	};
	const rowData = {
		CaseId: 123456,
		ProblemDescription: 'yadi yadi 123456789 inc123456789',
		Product: 'prod A',
		CaseType: 'prod type',
		SubType: 'sub type',
		AssignToName: 'BAR, FOO',
		InsertByName: 'IPSUM, DOLOR',
		UpdateByName: 'DOE, JOHN',
		InsertDate: '3/24/2018 18:08',
		UpdateDate: '3/27/2018 9:23',
		Status: 'Open',
		CallCount: 3,
	};
	const caseProps = {
		problem: '',
		product: '',
		caseType: '',
		subType: '',
		insertByName: '',
		updateByName: '',
		assignedByName: '',
		insertDate: 0,
		updateDate: 0,
		assignedDate: 0,
	};

	it('should be "false" if case is not in db, does not belong to a member and was not touched by current user', () => {
		const row = {
			...rowData,
			Status: 'Open',
			AssignToName: 'IPSUM, DOLOR',
			UpdateByName: 'JUICY, FRANK',
		};
		const result = processStep(
			row,
			store.cases.byIds,
			store.statuses.byIds,
			members,
			currentUser,
			user,
		);

		expect(result).toBe(false);
	});

	it('should be "false" if case is not in db and belongs to a member but status is closed', () => {
		const row = {
			...rowData,
			Status: 'Closed',
			StatusReason: 'Pending Fix',
			AssignToName: 'BAR, FOO',
		};
		const result = processStep(
			row,
			store.cases.byIds,
			store.statuses.byIds,
			members,
			currentUser,
			user,
		);

		expect(result).toBe(false);
	});

	it('should not be "false" if case is Open and belongs to a member', () => {
		const row = rowData;
		const expected = {
			caseId: 'R123456',
			problem: 'yadi yadi *****6789 inc123456789',
			product: 'prod A',
			caseType: 'prod type',
			subType: 'sub type',
			callCount: 3,
			callBacks: 0,
			insertByName: 'Ipsum, Dolor',
			updateByName: 'Doe, John',
			assignedByName: 'Doe, John',
			assignToName: 'Bar, Foo',
			insertDate: 1521914880,
			assignedDate: 1522142580,
			updateDate: 1522142580,
			lastTouched: 0,
			status: 'ut',
			flag: '',
			group: 'g1 touched',
			tickets: 'inc123456789',
		};
		const result = processStep(
			row,
			store.cases.byIds,
			store.statuses.byIds,
			members,
			currentUser,
			user,
		);

		expect(result).toEqual(expected);
	});

	it('should have lastTouched = updateDate if case is new and status is not "ut"', () => {
		const row = {
			...rowData,
			AssignToName: 'BAR, FOO',
			UpdateByName: 'BAR, FOO',
		};
		const result = processStep(
			row,
			store.cases.byIds,
			store.statuses.byIds,
			members,
			currentUser,
			user,
		);

		expect(result.status).toBe('re');
		expect(result.lastTouched).toBe(result.updateDate);
	});

	it('should retain lastTouched, flag, notes but update tickets, callbacks for existing case', () => {
		const row = {
			...rowData,
			AssignToName: 'DOE, JOHN',
			UpdateByName: 'CHILD, MAN',
		};

		let store = AppStore.create({
			statuses: { byIds: STATUSES },
			cases: {
				byIds: {
					R123456: {
						...caseProps,
						caseId: 'R123456',
						lastTouched: 234567891,
						assignToName: 'Doe, John',
						flag: 'es',
						status: 'es',
						callCount: 1,
						callBacks: 0,
						tickets: 'inc234567899',
						group: 'self',
						notes: [{ id: '1', text: 'test note' }],
					},
				},
			},
		});
		const result = processStep(
			row,
			store.cases.byIds,
			store.statuses.byIds,
			members,
			currentUser,
			user,
		);

		expect(result.lastTouched).toBe(234567891);
		expect(result.flag).toBe('es');
		expect(result.status).toBe('ud');
		expect(result.callCount).toBe(3);
		expect(result.callBacks).toBe(2);
		expect(result.notes.length).toBe(1);
		expect(result.tickets).toBe('inc123456789,inc234567899');
	});

	it('should reset callBacks, lastTouched and group when case changes hands to another member', () => {
		const row = {
			...rowData,
		};
		let store = AppStore.create({
			statuses: { byIds: STATUSES },
			cases: {
				byIds: {
					R123456: {
						...caseProps,
						caseId: 'R123456',
						lastTouched: 234567891,
						assignToName: 'Doe, John',
						flag: 'es',
						status: 'es',
						callCount: 2,
						callBacks: 1,
						tickets: '',
						group: 'self',
					},
				},
			},
		});
		const result = processStep(
			row,
			store.cases.byIds,
			store.statuses.byIds,
			members,
			currentUser,
			user,
		);

		expect(result.group).toBe('g1 touched');
		expect(result.lastTouched).not.toBe(234567891);
		expect(result.flag).toBe('es');
		expect(result.status).toBe('ra');
		expect(result.callCount).toBe(3);
		expect(result.callBacks).toBe(0);
	});

	it('should update group id when case switches from one member (not current user) to another member', () => {
		const row = {
			...rowData,
			UpdateByName: 'CHILD, MAN',
		};
		let store = AppStore.create({
			statuses: { byIds: STATUSES },
			cases: {
				byIds: {
					R123456: {
						...caseProps,
						caseId: 'R123456',
						lastTouched: 234567891,
						assignToName: 'Zar, Man',
						flag: '',
						status: 're',
						callCount: 2,
						callBacks: 1,
						tickets: '',
						group: 'g2',
					},
				},
			},
		});
		const result = processStep(
			row,
			store.cases.byIds,
			store.statuses.byIds,
			members,
			currentUser,
			user,
		);

		expect(result.group).toBe('g1');
		expect(result.lastTouched).not.toBe(234567891);
		expect(result.status).toBe('ra');
		expect(result.callCount).toBe(3);
		expect(result.callBacks).toBe(0);
	});

	it('should retain "touched" status when case switches from one member (not current user) to another member', () => {
		const row = {
			...rowData,
			UpdateByName: 'CHILD, MAN',
		};
		let store = AppStore.create({
			statuses: { byIds: STATUSES },
			cases: {
				byIds: {
					R123456: {
						...caseProps,
						caseId: 'R123456',
						lastTouched: 234567891,
						assignToName: 'Zar, Man',
						flag: '',
						status: 're',
						callCount: 2,
						callBacks: 1,
						tickets: '',
						group: 'g2 touched',
					},
				},
			},
		});
		const result = processStep(
			row,
			store.cases.byIds,
			store.statuses.byIds,
			members,
			currentUser,
			user,
		);

		expect(result.group).toBe('g1 touched');
		expect(result.lastTouched).not.toBe(234567891);
		expect(result.status).toBe('ra');
		expect(result.callCount).toBe(3);
		expect(result.callBacks).toBe(0);
	});

	it('should return false if case was not touched by currentUser and does not belong to any member', () => {
		const row = {
			...rowData,
			AssignToName: 'OTHER, MAN',
			UpdateByName: 'CHILD, MAN',
		};
		let store = AppStore.create({
			statuses: { byIds: STATUSES },
			cases: {
				byIds: {
					R123456: {
						...caseProps,
						caseId: 'R123456',
						lastTouched: 234567891,
						assignToName: 'Zar, Man',
						flag: '',
						status: 're',
						callCount: 2,
						callBacks: 1,
						tickets: '',
						group: 'g2 touched',
					},
				},
			},
		});
		const result = processStep(
			row,
			store.cases.byIds,
			store.statuses.byIds,
			members,
			currentUser,
			user,
		);

		expect(result).toBe(false);
	});

	describe('With Tracking Pending Fix set to false', () => {
		user.trackPending = false;

		it('should return false if new case and Closed/Pending Fix', () => {
			const row = {
				...rowData,
				Status: 'Closed',
				StatusReason: 'Pending Fix',
			};
			const store = AppStore.create({
				statuses: { byIds: STATUSES },
			});
			const result = processStep(
				row,
				store.cases.byIds,
				store.statuses.byIds,
				members,
				currentUser,
				user,
			);

			expect(result).toBe(false);
		});

		it('should return false if existing case and Closed/Pending Fix', () => {
			const row = {
				...rowData,
				Status: 'Closed',
				StatusReason: 'Pending Fix',
			};
			let store = AppStore.create({
				statuses: { byIds: STATUSES },
				cases: {
					byIds: {
						R123456: {
							...caseProps,
							caseId: 'R123456',
							lastTouched: 234567891,
							assignToName: 'Doe, John',
							flag: '',
							status: 're',
							callCount: 2,
							callBacks: 1,
							tickets: '',
							group: 'self',
						},
					},
				},
			});
			const result = processStep(
				row,
				store.cases.byIds,
				store.statuses.byIds,
				members,
				currentUser,
				user,
			);

			expect(result).toBe(false);
		});

		it('should return same status if nothing has changed', () => {
			const row = {
				...rowData,
			};
			let store = AppStore.create({
				statuses: { byIds: STATUSES },
				cases: {
					byIds: {
						R123456: {
							...caseProps,
							caseId: 'R123456',
							lastTouched: 234567891,
							assignToName: 'Bar, Foo',
							flag: '',
							status: 're',
							callCount: 3,
							callBacks: 1,
							tickets: '',
							group: 'self',
						},
					},
				},
			});
			const result = processStep(
				row,
				store.cases.byIds,
				store.statuses.byIds,
				members,
				currentUser,
				user,
			);

			expect(result.status).toBe('re');
		});
	});
});
