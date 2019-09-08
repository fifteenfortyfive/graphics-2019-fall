import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';

const getAdminSocket = (state) => state.adminSocket;

export const isConnected = createSelector(
  [getAdminSocket],
  (adminSocket) => adminSocket.connected
);
