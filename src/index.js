import './style/reset.css';
import './style/theme.css';

import { h, render } from 'preact';
import { Provider } from 'react-redux';
import {useRoutes} from 'hookrouter';

import App from './pages/app';
import PreShow from './pages/pre-show';
import StateSync from './pages/state-sync';
import {store} from './reducer';


import Admin from './admin/admin';
import {adminStore} from './admin/reducer';


const APP_ROUTES = {
  '/': () => (
    <Provider store={store}>
      <App />
      <StateSync />
    </Provider>
  ),
  '/preshow': () => (
    <Provider store={store}>
      <PreShow />
    </Provider>
  ),
  '/admin': () => (
    <Provider store={adminStore}>
      <Admin />
    </Provider>
  )
}

function Router(props) {
  const routeApp = useRoutes(APP_ROUTES);

  return routeApp;
};


render(<Router />, document.querySelector('#app-container'));
