import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function SortableList({
	droppableId = 'droppable',
	list,
	renderItem,
	onChange,
}) {
	const handleDragEnd = result => {
		const { destination, source } = result;

		if (!destination) {
			return;
		}

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		const newList = [...list];
		const [removed] = newList.splice(source.index, 1);
		newList.splice(destination.index, 0, removed);

		onChange(newList);
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId={droppableId} direction="vertical">
				{provided => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{list.map((row, index) => (
							<Draggable
								key={row.id}
								draggableId={row.id}
								index={index}
							>
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}
									>
										{renderItem(
											row,
											provided.dragHandleProps,
											snapshot,
										)}
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}

SortableList.propTypes = {
	droppableId: PropTypes.string,
	list: PropTypes.array.isRequired,
	renderItem: PropTypes.func.isRequired,
	onChange: PropTypes.func,
};

export default observer(SortableList);
