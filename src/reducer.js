import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import _ from 'lodash';
import {DateTime} from 'luxon';

import {RunUpdateTypes} from './constants';

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
  runUpdateQueue: [],
  tick: 0,
  currentTime: DateTime.utc().toISO(),
  featuredRun: {
    runId: null,
    rotateAt: null,
    // Evenly split feature time within an hour across the 7 teams
    // This can be overwritten by the admin dashboard.
    rotationInterval: Math.floor(60 * 60 / 7),
    // `true` when the stream should automatically rotate to the next
    // stream when `rotateAt` is reached. `false` if it should stay
    // on the current run.
    rotationEnabled: true,
  },
  preshow: {
    activeOverlay: {}
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

  'STREAM_SOCKET_OPENED': (state) => {
    return {
      ...state,
      socket: {
        ...state.socket,
        connected: true
      }
    };
  },

  'STREAM_SOCKET_CLOSED': (state) => {
    return {
      ...state,
      socket: {
        ...state.socket,
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

  'RECEIVE_RUN_UPDATE': (state, {data}) => {
    const {runId, updateId, type} = data;

    if(type == RunUpdateTypes.FINISHED) {
      return {
        ...state,
        runUpdateQueue: [
          ...state.runUpdateQueue,
          { type, runId, updateId }
        ]
      };
    } else {
      return state;
    }
  },


  'RUN_UPDATE_HANDLED': (state, {data}) => {
    const {updateId} = data;

    return {
      ...state,
      runUpdateQueue: _.reject(state.runUpdateQueue, {updateId})
    };
  },

  'SET_FEATURED_RUN': (state, {data}) => {
    const {runId, rotateAt} = data;

    return {
      ...state,
      featuredRun: {
        ...state.featuredRun,
        runId,
        rotateAt
      }
    };
  },

  'SET_FEATURED_RUN_ROTATION_INTERVAL': (state, {data}) => {
    const {rotationInterval} = data;

    return {
      ...state,
      featuredRun: {
        ...state.featuredRun,
        rotationInterval,
      }
    };
  },

  'SET_FEATURED_RUN_ROTATION_ENABLED': (state, {data}) => {
    const {rotationEnabled} = data;

    return {
      ...state,
      featuredRun: {
        ...state.featuredRun,
        rotationEnabled,
      }
    };
  },

  'TIMER_TICK': (state, {data}) => {
    const {currentTime} = data;
    return {
      ...state,
      tick: state.tick + 1,
      currentTime
    };
  },

  'PRESHOW_SET_OVERLAY': (state, {data}) => {
    return {
      ...state,
      preshow: {
        ...state.preshow,
        activeOverlay: {
          ...data
        }
      }
    };
  }
}

export function reducer(state = defaultState, action) {
  const func = reducerActions[action.type];
  const newState = func ? func(state, action) : state;
  return newState;
}

export const store = createStore(reducer, applyMiddleware(thunk));
