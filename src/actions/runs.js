import { commonThunk, denulled } from '../actions';
import { EVENT_ID } from '../constants';

export function fetchRuns(eventId = EVENT_ID, {teamId, runIds} = {}) {
  return commonThunk({
    method: 'get',
    path: `/api/v1/events/${eventId}/runs`,
    name: 'runs',
    query: denulled({
      team_id: teamId,
      run_ids: runIds
    })
  }, (dispatch, response) => {
    dispatch(receiveRuns(response.runs));
  });
}

export function fetchRun(runId) {
  return commonThunk({
    method: 'get',
    path: `/api/v1/events/${EVENT_ID}/runs/${runId}`,
    name: `runs.${runId}`,
  }, (dispatch, response) => {
    dispatch(receiveRuns([response.run]));
  });
}



export function receiveRuns(runs) {
  return {
    type: 'RECEIVE_RUNS',
    data: {
      runs
    }
  };
}
