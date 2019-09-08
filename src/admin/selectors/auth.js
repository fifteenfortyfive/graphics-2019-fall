import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';

import {ADMIN_SESSION_COOKIE_NAME} from '../../constants';
import Cookies from 'js-cookie';

export const isLoggedIn = (state) => {
  return !!Cookies.get(ADMIN_SESSION_COOKIE_NAME);
}
