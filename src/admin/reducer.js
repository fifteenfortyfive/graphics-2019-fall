import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import _ from 'lodash';
import Cookies from 'js-cookie';
import {DateTime} from 'luxon';

import {
  ADMIN_SESSION_COOKIE_NAME,
  RunUpdateTypes
} from '../constants';

const defaultState = {
  dataIsReady: false,
  accounts: {},
  events: {},
  games: {},
  teams: {},
  runs: {},
  fetching: {},
  socket: {
    connected: false
  },
  sessionId: null,
  adminSocket: {
    connected: false
  },
};

const reducerActions = {
  'FETCH_STARTED': (state, {data}) => {
    return {
      ...state,
      fetching: {
        ...state.fetching,
        [data.fetchId]: true
      }
    };
  },

  'FETCH_SUCCEEDED': (state, {data}) => {
    return {
      ...state,
      fetching: {
        ...state.fetching,
        [data.fetchId]: false
      }
    };
  },

  'FETCH_FAILED': (state, {data}) => {
    return {
      ...state,
      fetching: {
        ...state.fetching,
        [data.fetchId]: 'failed'
      }
    };
  },

  'DATA_READY': (state, {data}) => {
    return {
      ...state,
      dataIsReady: true
    };
  },

  'RECEIVE_AUTH': (state, {data}) => {
    const { sessionId } = data;
    window.sessionId = sessionId;
    Cookies.set(ADMIN_SESSION_COOKIE_NAME, sessionId);
    return {
      ...state,
      sessionId
    };
  },

  'RECEIVE_LOGOUT': (state, {data}) => {
    window.sessionId = null;
    Cookies.remove(ADMIN_SESSION_COOKIE_NAME);
    return {
      ...state,
      sessionId: null
    };
  },

  'STREAM_SOCKET_OPENED': (state) => {
    return {
      ...state,
      adminSocket: {
        ...state.adminSocket,
        connected: true
      }
    };
  },

  'STREAM_SOCKET_CLOSED': (state) => {
    return {
      ...state,
      adminSocket: {
        ...state.adminSocket,
        connected: false
      }
    };
  },

  'RECEIVE_ACCOUNTS': (state, {data}) => {
    const {accounts} = data;
    const accountsById = _.reduce(accounts, (acc, account) => {
      acc[account.id] = account;
      return acc;
    }, {});

    return {
      ...state,
      accounts: {
        ...state.accounts,
        ...accountsById
      }
    }
  },

  'RECEIVE_STREAMS': (state, {data}) => {
    const {streams} = data;

    return {
      ...state,
      streams: {
        ...state.streams,
        ...streams
      }
    }
  },

  'RECEIVE_EVENTS': (state, {data}) => {
    const {events} = data;
    const eventsById = _.reduce(events, (acc, event) => {
      acc[event.id] = event;
      return acc;
    }, {});

    return {
      ...state,
      events: {
        ...state.events,
        ...eventsById
      }
    }
  },

  'RECEIVE_GAMES': (state, {data}) => {
    const {games} = data;
    const gamesById = _.reduce(games, (acc, game) => {
      acc[game.id] = game;
      return acc;
    }, {});

    return {
      ...state,
      games: {
        ...state.games,
        ...gamesById
      }
    }
  },

  'RECEIVE_TEAMS': (state, {data}) => {
    const {teams} = data;
    const teamsById = _.reduce(teams, (acc, team) => {
      acc[team.id] = team;
      return acc;
    }, {});

    return {
      ...state,
      teams: {
        ...state.teams,
        ...teamsById
      }
    }
  },

  'RECEIVE_RUNS': (state, {data}) => {
    const {runs} = data;
    const runsById = _.reduce(runs, (acc, run) => {
      acc[run.id] = run;
      return acc;
    }, {});

    return {
      ...state,
      runs: {
        ...state.runs,
        ...runsById
      }
    }
  },

  'RECEIVE_STREAM_STATE': (state, {data}) => {
    const {state: streamState} = data;
    return {
      ...state,
      ...streamState,
    };
  }
}

export function reducer(state = defaultState, action) {
  const func = reducerActions[action.type];
  const newState = func ? func(state, action) : state;
  return newState;
}

export const adminStore = createStore(reducer, applyMiddleware(thunk));
