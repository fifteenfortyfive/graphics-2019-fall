import * as AccountActions from './accounts';
import * as EventActions from './events';
import * as GameActions from './games';
import * as RunActions from './runs';
import * as TeamActions from './teams';

import {EVENT_ID} from '../constants';

export function fetchAll(eventId) {
  return (dispatch) => {
    Promise.all([
      dispatch(EventActions.fetchEvent(eventId)),
      dispatch(TeamActions.fetchTeams(eventId)),
      dispatch(AccountActions.fetchAccounts()),
      dispatch(GameActions.fetchGames()),
      dispatch(RunActions.fetchRuns(EVENT_ID, {}))
    ]).then(() => {
      dispatch(dataReady());
    })
  };
}

export function dataReady() {
  return {
    type: 'DATA_READY',
    data: {}
  };
}
