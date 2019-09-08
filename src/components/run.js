import {h, Component, Fragment} from 'preact';
import {connect} from 'react-redux';
import classNames from 'classnames';

import {getRun, getRunProgress} from '../selectors/runs';
import Avatar from './accounts/avatar';
import LiveTimer from './live-timer';
import ProgressBar from '../uikit/progress-bar';

import { runTime } from '../util';
import style from './run.mod.css';

class Run extends Component {
  renderMidRow() {
    const {
      midRow,
      game,
      team
    } = this.props;

    switch(midRow) {
      case "team":
        return (
          <div class={style.teamName}>{team.name}</div>
        );
      case "game":
      default:
        return (
          <div class={style.gameName}>{game.name}</div>
        );
    }
  }

  renderTimeRow() {
    const {
      run,
      timeRow
    } = this.props;

    if(timeRow) return timeRow;

    if(run.actual_seconds) {
      return (
        <div class={style.detail}>
          <span class={style.muted}>FINISHED: </span>
          <span class={style.estimate}>{runTime(run.actual_seconds)}</span>
        </div>
      );
    } else if(run.started_at) {
      return (
        <div class={style.detail}>
          <span class={style.muted}>IN PROGRESS: </span>
          <LiveTimer
            className={style.estimate}
            startedAt={run.started_at}
          />
        </div>
      );
    } else {
      return (
        <div class={style.detail}>
          <span class={style.muted}>ESTIMATE: </span>
          <span class={style.estimate}>{runTime(run.est_seconds)}</span>
        </div>
      );
    }

  }

  render() {
    const {
      game,
      runner,
      run,
      team,
      midRow = "game",
      showProgressBar = false,
      wrapText = true,
      progress,
      ready,
      className
    } = this.props;

    if(!ready) return null;

    return (
      <div
          class={classNames(style.run, className, {
            [style.noWrap]: !wrapText
          })}
          style={{'--color': `#${team.color}`}}
        >
        { ready
          ? <Fragment>
              <div class={style.runnerAvatar}>
                <Avatar src={runner.avatar_object_id} size={48} />
              </div>
              <div class={style.runInfo}>
                <div class={style.runnerName}>{runner.username}</div>
                {this.renderMidRow()}
                {this.renderTimeRow()}
                { showProgressBar &&
                  <ProgressBar
                    className={style.progress}
                    progress={progress}
                  />
                }
              </div>
            </Fragment>
          : null
        }
      </div>
    );
  }
};

const mapStateToProps = (state, props) => {
  const {runId} = props;

  const run = getRun(state, props);
  const game = run && state.games[run.game_id];
  const team = run && state.teams[run.team_id];
  const runner = run && state.accounts[run.account_id];
  const progress = run ? getRunProgress(state, props) : 0;

  return {
    run,
    game,
    runner,
    team,
    progress,
    ready: run && runner && game && team
  }
}

export default connect(
  mapStateToProps
)(Run);
