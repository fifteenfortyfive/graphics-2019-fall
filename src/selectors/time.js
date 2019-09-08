import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';

import {DateTime} from 'luxon';

const getTimeUnit = (_, {unit}) => unit;
const getCurrentTimeRaw = (state) => state.currentTime;

export const getCurrentTime = createSelector(
  [getCurrentTimeRaw],
  (rawTime) => DateTime.fromISO(rawTime)
);

export const getCurrentTimeWithAccuracy = createCachedSelector(
  [getCurrentTime, getTimeUnit],
  (time, unit) => time.startOf(unit)
)(getTimeUnit);


export const getCurrentTimeToMinute = createSelector(
  [getCurrentTime],
  (time) => time.startOf('minute')
);

export const getCurrentTimeISOToMinute = createSelector(
  [getCurrentTime],
  (time) => time.startOf('minute').toISO()
);
