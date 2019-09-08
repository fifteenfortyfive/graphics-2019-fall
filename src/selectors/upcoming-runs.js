import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import _ from 'lodash';

import {timeFromISO} from '../util'

import {getCurrentTimeISOToMinute} from './time';
import {getRunsByTeam} from './runs';

// This is only updated once a minute because it's fairly expensive. The next
// best option is every second, which is way too frequent.
//
// Returns a map of teamId => [{runId, estimatedStartTime, isStarted}]
export const getEstimatedRunSchedulesByTeam = createSelector(
  [getCurrentTimeISOToMinute, getRunsByTeam],
  (currentTimeISO, runsByTeam) => {
    return _.mapValues(runsByTeam, (runs) => {
      let lastEndedAt = timeFromISO(currentTimeISO);
      return _.map(runs, (run, index) => {
        const runDuration = run.actual_seconds || run.est_seconds;
        if(run.started_at) {
          const startedAt = timeFromISO(run.started_at);
          lastEndedAt = startedAt.plus({seconds: runDuration});
          return {
            runId: run.id,
            estimatedStartTime: startedAt,
            isStarted: true,
          };
        } else {
          if(index === 0) lastEndedAt = timeFromISO(currentTimeISO);
          const result = {
            runId: run.id,
            estimatedStartTime: lastEndedAt.plus(0),
            isStarted: false
          };

          lastEndedAt = lastEndedAt.plus({seconds: runDuration});
          return result;
        }
      });
    });
  }
);

const getRequestedCount = (_, props) => props.count;

export const getUpcomingRuns = createSelector(
  [getEstimatedRunSchedulesByTeam, getRequestedCount],
  (runsByTeam, count) => {
    const sortedNextRuns = _.chain(runsByTeam)
        .flatMap()
        .reject('isStarted')
        .sortBy((r) => r.estimatedStartTime.toMillis())
        .value();

    if(count) {
      return sortedNextRuns.slice(0, count);
    } else {
      return sortedNextRuns;
    }
  }
);
