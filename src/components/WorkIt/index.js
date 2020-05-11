import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Dropdown from '../Dropdown';

function getResourceItems(str) {
	const regexToken = /^((ftp|http|mailto|www)s?)(:|.).+/gim;

	let resource = [];
	let matchArray;

	do {
		matchArray = regexToken.exec(str);

		if (matchArray) {
			resource.push({
				asset: matchArray[0],
				type: !matchArray[1] ? 'email' : 'url',
			});
		}
	} while (matchArray);

	return resource;
}

const executeResourceItem = {
	url: item => window.parent.open(item.asset, item.asset),
	email: (item, caseNum) => {
		const subject = caseNum + ' - ';
		let parts = item.asset.split('subject=');

		if (!parts[1]) {
			parts[0] += parts[0].indexOf('?') < 0 ? '?' : '&';
			parts[1] = subject;
		} else {
			parts[1] = subject + parts[1];
		}

		const address = parts.join('subject=') + '&cc=ECS SENIORS';
		const mailToWin = window.parent.open(address);
		if (mailToWin) {
			setTimeout(() => mailToWin.close(), 2000);
		}
	},
};

const WorkItItem = ({ title, onClick }) => (
	<a className="dropdown-item" href="/" onClick={onClick}>
		{title}
	</a>
);

const caseClassification = ['product', 'caseType', 'subType'];

function WorkIt({ row, className, color = 'info', resources }) {
	const getResources = () => {
		let prevPart = '';
		return caseClassification.reduce((list, part) => {
			prevPart += row[part].toLowerCase();

			const resourceItems = (resources.byProducts[prevPart] || []).filter(
				x => x.resource,
			);

			list = [...list, ...resourceItems];
			prevPart += ' > ';
			return list;
		}, []);
	};

	const handleClick = (data, close) => e => {
		e.preventDefault();

		if (data.notes) {
			resources.showNotes(data.notes);
		}

		const items = getResourceItems(data.resource);

		items.map(item => executeResourceItem[item.type](item, row.caseId));
		close();
	};

	const list = getResources();
	if (!list.length) return null;

	return (
		<Dropdown
			className={className}
			renderTrigger={toggle => (
				<button
					type="button"
					className={`btn btn-${color}`}
					onClick={toggle}
				>
					Work It
				</button>
			)}
			renderContent={close =>
				list.map((item, i) => (
					<WorkItItem
						key={i}
						title={item.title}
						onClick={handleClick(item, close)}
					/>
				))
			}
		/>
	);
}

WorkIt.propTypes = {
	className: PropTypes.string,
	color: PropTypes.string,
	resources: PropTypes.object.isRequired,
	row: PropTypes.object.isRequired,
};

export default inject('resources')(observer(WorkIt));
