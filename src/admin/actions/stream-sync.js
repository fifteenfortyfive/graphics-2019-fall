import SturdyWebsocket from 'sturdy-websocket';
import queryString from 'query-string';

const SOCKET_PATH = '/api/live/admin';
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
    console.log("[Sync Socket] connected");
    dispatch(streamSocketOpened());
  };
  SOCKET.onreopen = function(event) {
    console.log("[Sync Socket] re-connected");
    dispatch(streamSocketOpened());
  };
  SOCKET.ondown = function(event) {
    console.log("[Sync Socket] closed. Reconnecting...");
    dispatch(streamSocketClosed());
  };
  SOCKET.onerror = function(event) {
    console.log("[Sync Socket] errored. Reconnecting...");
    dispatch(streamSocketClosed());
  };
  SOCKET.onmessage = function(event) {
    handleSocketUpdate(dispatch, event);
  };
};



function handleSocketUpdate(dispatch, event) {
  const data = JSON.parse(event.data);

  const {type, data: state} = data;

  switch(type) {
    case 'state_sync':
      dispatch(receiveStreamState(state));
      return;
    default:
      return;
  }
};


export function receiveStreamState(state) {
  return {
    type: 'RECEIVE_STREAM_STATE',
    data: {
      state
    }
  };
}

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
