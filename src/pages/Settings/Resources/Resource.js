import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import EasyEdit, { Types } from 'react-easy-edit';

import ProductPicker from './ProductPicker';

const attributes = {
	resource: {
		className: 'form-control',
		placeholder:
			'- Enter URL (must begin with http/https/ftp e.g. https://ribit.fmr.com/)\n' +
			'- Enter an email address or mail group (must begin with mailto: e.g. mailto:full view prod support?subject=My email subject&body=My email content)\n' +
			'- You can add multiple URLs or emails per resource\n' +
			'- Enter each resource item on a new line',
		style: {
			display: 'block',
			minHeight: '90px',
		},
	},
	notes: {
		className: 'form-control',
		placeholder: 'Enter notes',
		style: {
			display: 'block',
			width: '100%',
			minHeight: '50px',
		},
	},
};

function Resource({ row }) {
	const handleChange = field => value => row.update({ [field]: value });
	return (
		<tr>
			<td>
				<EasyEdit
					type={Types.TEXT}
					value={row.title}
					attributes={{
						className: 'form-control',
					}}
					onSave={handleChange('title')}
					hideSaveButton={true}
					hideCancelButton={true}
				/>
			</td>
			<td className="fw-editable">
				<EasyEdit
					type={Types.TEXTAREA}
					value={row.resource}
					attributes={attributes.resource}
					onSave={handleChange('resource')}
				/>
			</td>
			<td className="fw-editable">
				<EasyEdit
					type={Types.TEXTAREA}
					value={row.notes}
					attributes={attributes.notes}
					onSave={handleChange('notes')}
				/>
			</td>
			<td className="p-0">
				<ProductPicker products={row.products} onChange={row.update} />
			</td>
			<td>
				<a href="/" className="" onClick={row.delete}>
					<i className="fa fa-close" />
				</a>
			</td>
		</tr>
	);
}

Resource.propTypes = {
	row: PropTypes.object.isRequired,
};

export default observer(Resource);
