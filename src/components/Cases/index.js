import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { observable, action, decorate } from 'mobx';
// import { SelectableGroup } from 'react-selectable-fast';
import {
	List,
	AutoSizer,
	CellMeasurer,
	CellMeasurerCache,
	WindowScroller,
} from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

import Case from './Case';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
//import Modal from '../Modal';

import './style.css';

const styles = {
	root: { marginBottom: 50 },
	container: {
		width: '100%',
		maxWidth: '100%',
	},
	list: {
		width: '100%',
		outline: 'none',
	},
};

class Cases extends Component {
	static propTypes = {
		group: PropTypes.string.isRequired,
		renderTitle: PropTypes.func.isRequired,
	};

	static defaultProps = {
		renderTitle: f => f,
	};

	collapsed = '';

	cache = new CellMeasurerCache({
		fixedWidth: true,
		defaultHeight: 46,
		keyMapper: key => {
			const rows = this.props.cases.inContext;
			return rows[key] ? rows[key].caseId : key;
		},
	});

	toggleCollapse = caseId => {
		this.cache.clear(caseId, 0);
		this.cache.clear(this.collapsed, 0);

		this.collapsed = this.collapsed !== caseId ? caseId : '';
		this.recomputeHeights();
	};

	recomputeHeights = () => this.node.recomputeRowHeights();

	componentDidMount() {
		this.props.cases.reset(this.props.group);
	}

	rowRenderer = ({ index, key, parent, isVisible, style }) => {
		const { cases } = this.props;
		const row = cases.inContext[index];

		return (
			<CellMeasurer
				key={key}
				cache={this.cache}
				parent={parent}
				columnIndex={0}
				rowIndex={index}
			>
				{({ registerChild }) => (
					<div ref={registerChild} style={style}>
						<Case
							row={row}
							isVisible={isVisible}
							collapsed={this.collapsed === row.caseId}
							toggleCollapse={this.toggleCollapse}
							recomputeHeights={this.recomputeHeights}
						/>
					</div>
				)}
			</CellMeasurer>
		);
	};

	listRef = node => (this.node = node);

	renderCases = ({ height, registerChild, scrollTop }) => {
		const { cases } = this.props;

		return (
			<div className="flex-fill">
				<AutoSizer disableHeight {...cases} style={{ width: '100%' }}>
					{({ width }) => (
						<div ref={registerChild}>
							<List
								autoHeight
								height={height}
								width={width}
								overscanRowCount={10}
								rowCount={cases.inContext.length}
								deferredMeasurementCache={this.cache}
								rowHeight={this.cache.rowHeight}
								rowRenderer={this.rowRenderer}
								scrollTop={scrollTop}
								containerStyle={styles.container}
								style={styles.list}
								ref={this.listRef}
								sortKey={cases.sorting.get('field')}
								sortDir={cases.sorting.get('dir')}
								{...cases}
							/>
						</div>
					)}
				</AutoSizer>
			</div>
		);
	};

	render() {
		const { cases } = this.props;

		return (
			<>
				<div className="container-fluid h-100">
					<div className="row h-100">
						<div className="col mt-3">
							<div className="d-flex justify-content-between mb-3">
								<div>
									Total:{' '}
									<span className="badge badge-danger">
										{cases.inContext.length}
									</span>
								</div>
								<div>{this.props.renderTitle(cases.group)}</div>
							</div>
							<Header recomputeHeights={this.recomputeHeights} />
							<WindowScroller
								{...cases}
								context={cases.inContext}
								sortKey={cases.sorting.get('field')}
								sortDir={cases.sorting.get('dir')}
							>
								{this.renderCases}
							</WindowScroller>
						</div>
						<div className="col-auto">
							<Sidebar recomputeHeights={this.recomputeHeights} />
						</div>
					</div>
				</div>

				<Footer />
			</>
		);

		// const {
		// 	caseIds,
		// 	groupId,
		// 	grpCaseIds,
		// 	headers,
		// 	renderTitle,
		// 	resources,
		// 	...rest
		// } = this.props;

		// return (
		// 	<GroupContext.Provider value={this.state}>
		// 		<div className="position-relative">
		// 			<div className="container-fluid mb-4">
		// 				<div className="d-flex">
		// 					<main
		// 						className="flex-grow-1 pr-0"
		// 						style={{
		// 							height: config.height,
		// 							overflowY: 'auto',
		// 						}}
		// 					>
		// 						Showing:
		// 						<span className="badge badge-danger mx-1">
		// 							{caseIds.length}
		// 						</span>
		// 						of
		// 						<span className="badge badge-info mx-1">
		// 							{grpCaseIds.length}
		// 						</span>
		// 						<div className="pull-right mb-3">
		// 							{renderTitle(groupId)}
		// 						</div>
		// 						<div className="clearfix" />
		// 						<Header
		// 							caseIds={caseIds}
		// 							groupId={groupId}
		// 							grpCaseIds={grpCaseIds}
		// 							headers={headers}
		// 							{...rest}
		// 						/>
		// 						{/*
		// 					<SelectableGroup
		// 						className="selectable"
		// 						onSelectionFinish={this.handleDragOver}
		// 						allowClickWithoutSelected={false}
		// 						enableDeselect={true}
		// 					>
		// 					*/}
		// 						{caseIds.map(id => (
		// 							<Case
		// 								key={id}
		// 								caseId={id}
		// 								headers={headers}
		// 								toggleCollapse={this.toggleCollapse}
		// 								resources={resources}
		// 							/>
		// 						))}
		// 						{/*
		// 					</SelectableGroup>
		// 					*/}
		// 					</main>
		// 					<Sidebar
		// 						caseIds={caseIds}
		// 						groupId={groupId}
		// 						grpCaseIds={grpCaseIds}
		// 						headers={headers}
		// 						{...rest}
		// 					/>
		// 				</div>
		// 			</div>
		// 		</div>

		// 		<Modal
		// 			show={!!this.state.notes}
		// 			footer={false}
		// 			title="Notes"
		// 			onCancel={this.closeModal}
		// 		>
		// 			<p>{this.state.notes}</p>
		// 		</Modal>

		// 		<Footer />
		// 	</GroupContext.Provider>
		// );
	}
}

decorate(Cases, {
	collapsed: observable,
	toggleCollapse: action,
});

export default inject('cases')(observer(Cases));
