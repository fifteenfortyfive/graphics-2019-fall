import { commonThunk, denulled } from '../actions';

import {CollectionTypes, EVENT_ID} from '../constants';

import {fetchAccounts} from './accounts';
import {fetchEvent} from './events';
import {fetchGames} from './games';
import {fetchRuns} from './runs';
import {fetchTeams} from './teams';

export function resync(dispatch, collection) {
  switch(collection) {
    case CollectionTypes.ACCOUNTS:
      dispatch(fetchAccounts());
      return;
    case CollectionTypes.EVENT:
      dispatch(fetchEvent(EVENT_ID));
      return;
    case CollectionTypes.GAMES:
      dispatch(fetchGames());
      return;
    case CollectionTypes.RUNS:
      dispatch(fetchRuns(EVENT_ID, {}));
      return;
    case CollectionTypes.TEAMS:
      dispatch(fetchTeams(EVENT_ID));
      return;
  }
}
