import { commonThunk, denulled } from '../../actions';

export function loginUser(username, password) {
  return commonThunk({
    method: 'POST',
    path: '/api/v1/sessions',
    name: 'authenticate',
    body: denulled({
      username,
      password
    })
  }, (dispatch, response) => {
    dispatch(receiveAuthentication(response.session_id));
  });
}

export function logoutUser() {
  return commonThunk({
    method: 'DELETE',
    path: '/api/v1/sessions/delete',
  }, (dispatch, response) => {
    dispatch(receiveLogout());
  });
}


export function receiveAuthentication(sessionId) {
  return {
    type: 'RECEIVE_AUTH',
    data: {
      sessionId
    }
  };
}

export function receiveLogout(sessionId) {
  return {
    type: 'RECEIVE_LOGOUT',
    data: {}
  };
}
