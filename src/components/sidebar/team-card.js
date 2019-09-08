import { h, render, Component } from 'preact';
import { connect } from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';

import * as AccountActions from '../../actions/accounts';
import * as RunActions from '../../actions/runs';
import * as TeamActions from '../../actions/teams';
import {
  getActiveRun,
  getSortedRunsForTeam
} from '../../selectors/active-runs';
import {
  getTeam,
  getTeamProgress,
  isTeamFinished,
  getTeamLiveEstimate,
} from '../../selectors/teams';
import Run from '../run';
import LoadingSpinner from '../../uikit/loading-spinner';
import ProgressBar from '../../uikit/progress-bar';

import { EVENT_ID } from '../../constants';
import { runTime } from '../../util';
import style from './team-card.mod.css';


class TeamCard extends Component {
  componentDidMount() {
    const {teamId, dispatch} = this.props;
    dispatch(TeamActions.fetchTeam(teamId));
  }

  render() {
    const {
      ready,
      team,
      currentRun,
      sortedRuns,
      progress,
      isFinished,
      finalGameTime,
      className
    } = this.props;

    if(!ready) {
      return (
        <div class={style.teamCard}>
          <LoadingSpinner />
        </div>
      );
    }

    return (
      <div class={classNames(style.teamCard, className)} style={{'--color': `#${team.color}`}}>
        <div class={style.cardHeader}>
          <h1 class={style.teamName}>{team.name}</h1>
          <p class={style.gameCount}>
            Game {currentRun.index}/{sortedRuns.length}
          </p>
        </div>
        <div class={style.details}>
          { isFinished
            ? <div class={style.section}>
                <h2 class={style.finalRealTime}>
                  <span class={style.muted}>Finished: </span>
                  {runTime(team.actual_time_seconds)}
                </h2>
              </div>
            : <div class={style.section}>
                <Run
                  className={style.run}
                  runId={currentRun.id}
                  showProgressBar={true}
                  wrapText={false}
                />
              </div>
          }
        </div>
        <ProgressBar
          className={style.teamProgress}
          progress={progress}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { teamId } = props;

  const team = getTeam(state, props);
  const sortedRuns = getSortedRunsForTeam(state, props);

  return {
    team,
    sortedRuns,
    currentRun: getActiveRun(sortedRuns),
    progress: getTeamProgress(state, props),
    isFinished: isTeamFinished(state, props),
    finalGameTime: getTeamLiveEstimate(state, props),
    ready: !!team
  }
};

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamCard);
