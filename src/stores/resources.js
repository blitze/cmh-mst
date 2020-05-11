import { types, getParent, destroy, applySnapshot } from 'mobx-state-tree';
import shortid from 'shortid';

const Resource = types
	.model({
		id: types.optional(types.identifier, () => shortid.generate()),
		title: types.optional(types.string, ''),
		resource: types.optional(types.string, ''),
		notes: types.optional(types.string, ''),
		products: types.array(types.string),
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

export const Resources = types
	.model({
		list: types.array(Resource),
	})
	.views(self => ({
		get byProducts() {
			return self.list.reduce((data, row) => {
				const { products = [], ...rest } = row;

				products.map(product => {
					product = product.toLowerCase();
					if (!data[product]) {
						data[product] = [];
					}
					return data[product].push({ ...rest });
				});
				return data;
			}, {});
		},
	}))
	.actions(self => ({
		add() {
			self.list.unshift(Resource.create());
		},
		import(data) {
			applySnapshot(self, { list: data });
		},
		delete(resource) {
			destroy(resource);
		},
		showNotes(notes) {
			self.notes = notes;
		},
		hideNotes() {
			self.notes = '';
		},
	}));
