import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';

import { NaviTabs, TabList, TabPane, Tab } from '../../../components/NaviTabs';
import { Form, InputGroup, Button } from '../../../components/Form';
import EditableList from '../../../components/EditableList';
import SortableList from '../../../components/SortableList';
import Group from './Group.js';

const getGroup = (id, groups) => groups.filter(x => x.id === id).pop();

const GroupSettings = ({ groups, user, match, history }) => {
	const groupId = match.params.groupId;
	const group = getGroup(groupId, groups.list);
	const handleGroupAdd = data => {
		const { id } = groups.add(data);
		history.push(`/settings/groups/${id}`);
	};
	const handleGroupMemberChange = member => data => member.update(data);
	const handleGroupMemberDelete = member => () => member.delete();

	if (!group && groups.list.length && groups.list[0].id !== groupId) {
		return <Redirect to={`/settings/groups/${groups.list[0].id}`} />;
	}

	return (
		<div className="mt-4">
			<span className="mb-5 ml-4 text-center text-muted">
				Manage groups of representatives whose cases you'd like to track
			</span>
			<hr />
			<NaviTabs direction="vertical">
				<TabList>
					<div className="container-fluid pl-0">
						<Form onSubmit={handleGroupAdd} reset>
							<InputGroup name="name" placeholder="Group name">
								<Button
									type="submit"
									className="btn btn-success"
								>
									New Group
								</Button>
							</InputGroup>
						</Form>
					</div>
					<SortableList
						list={groups.list}
						renderItem={(row, dragHandlerProps) => (
							<Tab
								className="px-0"
								to={'/settings/groups/' + row.id}
							>
								<Group
									selected={row.id === groupId}
									row={row}
									{...dragHandlerProps}
								/>
							</Tab>
						)}
						onChange={groups.reOrder}
					/>
				</TabList>
				{group && (
					<TabPane>
						<div className="pull-right ml-4">
							<Form onSubmit={group.addMember} reset>
								<InputGroup
									name="name"
									placeholder="Last name, First name"
								>
									<Button className="btn btn-info">
										Add Rep
									</Button>
								</InputGroup>
								<input
									type="hidden"
									name="groupId"
									value={groupId}
								/>
							</Form>
							<span className="font-weight-light text-muted">
								Please enter the Representative's name
								<br />
								as it appears in Case management
							</span>
						</div>
						<div className="fw-editable">
							<EditableList
								list={group.members}
								changeHandler={handleGroupMemberChange}
								deleteHandler={handleGroupMemberDelete}
								emptyListMsg="This group currently has no assigned representatives"
							/>
						</div>
					</TabPane>
				)}
			</NaviTabs>
			{user.role === 'mg' && (
				<div className="mt-5">
					<Link to="/settings/general">
						<i className="fa fa-chevron-left mr-2" />
						General Settings
					</Link>
				</div>
			)}
		</div>
	);
};

GroupSettings.propTypes = {
	groupId: PropTypes.string,
	groups: PropTypes.object,
	user: PropTypes.object,
};

export default inject('groups', 'user')(observer(GroupSettings));
