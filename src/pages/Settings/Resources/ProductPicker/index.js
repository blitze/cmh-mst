import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, decorate } from 'mobx';
import classnames from 'classnames';

const ProductPicker = class ProductPicker extends Component {
	formDefaults = { product: '', caseType: '', subType: '' };

	showForm = false;
	form = {};
	products = [];

	constructor(props) {
		super(props);

		this.form = { ...this.formDefaults };
		this.products = [...(props.products || [])];
	}

	handleDelete = index => e => {
		e.preventDefault();
		this.products = [
			...this.products.slice(0, index),
			...this.products.slice(index + 1),
		];
		this.props.onChange({ products: this.products });
	};

	handleToggleForm = e => {
		e.preventDefault();
		this.showForm = !this.showForm;
	};

	handleChange = prop => e => {
		this.form[prop] = e.currentTarget.value;
	};

	handleSubmit = e => {
		e.preventDefault();
		const { product, caseType, subType } = this.form;
		const newProduct = [product, caseType, subType]
			.filter(String)
			.join(' > ');

		this.products.push(newProduct);
		this.showForm = false;
		this.form = this.formDefaults;
		this.props.onChange({ products: this.products });
	};

	render() {
		const toggleIcon = classnames({
			'fa fa-plus': !this.showForm,
			'fa fa-minus': this.showForm,
		});

		return (
			<div>
				<a
					href="/"
					className="text-warning m-1"
					onClick={this.handleToggleForm}
				>
					<i className={toggleIcon} />
				</a>
				{!!this.products.length && (
					<div className="p-2 pt-0">
						{this.products.map((product, i) => (
							<span
								key={i}
								className="badge badge-pill badge-light mr-1"
							>
								{product}
								<a href="/" onClick={this.handleDelete(i)}>
									<i className="fa fa-close ml-2" />
								</a>
							</span>
						))}
					</div>
				)}
				{this.showForm && (
					<form className="bg-light p-4 rounded">
						<div className="form-group row">
							<label
								htmlFor="product"
								className="col-sm-4 col-form-label"
							>
								Product*
							</label>
							<div className="col-sm-8">
								<input
									type="text"
									className="form-control form-control-sm"
									id="product"
									placeholder="Product"
									onChange={this.handleChange('product')}
								/>
							</div>
						</div>
						<div className="form-group row">
							<label
								htmlFor="caseType"
								className="col-sm-4 col-form-label"
							>
								Case Type
							</label>
							<div className="col-sm-8">
								<input
									type="text"
									className="form-control form-control-sm"
									id="caseType"
									placeholder="Case Type"
									onChange={this.handleChange('caseType')}
								/>
							</div>
						</div>
						<div className="form-group row">
							<label
								htmlFor="caseType"
								className="col-sm-4 col-form-label"
							>
								Sub Type
							</label>
							<div className="col-sm-8">
								<input
									type="text"
									className="form-control form-control-sm"
									id="subType"
									placeholder="Sub Type"
									onChange={this.handleChange('subType')}
								/>
							</div>
						</div>
						<div className="form-group row">
							<div className="col-sm-10">
								<button
									type="reset"
									className="btn btn-primary mr-2"
									onClick={this.handleToggleForm}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="btn btn-danger"
									onClick={this.handleSubmit}
								>
									Submit
								</button>
							</div>
						</div>
					</form>
				)}
			</div>
		);
	}
};

decorate(ProductPicker, {
	showForm: observable,
	form: observable,
	products: observable,

	handleDelete: action,
	handleToggleForm: action,
	handleChange: action,
	handleSubmit: action,
});

export default observer(ProductPicker);
