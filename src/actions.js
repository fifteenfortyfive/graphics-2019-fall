import _ from 'lodash';

import {API_BASE_URL} from './constants';

export const defaultHeaders = {
  'Accept': 'application/json'
};


export function fetchStarted(fetchId) {
  return {
    type: 'FETCH_STARTED',
    data: {fetchId}
  }
}

export function fetchSucceeded(fetchId) {
  return {
    type: 'FETCH_SUCCEEDED',
    data: {fetchId}
  }
}

export function fetchFailed(fetchId) {
  return {
    type: 'FETCH_FAILED',
    data: {fetchId}
  }
}


export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300 || response.status == 422) {
    return response;
  } else {
    throw response;
  }
};

export function parseJSON(response) {
  return response.json();
};


export function commonThunk(opts, then) {
  const {
    path,
    method = 'GET',
    credentials = 'include',
    name,
    query,
    body,
  } = opts;
  const fetchId = name || path;
  const url = `${API_BASE_URL}${path}?${query ? params(query) : ""}`;

  return dispatch => {
    dispatch(fetchStarted(fetchId));
    return fetch(url, {
          headers: defaultHeaders,
          method: method.toUpperCase(),
          credentials: credentials,
          body: JSON.stringify(body)
        })
        .then(checkStatus)
        .then(parseJSON)
        .then((response) => {
          dispatch(fetchSucceeded(fetchId));
          then && then(dispatch, response);
        });
  };
}

export function denulled(object) {
  return _.reduce(object, (acc, value, key) => {
    if(value != null) acc[key] = value;
    return acc;
  }, {});
}

function params(data) {
  return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');
}
