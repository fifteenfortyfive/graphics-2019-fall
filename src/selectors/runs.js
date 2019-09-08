import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import _ from 'lodash';

import {timeFromISO} from '../util';

import {getCurrentTime} from './time';

const getRuns = (state) => Object.values(state.runs);
const getRunId = (_, props) => props.runId;
export const getRun = (state, props) => state.runs[props.runId];


export const getRunsByTeam = createSelector(
  [getRuns],
  (runs) => _.chain(runs)
    .sortBy('index')
    .groupBy('team_id')
    .value()
);


export const getCurrentRunSeconds = createCachedSelector(
  [getRun, getCurrentTime],
  (run, currentTime) => {
    const {started_at, est_seconds, actual_seconds} = run;
    if(actual_seconds) {
      return actual_seconds;
    } else if(started_at == null) {
      return 0;
    } else if(currentTime != null) {
      return currentTime.diff(timeFromISO(started_at)).as('seconds');
    } else {
      // If currentTime doesn't exist, we can't state progress.
      return 0;
    }
  }
)(getRunId);

export const getRunProgress = createCachedSelector(
  [getRun, getCurrentTime],
  (run, currentTime) => {
    const {finished, started_at, est_seconds} = run;
    if(finished) {
      return 100;
    } else if(started_at == null) {
      return 0;
    } else if(currentTime != null) {
      const elapsed = currentTime.diff(timeFromISO(started_at)).as('seconds');
      return Math.min(0.99, elapsed / est_seconds) * 100;
    } else {
      // If currentTime doesn't exist, we can't state progress.
      return 0;
    }
  }
)(getRunId);
