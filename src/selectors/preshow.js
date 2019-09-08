import {createSelector} from 'reselect';
import _ from 'lodash';

const getPreshow = (state) => state.preshow;

export const getActiveOverlay = createSelector(
  [getPreshow],
  (preshow) => preshow.activeOverlay
);
