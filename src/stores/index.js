import { types } from 'mobx-state-tree';

import { Alerts } from './alerts';
import { Cases } from './cases';
import { Groups } from './groups';
import { Resources } from './resources';
import { Statuses } from './statuses';
import { UI } from './ui';
import { User } from './user';

export default types.model('AppStore', {
	alerts: types.optional(Alerts, {}),
	cases: types.optional(Cases, {
		group: 'self',
		sorting: {
			dir: 'a',
			key: 'dueDate',
		},
	}),
	groups: types.optional(Groups, {}),
	resources: types.optional(Resources, {}),
	statuses: types.optional(Statuses, {}),
	ui: types.optional(UI, {}),
	user: types.optional(User, {
		role: 'rp',
		headers: ['ca', 'ab', 'lu', 'pr', 'cc', 'ss'],
	}),
});
