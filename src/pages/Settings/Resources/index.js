import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Papa from 'papaparse';
import shortid from 'shortid';

import Resource from './Resource';
import Uploader from '../../../components/Uploader';

const Resources = ({ resources }) => {
	const handleImport = csv => {
		let data = [];
		Papa.parse(csv, {
			header: true,
			dynamicTyping: true,
			step: step => {
				const { products, resource, notes, ...rest } = step.data[0];

				data.push({
					id: shortid.generate(),
					resource: resource || '',
					notes: notes || '',
					products: products.split('\n'),
					...rest,
				});
			},
			complete: () => resources.import(data),
		});
	};

	const handleExport = () => {
		const data = Object.values(resources).reduce((data, resource) => {
			const { id, products, ...rest } = resource;
			if (products.length) {
				data.push({ ...rest, products: products.join('\n') });
			}
			return data;
		}, []);
		const csv = Papa.unparse(data);
		const csvData = new window.Blob([csv], {
			type: 'text/csv;charset=utf-8;',
		});
		const exportFilename = 'resources.csv';

		//IE11 & Edge
		if (window.navigator.msSaveBlob) {
			window.navigator.msSaveBlob(csvData, exportFilename);
		} else {
			//In FF link must be added to DOM to be clicked
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(csvData);
			link.setAttribute('download', exportFilename);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	return (
		<Fragment>
			<button
				type="button"
				className="btn btn-primary pull-right m-1"
				onClick={resources.add}
			>
				Add New Resource
			</button>
			<table className="table table-bordered">
				<thead className="thead-light">
					<tr>
						<th scope="col" width="15%">
							Title
						</th>
						<th scope="col" width="30%">
							Resource
						</th>
						<th scope="col" width="30%">
							Notes
						</th>
						<th scope="col" width="25%">
							Products
						</th>
						<th scope="col" />
					</tr>
				</thead>
				<tbody>
					{resources.list.map(row => (
						<Resource key={row.id} row={row} />
					))}
				</tbody>
			</table>
			<button
				type="button"
				className="btn btn-dark btn-sm pull-right ml-1"
				onClick={handleExport}
			>
				<i className="fa fa-download mr-2" />
				Export
			</button>
			<Uploader
				className="btn btn-dark btn-sm pull-right"
				onComplete={handleImport}
			/>
		</Fragment>
	);
};

Resources.propTypes = {
	resources: PropTypes.object,
};

export default inject('resources')(observer(Resources));
