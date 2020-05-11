import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Navbar from '../Navbar';
import MyCases from '../../pages/MyCases';
import GroupCases from '../../pages/GroupCases';
import Settings from '../../pages/Settings';
import About from '../../pages/About';
import Intro from '../../pages/Intro';
import NoMatch from '../../pages/NoMatch';

import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.css';

const style = {
	position: 'relative',
	height: '100%',
};

function App() {
	return (
		<>
			<Navbar />
			<div style={style}>
				<Switch>
					<Route path="/" exact component={MyCases} />
					<Route path="/touched" exact component={MyCases} />
					<Route path="/welcome" component={Intro} />
					<Route
						path="/group/:groupId"
						exact
						component={GroupCases}
					/>
					<Route path="/settings" component={Settings} />
					<Route path="/about" component={About} />
					<Route component={NoMatch} />
				</Switch>
			</div>
		</>
	);
}

export default App;
