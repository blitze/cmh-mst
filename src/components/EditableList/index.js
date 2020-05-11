import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import ListItem from './ListItem';

function EditableList({
	inNav,
	list,
	changeHandler,
	deleteHandler,
	renderer,
	field = 'name',
	editorType = 'TEXT',
	emptyListMsg = null,
}) {
	if (!list.length) return emptyListMsg;
	const style = !inNav
		? { maxHeight: '370px', overflow: 'auto' }
		: { listStyleType: 'none' };
	return (
		<ul className="list-group" style={style}>
			{list.map((row, index) => (
				<ListItem
					key={row.id || index}
					inNav={inNav}
					row={row}
					field={field}
					editorType={editorType}
					renderer={renderer}
					onSave={changeHandler}
					onDelete={deleteHandler}
				/>
			))}
		</ul>
	);
}

EditableList.propTypes = {
	inNav: PropTypes.bool,
	list: PropTypes.arrayOf(PropTypes.object).isRequired,
	changeHandler: PropTypes.func.isRequired,
	deleteHandler: PropTypes.func.isRequired,
	field: PropTypes.string,
	editorType: PropTypes.string,
	renderer: PropTypes.func,
	emptyListMsg: PropTypes.string,
};

export default observer(EditableList);
