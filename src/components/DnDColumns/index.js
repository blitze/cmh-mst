import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { HEADERS, MAX_COLS } from '../../constants';

export default class DnDColumns extends PureComponent {
	static propTypes = {
		value: PropTypes.array.isRequired,
		name: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired,
	};

	sizes = {};

	constructor(props) {
		super(props);

		this.state = {
			isFull: false,
			numSelected: 0,
			columns: [],
		};
	}

	getDefaultColumns = () => {
		// remove status header from object
		const { ss, ...rest } = HEADERS;
		return [
			{
				id: 'ac',
				name: 'Available Headers',
				items: Object.values(rest),
			},
			{
				id: 'sc',
				name: 'Selected Headers',
				items: [],
			},
		];
	};

	componentDidMount() {
		const columns = this.getDefaultColumns();
		let numSelected = 0;

		this.props.value.forEach(colId => {
			const index = columns[0].items.findIndex(
				column => column.id === colId,
			);

			if (index > -1) {
				const column = columns[0].items[index];
				const nextSelectedCount = column.size + numSelected;

				if (nextSelectedCount <= MAX_COLS) {
					// add to selected column and increase selected count
					columns[1].items.push(column);
					numSelected = nextSelectedCount;

					// remove from available column
					columns[0].items.splice(index, 1);
				}
			}
		});

		this.setState({
			isFull: numSelected === MAX_COLS,
			numSelected,
			columns,
		});
	}

	onDragStart = result => {
		this.setState({
			isFull:
				result.source.droppableId === 'ac' &&
				this.state.numSelected === MAX_COLS
					? true
					: false,
		});
	};

	onDragEnd = result => {
		let { columns, numSelected } = this.state;

		// dropped outside the list
		if (result.destination === null) {
			return;
		}

		if (result.destination.droppableId !== result.source.droppableId) {
			if (result.source.droppableId === 'sc') {
				numSelected -= this.sizes[result.draggableId];
			} else {
				numSelected += this.sizes[result.draggableId];
			}

			if (numSelected > MAX_COLS) {
				return;
			}
		}

		const colKeys = { ac: 0, sc: 1 };
		const sourceColumnIndex = colKeys[result.source.droppableId];
		const destinationColumnIndex = colKeys[result.destination.droppableId];

		const sourceColumn = columns[sourceColumnIndex];
		const destinationColumn = columns[destinationColumnIndex];

		const [removed] = sourceColumn.items.splice(result.source.index, 1);
		destinationColumn.items.splice(result.destination.index, 0, removed);

		this.setState({
			columns: [...columns],
			numSelected,
		});

		if (this.props.onChange) {
			let value = columns[1].items.reduce((colIds, column) => {
				colIds.push(column.id);
				return colIds;
			}, []);

			// add status column
			value.push('ss');

			this.props.onChange({
				target: {
					name: this.props.name,
					value,
				},
			});
		}
	};

	renderItems(items) {
		return items.map((item, index) => {
			this.sizes[item.id] = item.size;
			return (
				<Draggable key={item.id} draggableId={item.id} index={index}>
					{(provided, snapshot) => (
						<div className="list-group">
							<div
								ref={provided.innerRef}
								className="list-group-item"
								{...provided.draggableProps}
								{...provided.dragHandleProps}
							>
								<div>
									{item.text}
									<span className="badge badge-secondary pull-right">
										{item.size}
									</span>
								</div>
							</div>
							{provided.placeholder}
						</div>
					)}
				</Draggable>
			);
		});
	}

	renderColumns() {
		const { columns } = this.state;

		return columns.map(column => {
			return (
				<Droppable
					droppableId={column.id}
					key={column.id}
					isDropDisabled={column.id === 'sc' && this.state.isFull}
				>
					{(provided, snapshot) => (
						<div
							ref={provided.innerRef}
							className="mr-4"
							style={{
								padding: 10,
								minWidth: 200,
								background: snapshot.isDraggingOver
									? '#ccc'
									: '#ddd',
								border: snapshot.isDraggingOver
									? '1px solid #000'
									: '1px solid #ddd',
							}}
						>
							<p className="text-center">
								<strong>{column.name}</strong>
							</p>
							{this.renderItems(column.items)}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			);
		});
	}

	render() {
		return (
			<div>
				<div className="text-right text-muted mr-4">
					<small>
						{this.state.numSelected}/{MAX_COLS} available columns
					</small>
				</div>
				<div style={{ display: 'flex' }} onMouseUp={this.onMouseUp}>
					<DragDropContext
						onDragStart={this.onDragStart}
						onDragEnd={this.onDragEnd}
					>
						{this.renderColumns()}
					</DragDropContext>
				</div>
			</div>
		);
	}
}
