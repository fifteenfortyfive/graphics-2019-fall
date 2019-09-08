import { commonThunk, denulled } from '../../actions';

import {CollectionTypes} from '../../constants';

export function pushAction(action) {
  return commonThunk({
    method: 'POST',
    path: '/api/live/push/action',
    name: 'push.action',
    body: remoteAction(action)
  });
}

export function pushForceResync(collection) {
  return commonThunk({
    method: 'POST',
    path: '/api/live/push/action',
    name: 'push.resync',
    body: forceResync(collection)
  });
}

export function forceResyncAccounts() {
  return pushForceResync(CollectionTypes.ACCOUNTS);
}

export function forceResyncEvent() {
  return pushForceResync(CollectionTypes.EVENT);
}

export function forceResyncGames() {
  return pushForceResync(CollectionTypes.GAMES);
}

export function forceResyncRuns() {
  return pushForceResync(CollectionTypes.RUNS);
}

export function forceResyncTeams() {
  return pushForceResync(CollectionTypes.TEAMS);
}


export function remoteAction(action) {
  return {
    type: 'REMOTE_ACTION',
    action,
  };
}

export function forceResync(collection) {
  return {
    type: 'FORCE_RESYNC',
    data: {
      collection
    }
  };
}
