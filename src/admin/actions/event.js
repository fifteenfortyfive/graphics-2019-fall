import { commonThunk, denulled } from '../../actions';

import * as RemoteControlActions from './remote-control';

export function startEvent(eventId) {
  return commonThunk({
    method: 'POST',
    path: `/api/v1/events/${eventId}/start`,
  }, (dispatch, response) => {
    dispatch(RemoteControlActions.forceResyncEvent());
  });
}

export function finishEvent(eventId) {
  return commonThunk({
    method: 'POST',
    path: `/api/v1/events/${eventId}/finish`,
  }, (dispatch, response) => {
    dispatch(RemoteControlActions.forceResyncEvent());
  });
}

export function resumeEvent(eventId) {
  return commonThunk({
    method: 'POST',
    path: `/api/v1/events/${eventId}/resume`,
  }, (dispatch, response) => {
    dispatch(RemoteControlActions.forceResyncEvent());
  });
}

export function resetEvent(eventId) {
  return commonThunk({
    method: 'POST',
    path: `/api/v1/events/${eventId}/reset`,
  }, (dispatch, response) => {
    dispatch(RemoteControlActions.forceResyncEvent());
  });
}
