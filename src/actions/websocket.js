import SturdyWebsocket from 'sturdy-websocket';
import queryString from 'query-string';

import * as RunActions from './runs';
import * as RunUpdateActions from './run-updates';
import * as ForceResyncActions from './force-resync';

const SOCKET_PATH = '/api/live/stream';
function getSocketURL() {
  const {socket_host} = queryString.parse(window.location.search);

  if(socket_host) return socket_host;

  const {host, protocol} = window.location;

  const wsProto = protocol == 'https' ? 'wss' : 'ws';

  return `${wsProto}://${host}${SOCKET_PATH}`;
};
const SOCKET = new SturdyWebsocket(getSocketURL());


export function bindSocketToDispatch(dispatch) {
  SOCKET.onopen = function(event) {
    console.log("[Stream Socket] connected");
    dispatch(streamSocketOpened());
  };
  SOCKET.onreopen = function(event) {
    console.log("[Stream Socket] re-connected");
    dispatch(streamSocketOpened());
  };
  SOCKET.ondown = function(event) {
    console.log("[Stream Socket] closed. Reconnecting...");
    dispatch(streamSocketClosed());
  };
  SOCKET.onerror = function(event) {
    console.log("[Stream Socket] errored. Reconnecting...");
    dispatch(streamSocketClosed());
  };
  SOCKET.onmessage = function(event) {
    handleSocketUpdate(dispatch, event);
  };
};

export function syncStateToServer(state) {
  SOCKET.send(JSON.stringify({
    type: 'state_sync',
    data: state
  }));
}



function handleSocketUpdate(dispatch, event) {
  const data = JSON.parse(event.data);

  const {type} = data;

  switch(type) {
    case 'run_started':
    case 'run_finished':
    case 'run_resumed':
    case 'run_restarted':
      dispatch(RunActions.fetchRun(data.run_id));
      dispatch(RunUpdateActions.receiveRunUpdate(data));
      return;
    case 'REMOTE_ACTION':
      const {action} = data;
      dispatch(action);
      return;
    case 'FORCE_RESYNC':
      const {collection} = data.data;
      ForceResyncActions.resync(dispatch, collection);
    default:
      return;
  }
};



export function streamSocketOpened() {
  return {
    type: 'STREAM_SOCKET_OPENED'
  };
};

export function streamSocketClosed() {
  return {
    type: 'STREAM_SOCKET_CLOSED'
  };
};
