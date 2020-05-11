import { types, getParent, destroy } from 'mobx-state-tree';
import { keys, values } from 'mobx';
import shortid from 'shortid';

import { STATUSES } from '../constants';

export const Status = types
	.model({
		id: types.optional(types.identifier, () => shortid.generate()),
		text: types.string,
		reminder: types.string,
		color: types.string,
		active: true,
		selectable: true,
	})
	.actions(self => ({
		update(data) {
			Object.keys(data).forEach(key => {
				if (self[key] !== undefined) {
					self[key] = data[key];
				}
			});
		},
		delete(e) {
			e.preventDefault();
			getParent(self, 2).delete(self);
		},
	}));

export const Statuses = types
	.model({
		byIds: types.optional(types.map(Status), STATUSES),
	})
	.views(self => ({
		get ids() {
			return keys(self.byIds);
		},
		get list() {
			return values(self.byIds);
		},
		get activeIds() {
			return self.ids.filter(id => self.byIds.get(id).active);
		},
		get selectables() {
			return self.list.filter(x => x.selectable);
		},
		countCases(cases = []) {
			return cases.reduce((statuses, row) => {
				const statusId = row.timedStatus;

				statuses[statusId] = (statuses[statusId] || 0) + 1;

				return statuses;
			}, {});
		},
	}))
	.actions(self => ({
		add({
			text,
			color = '#000',
			reminder = '0d',
			active = false,
			selectable = false,
		}) {
			self.byIds.put(
				Status.create({
					text,
					reminder,
					color,
					active: !!active,
					selectable: !!selectable,
				}),
			);
		},
		delete(status) {
			destroy(status);
		},
	}));
