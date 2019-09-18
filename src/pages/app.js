import { h, render, Component } from 'preact';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as ActiveRunStore from '../selectors/active-runs';
import * as InitStore from '../selectors/init';
import * as InitActions from '../actions/init';
import * as TimerActions from '../actions/timers';
import * as WebSocketActions from '../actions/websocket';
import Layout from '../components/layout';
import EventTimer from '../components/event-timer';
import LoadingSpinner from '../uikit/loading-spinner';
import Omnibar from '../components/omnibar';
import Run from '../components/run';
import RunnerStream from '../components/runner-stream';
import Stream from '../components/stream';
import VerticalTeamList from '../components/vertical-team-list';

import { EVENT_ID } from '../constants';
import style from './app.mod.css';


class App extends Component {
  componentDidMount() {
    const {eventId, dispatch} = this.props;
    WebSocketActions.bindSocketToDispatch(dispatch);
    TimerActions.startTimers(dispatch, 1000);

    dispatch(InitActions.fetchAll(EVENT_ID));
  }

  componentWillUnmount() {
    TimerActions.stopTimers();
  }

  render() {
    const {
      eventId,
      redTeamId,
      blueTeamId,
      redActiveRunId,
      blueActiveRunId,
      ready
    } = this.props;

    return (
      <Layout>
        { !ready
          ? <LoadingSpinner />
          : <div class={style.layoutContainer}>
              <VerticalTeamList
                teamId={redTeamId}
                activeRunId={redActiveRunId}
                align="left"
                className={style.redTeam}
              />
              <div class={style.videos}>
                <RunnerStream
                  runId={redActiveRunId}
                  isFeatured={false}
                  includeFeaturedIndicator={false}
                  quality={Stream.Qualities.SOURCE}
                  volume={0.9}
                  className={style.main1}
                />
                <div class={style.centerLine}>
                  <div class={style.brand}>
                    <div class={style.logoText}>The 1545</div>
                  </div>
                  <div class={style.timerContainer}>
                    <EventTimer className={style.timer} eventId={EVENT_ID} />
                  </div>
                </div>
                <RunnerStream
                  runId={blueActiveRunId}
                  isFeatured={false}
                  includeFeaturedIndicator={false}
                  quality={Stream.Qualities.SOURCE}
                  volume={0.9}
                  className={style.main2}
                />
                <div class={style.redTeamIndicator} />
                <div class={style.blueTeamIndicator} />
              </div>
              <VerticalTeamList
                teamId={blueTeamId}
                activeRunId={blueActiveRunId}
                align="right"
                className={style.blueTeam}
              />
            </div>
        }
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  const ready = InitStore.isReady(state);
  const activeRuns = ready ? ActiveRunStore.getActiveRunIds(state) : {};

  const redTeamId = 1;
  const blueTeamId = 5;

  return {
    eventId: EVENT_ID,
    redTeamId,
    blueTeamId,
    redActiveRunId: activeRuns[redTeamId],
    blueActiveRunId: activeRuns[blueTeamId],
    ready
  }
};

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
