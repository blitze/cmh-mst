import { types, getParent, destroy } from 'mobx-state-tree';

import { Case } from './cases';

const Alert = types
	.model({
		entry: types.reference(Case),
	})
	.actions(self => ({
		remove() {
			getParent(self, 2).remove(self);
		},
	}));

export const Alerts = types
	.model({
		items: types.optional(types.array(Alert), []),
	})
	.actions(self => ({
		add(caseId) {
			self.items.push(Alert.create({ entry: caseId }));
		},
		remove(item) {
			destroy(item);
		},
	}));
