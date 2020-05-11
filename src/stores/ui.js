import { types } from 'mobx-state-tree';

export const UI = types
	.model({
		modal: false,
	})
	.actions(self => ({
		openModal() {
			self.modal = true;
		},
		closeModal() {
			self.modal = false;
		},
	}));
