import {createSelector} from 'reselect';
import {DateTime} from 'luxon';
import _ from 'lodash';

import {getCurrentTime} from './time';
import {getActiveRunIds} from './active-runs';

const getRuns = (state) => state.runs;

export const getFeaturedRunId = (state) => state.featuredRun && state.featuredRun.runId;
export const getRotationInterval = (state) => state.featuredRun && state.featuredRun.rotationInterval;
export const getRotationEnabled = (state) => state.featuredRun && state.featuredRun.rotationEnabled;
export const getRotateAtRaw = (state) => state.featuredRun && state.featuredRun.rotateAt;

export const getRotateAt = createSelector(
  [getRotateAtRaw],
  (rawTime) => rawTime && DateTime.fromISO(rawTime)
);

export const getFeaturedRun = createSelector(
  [getRuns, getFeaturedRunId],
  (runs, runId) => runs[runId]
);

export const shouldRotate = createSelector(
  [getRotationEnabled, getRotateAt, getCurrentTime],
  (rotationEnabled, rotateAt, currentTime) => {
    if(!rotationEnabled || !rotateAt || !currentTime) return false;

    return rotateAt.diff(currentTime).valueOf() <= 0;
  }
);

export const getNextRotatesAt = createSelector(
  [getCurrentTime, getRotationInterval],
  (currentTime, rotationInterval) => {
    if(currentTime == null || rotationInterval == null) return null;

    return currentTime.plus({seconds: rotationInterval}).toISO();
  }
)

export const getNextFeaturedRunId = createSelector(
  [getFeaturedRunId, getActiveRunIds],
  (featuredRunId, activeRunIds) => {
    const featuredIndex = _.findIndex(activeRunIds, (id) => id == featuredRunId) || 0;
    return activeRunIds[(featuredIndex + 1) % activeRunIds.length];
  }
)
