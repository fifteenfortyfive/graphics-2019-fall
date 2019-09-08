import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import _ from 'lodash';

import {
  getSortedTeams,
  getTeam,
  getTeamId
} from './teams';

const getRuns = (state) => state.runs;

export const getSortedRunsByTeam = createSelector(
  [getRuns],
  (runs) => {
    const sorted = _.sortBy(Object.values(runs), 'index');
    return _.groupBy(sorted, 'team_id');
  }
);

export const getSortedRunsForTeam = createCachedSelector(
  [getSortedRunsByTeam, getTeamId],
  (runs, teamId) => {
    return runs[teamId];
  }
)(getTeamId);


export function getActiveRun(runs) {
  return _.find(runs, (run) => !run.finished)
      || runs[runs.length-1];
}

export const getActiveRunIds = createSelector(
  [getSortedRunsByTeam, getSortedTeams],
  (sortedRunsByTeam, teams) => {
    return _.map(teams, (team) => {
        const runs = sortedRunsByTeam[team.id];
        return getActiveRun(runs).id;
      });
  }
);
