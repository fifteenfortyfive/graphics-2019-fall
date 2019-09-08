import {h, Component, createRef} from 'preact';
import {connect} from 'react-redux';
import classNames from 'classnames';
import TimelineMax from 'gsap/TimelineMax';
import _ from 'lodash';

import Run from '../run';
import {StretchReveal} from '../../uikit/masks';
import {runTime} from '../../util';

import {RunUpdateTypes} from '../../constants';
import style from './run-update.mod.css';

class RunUpdate extends Component {
  constructor(props) {
    super(props);
    this.timeline = new TimelineMax({paused: true, autoRemoveChildren: true});

    this.state = {
      inProgress: false
    }
  }

  componentDidUpdate(prevProps) {
    const {update, ready, onComplete} = this.props;
    const {inProgress} = this.state;

    if(ready && !inProgress) {
      this.animate();
    }
  }

  animate() {
    const {update, onComplete} = this.props;

    this.setState({inProgress: true});
    this.timeline
        .set("#updateClipRect", {scaleX: 0})
        .to("#updateClipRect", 1.2, {scaleX: 1, ease: "Power4.easeInOut"})
        .to("#updateClipRect", 1.2, {scaleX: 0, ease: "Power4.easeInOut"}, "+=5")
        .addCallback(() => {
          onComplete(update.updateId);
          this.setState({inProgress: false});
        })
        .play();

  }

  render() {
    const {
      update,
      run,
      team,
      game,
      runner,
      ready,
      className
    } = this.props;

    return (
      <StretchReveal
          pathId="updateClipPath"
          rectId="updateClipRect"
          objectId="updateObject"
        >
        { ready &&
          <div class={classNames(style.container, className)} style={{'--color': `#${team.color}`}}>
            <p class={style.text}>
              <strong>{runner.username}</strong> just finished <strong>{game.name}</strong> in <strong>{runTime(run.actual_seconds || 0)}</strong> for <strong>{team.name}</strong>!
            </p>
          </div>
        }
      </StretchReveal>
    );
  }
};

const mapStateToProps = (state, props) => {
  const {update} = props;
  const {runId} = update || {};

  const run = state.runs[runId];
  const game = run && state.games[run.game_id];
  const team = run && state.teams[run.team_id];
  const runner = run && state.accounts[run.account_id];
  const fetching = state.fetching[`runs.${runId}`];

  return {
    update,
    run,
    game,
    runner,
    team,
    ready: run && runner && game && team && !fetching
  }
}

export default connect(
  mapStateToProps
)(RunUpdate);
