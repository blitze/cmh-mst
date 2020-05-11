// import 'core-js/shim';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import { onSnapshot, getSnapshot, destroy, onAction } from 'mobx-state-tree';
import 'mobx-react-lite/batchingForReactDom';

import App from './components/App';
import AppStore from './stores';
import { config } from './utils';

import './index.css';

// import registerServiceWorker from './registerServiceWorker';

const localStorageKey = 'ecs_cases';

const initialState = window.localStorage.getItem(localStorageKey)
	? JSON.parse(window.localStorage.getItem(localStorageKey))
	: {};

// if (process.env.NODE_ENV !== 'production') {
// 	if (!Object.keys(initialState).length) {
// 		const d = require('./data');
// 		initialState = d.getSampleData();
// 	}
// }

let store = AppStore.create(initialState);
let snapshotListener;

const createAppStore = snapshot => {
	// clean up snapshot listener
	if (snapshotListener) snapshotListener();

	// kill old store to prevent accidental use and run clean up hooks
	if (store) destroy(store);

	// create new one
	store = AppStore.create(snapshot);

	onAction(store, call => {
		config.onAction(call);
	});

	// connect local storage
	snapshotListener = onSnapshot(store, snapshot =>
		window.localStorage.setItem(localStorageKey, JSON.stringify(snapshot)),
	);

	return store;
};

const renderApp = (App, store) => {
	ReactDOM.render(
		<Provider {...store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>,
		document.getElementById('root'),
	);
};

renderApp(App, createAppStore(initialState));
// registerServiceWorker();

if (module.hot && process.env.NODE_ENV !== 'production') {
	module.hot.accept(['./stores'], () => {
		// Store definition changed, recreate a new one from old state
		renderApp(App, createAppStore(getSnapshot(store)));
	});

	module.hot.accept('./components/App', () => {
		renderApp(App, store);
	});
}
