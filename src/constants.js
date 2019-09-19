import queryString from 'query-string';

const {api_base: queryAPIBase} = queryString.parse(window.location.search);

export const API_BASE_URL = queryAPIBase || "http://localhost:3000";
export const ASSETS_URL = "https://fifteenfortyfive-assets.nyc3.cdn.digitaloceanspaces.com";


export const EVENT_ID = 23;

export const Colors = {
  TWITCH: '#6441A4'
};

export const RunUpdateTypes = {
  STARTED: 'run_started',
  FINISHED: 'run_finished',
  RESUMED: 'run_resumed',
  RESET: 'run_reset',
};


export const ADMIN_SESSION_COOKIE_NAME = "1545_session_id";


export const CollectionTypes = {
  ACCOUNTS: 'accounts',
  EVENT: 'event',
  GAMES: 'games',
  RUNS: 'runs',
  TEAMS: 'teams',
}

export const EventStates = {
  READY: 'ready',
  STARTED: 'started',
  PAUSED: 'paused',
  FINISHED: 'finished'
};
