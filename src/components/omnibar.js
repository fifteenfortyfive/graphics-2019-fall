import {h, Component} from 'preact';
import classNames from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';
import {DateTime} from 'luxon';

import * as EventStore from '../selectors/events';
import * as RunUpdateActions from '../actions/run-updates';
import GamesList from './omni/games-list';
import TeamRuns from './omni/team-runs';
import UpcomingRuns from './omni/upcoming-runs';
import RunUpdate from './omni/run-update';
import EventTimer from './event-timer';
import LiveTimer from './live-timer';
import ProgressBar from '../uikit/progress-bar';
import Sequenced from '../uikit/anim/sequenced';

import {RunUpdateTypes, EVENT_ID} from '../constants';
import style from './omnibar.mod.css';

class Omnibar extends Component {
  constructor(props) {
    super(props);
  }

  handleRunUpdateDisplayed(updateId) {
    const {dispatch} = this.props;

    dispatch(RunUpdateActions.runUpdateHandled(updateId));
  }

  render() {
    const {
      runUpdate,
      eventStartTime,
      className,
      dispatch
    } = this.props;


    return (
      <div class={classNames(style.omnibar, className)}>
        {/*<div class={style.logo}>
          <div class={style.logoText}>The 1545</div>
        </div>*/}

        <div class={style.content}>
          <div class={style.updateOverlay}>
            { runUpdate &&
              <RunUpdate
                className={style.updateContent}
                update={runUpdate}
                onComplete={this.handleRunUpdateDisplayed.bind(this)}
              />
            }
          </div>
          <TeamRuns teamId={1} />
          <ProgressBar className={style.progress} progress={10} color="red" />
          <ProgressBar className={style.progress} progress={12} color="blue" />
          <TeamRuns teamId={2} />
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state, props) => ({
  runUpdate: state.runUpdateQueue[0],
});

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Omnibar);
