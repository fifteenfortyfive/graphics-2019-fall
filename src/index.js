import './style/reset.css';
import './style/theme.css';

import { h, render } from 'preact';
import { Provider, connect } from 'react-redux';

import App from './pages/app';
import PreShow from './pages/pre-show';
import StateSync from './pages/state-sync';
import {store} from './reducer';


import Admin from './admin/admin';
import {adminStore} from './admin/reducer';



if(window.location.pathname === '/admin') {
  render(
    <Provider store={adminStore}>
      <Admin />
    </Provider>
  , document.querySelector('#app-container'));
  // import 'preact/debug';
} else if(window.location.pathname === '/preshow') {
  render(
    <Provider store={store}>
      <PreShow />
    </Provider>
  , document.querySelector('#app-container'));
  // import 'preact/debug';
} else {
  render(
    <Provider store={store}>
      <App />
      <StateSync />
    </Provider>
  , document.querySelector('#app-container'));
}

