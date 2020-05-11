import { values } from 'mobx';
import { types, getParent, destroy, applySnapshot } from 'mobx-state-tree';
import { addDays, isToday, differenceInCalendarDays } from 'date-fns';

import { HEADERS } from '../constants';
import { Status } from './statuses';
import { getReminderDays } from '../utils';
import * as fields from '../components/Cases/fields';

const unchangeables = ['ut', 'dt', 'pd', 'ud', 'cs', 'rs'];

const Note = types
	.model('Note', {
		text: types.string,
		done: false,
	})
	.actions(self => ({
		update({ text }) {
			self.text = text;
		},
		toggle() {
			self.done = !self.done;
		},
		delete() {
			getParent(self, 2).deleteNote(self);
		},
	}));

export const Case = types
	.model('Case', {
		caseId: types.identifier,
		problem: types.string,
		product: types.string,
		caseType: types.string,
		subType: types.string,
		group: types.string,
		status: types.reference(Status),
		insertByName: types.string,
		updateByName: types.string,
		assignToName: types.string,
		assignedByName: types.string,
		insertDate: types.Date,
		updateDate: types.Date,
		assignedDate: types.Date,
		lastTouched: types.maybe(types.Date),
		customDueDate: types.maybe(types.Date),
		callCount: types.number,
		callBacks: types.number,
		tickets: types.string,
		flag: types.string,
		notes: types.array(Note),
	})
	.views(self => ({
		get dueDate() {
			if (self.customDueDate) {
				return self.customDueDate;
			}

			const { reminder } = self.status;
			const reminderDays = getReminderDays(reminder);

			return addDays(
				new Date(self.lastTouched || self.assignedDate),
				reminderDays,
			);
		},
		get timedStatus() {
			let statusId = self.status.id;

			if (!self.dueDate) {
				return statusId;
			}

			if (!unchangeables.includes(statusId)) {
				if (isToday(self.dueDate)) {
					statusId = 'dt'; // due today
				} else if (differenceInCalendarDays(self.dueDate, new Date())) {
					statusId = statusId === 'pf' ? 'cs' : 'pd'; // past due
				}
			}

			return statusId;
		},
	}))
	.actions(self => ({
		update(data) {
			Object.keys(data).forEach(key => {
				if (self.hasOwnProperty(key)) {
					self[key] = data[key];
					if (key === 'status') {
						self.customDueDate = undefined;

						const parent = getParent(self, 2);
						if (parent.collapsed === self.caseId) {
							parent.collapsed = '';
						}
					}
				}
			});
		},
		addNote({ text }) {
			self.notes.push(Note.create({ text }));
		},
		deleteNote(note) {
			destroy(note);
		},
		notify() {
			getParent(self, 2).addNotification(self.caseId);
		},
	}));

export const Cases = types
	.model('Cases', {
		byIds: types.map(Case),
		group: types.optional(types.string, 'self'),
		filterStack: types.map(types.string),
		sorting: types.map(types.string),
		collapsed: types.optional(types.string, ''),
		notifications: types.array(types.string),
	})
	.volatile(self => ({
		filters: { status: getParent(self).statuses.activeIds },
	}))
	.views(self => ({
		get cases() {
			return values(self.byIds);
		},
		get groupCases() {
			return self.cases.filter(x => x.group.includes(self.group));
		},
		get touchCount() {
			return self.cases.filter(x => x.group.includes('touched')).length;
		},
		get filterKeys() {
			return Object.keys(self.filters);
		},
		get filteredCases() {
			const fieldTypes = getFieldTypes();
			let groupCases = self.groupCases;

			if (self.filters.keyword) {
				const { keyword } = self.filters;
				const searchProps = {
					R: 'caseId',
					INC: 'tickets',
					P: 'problem',
				};
				const match = /(R|INC)[0-9]+/i.exec(keyword);
				const key = match ? match[1].toUpperCase() : 'P';
				const prop = searchProps[key];

				return self.cases.filter(x =>
					x[prop].toLowerCase().includes(keyword.toLowerCase()),
				);
			}

			// iteratively apply filters, reducing cases and adding to filterStack
			Object.keys(self.filters).forEach(filter => {
				const type = fieldTypes[filter];

				if (fields[type] && fields[type].selector) {
					const selector = fields[type].selector;

					self.filterStack[filter] = groupCases = selector(
						filter,
						self.filters[filter],
						groupCases,
					);
				}
			});

			return groupCases;
		},
		get inContext() {
			const field = self.sorting.get('field');
			const dir = self.sorting.get('dir');

			if (field) {
				return self.filteredCases.sort((a, b) => {
					const x =
						typeof a[field] === 'string'
							? a[field].toUpperCase()
							: a[field];
					const y =
						typeof b[field] === 'string'
							? b[field].toUpperCase()
							: b[field];

					let comparison = 0;
					if (x > y) {
						comparison = 1;
					} else if (x < y) {
						comparison = -1;
					}
					return dir === 'a' ? comparison : comparison * -1;
				});
			}
			return self.filteredCases;
		},
	}))
	.actions(self => ({
		addNote(note) {
			self.notes.put(note);
		},
		reset(group) {
			self.group = group;
			self.filters = { status: getParent(self).statuses.activeIds };
		},
		toggleCollapsed(caseId) {
			self.collapsed = self.collapsed !== caseId ? caseId : '';
		},
		applyFilter(field, value) {
			let filters = self.filters;

			const filterKeys = Object.keys(self.filters);
			const filterIndex = filterKeys.indexOf(field);

			// we remove/reset this filter and other filters down the line in the stack
			if (filterIndex > -1) {
				const removeKeys = filterKeys.slice(filterIndex);

				removeKeys.forEach(key => {
					delete filters[key];
				});
			}

			if (Object.keys(value).length) {
				filters[field] = value;
			}

			self.filters = { ...filters };
		},
		updateFilters(filters) {
			self.filters = filters;
		},
		applySorting(field) {
			const sortKey = self.sorting.get('field');
			const sortDir = self.sorting.get('dir');

			let dir = 'a';
			if (field === sortKey) {
				dir = sortDir === 'a' ? 'd' : 'a';
				field = sortDir === 'd' ? 'updateDate' : field;
			}

			self.sorting.set('dir', dir);
			self.sorting.set('field', field);
		},
		update(id, prop, value) {
			self.id.set(prop, value);
		},
		import(byIds) {
			console.log(byIds);
			applySnapshot(self, { byIds });
		},
		addNotification(row) {
			self.notifications.push(row);
		},
		removeNotification(caseId) {
			self.notifications.slice(self.notifications.indexOf(caseId), 1);
		},
	}));

const getFieldTypes = () =>
	Object.keys(HEADERS).reduce(
		(types, id) => {
			const row = HEADERS[id];
			return {
				...types,
				[row.field]: row.type,
				assignToName: 'Person',
			};
		},
		{ flag: 'Flag' },
	);
