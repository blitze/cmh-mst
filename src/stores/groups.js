import { types, getParent, applySnapshot, destroy } from 'mobx-state-tree';
import shortid from 'shortid';

import { ucwords } from '../utils';

const Member = types
	.model({
		id: types.optional(types.identifier, () => shortid.generate()),
		name: types.string,
	})
	.actions(self => ({
		update(name) {
			self.name = ucwords(name);
		},
		delete() {
			getParent(self, 2).deleteMember(self);
		},
	}));

export const Group = types
	.model({
		id: types.optional(types.identifier, () => shortid.generate()),
		name: types.string,
		members: types.array(Member),
	})
	.actions(self => ({
		update({ name }) {
			self.name = ucwords(name);
		},
		delete() {
			getParent(self, 2).delete(self);
		},
		addMember({ name }) {
			self.members.push(Member.create({ name: ucwords(name) }));
		},
		deleteMember(member) {
			destroy(member);
		},
	}));

export const Groups = types
	.model({
		list: types.array(Group),
	})
	.views(self => ({
		get names() {
			return self.list.reduce((names, row) => {
				names[row.id] = row.name;
				return names;
			}, {});
		},
		get members() {
			return self.list.reduce(
				(members, group) =>
					group.members.reduce((members, row) => {
						members[row.name.toUpperCase()] = group.id;
						return members;
					}, members),
				{},
			);
		},
		get isSet() {
			return !!self.list.length;
		},
	}))
	.actions(self => ({
		add({ name }) {
			const group = Group.create({ name });
			self.list.push(group);
			return group;
		},
		reOrder(list) {
			applySnapshot(self, { list });
		},
		delete(group) {
			destroy(group);
		},
	}));
