import { commonThunk, denulled } from '../../actions';

import * as RemoteControlActions from './remote-control';

export function startTeam(eventId, teamId) {
  return commonThunk({
    method: 'POST',
    path: `/api/v1/events/${eventId}/teams/${teamId}/start`,
  }, (dispatch, response) => {
    dispatch(RemoteControlActions.forceResyncTeams());
  });
}

export function finishTeam(eventId, teamId) {
  return commonThunk({
    method: 'POST',
    path: `/api/v1/events/${eventId}/teams/${teamId}/finish`,
  }, (dispatch, response) => {
    dispatch(RemoteControlActions.forceResyncTeams());
  });
}

export function resumeTeam(eventId, teamId) {
  return commonThunk({
    method: 'POST',
    path: `/api/v1/events/${eventId}/teams/${teamId}/resume`,
  }, (dispatch, response) => {
    dispatch(RemoteControlActions.forceResyncTeams());
  });
}

export function resetTeam(eventId, teamId) {
  return commonThunk({
    method: 'POST',
    path: `/api/v1/events/${eventId}/teams/${teamId}/reset`,
  }, (dispatch, response) => {
    dispatch(RemoteControlActions.forceResyncTeams());
  });
}
