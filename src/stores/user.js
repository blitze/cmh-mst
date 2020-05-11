import { types } from 'mobx-state-tree';
import { ucwords } from '../utils';

export const User = types
	.model({
		fName: types.optional(types.string, ''),
		lName: types.optional(types.string, ''),
		role: types.enumeration('Role', ['rp', 'mg']),
		trackPending: false,
		headers: types.array(types.string),
	})
	.views(self => ({
		get fullName() {
			return [self.lName, self.fName].filter(Boolean).join(', ');
		},
		get isSet() {
			return self.lName && self.fName;
		},
		get isManager() {
			return self.role === 'mg';
		},
	}))
	.actions(self => ({
		update(prop, value) {
			if (['fName', 'lName'].includes(prop)) {
				value = ucwords(value);
			}
			self[prop] = value;
		},
	}));
