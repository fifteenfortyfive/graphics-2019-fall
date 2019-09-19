import { commonThunk, denulled } from '../actions';

import {EVENT_ID} from '../constants';

export function fetchTeams(eventId) {
  return commonThunk({
    method: 'get',
    path: `/api/v1/events/${eventId}/teams`,
    name: 'teams',
    query: {
      event_id: eventId
    }
  }, (dispatch, response) => {
    dispatch(receiveTeams(response.teams))
  });
}

export function fetchTeam(teamId) {
  return commonThunk({
    method: 'get',
    path: `/api/v1/teams/${teamId}`,
    name: `teams.${teamId}`,
  }, (dispatch, response) => {
    dispatch(receiveTeams([response.team]))
  });
}



export function receiveTeams(teams) {
  return {
    type: 'RECEIVE_TEAMS',
    data: {
      teams
    }
  };
}
