import { h, render, Component } from 'preact';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as FeaturedRunStore from '../selectors/featured-run';
import * as InitStore from '../selectors/init';
import * as InitActions from '../actions/init';
import * as TimerActions from '../actions/timers';
import * as WebSocketActions from '../actions/websocket';
import Layout from '../components/layout';
import RunnerStream from '../components/runner-stream';
import Stream from '../components/stream';
import Run from '../components/run';
import Omnibar from '../components/omnibar';
import Sidebar from '../components/sidebar';
import SubVideos from '../components/sub-videos';
import LoadingSpinner from '../uikit/loading-spinner';

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
      featuredRunId,
      ready
    } = this.props;

    return (
      <Layout>
        { !ready
          ? <LoadingSpinner />
          : <div class={style.layoutContainer}>
              <div class={style.mainVideo}>
                <RunnerStream
                  runId={featuredRunId}
                  isFeatured={false}
                  includeFeaturedIndicator={false}
                  quality={Stream.Qualities.SOURCE}
                  volume={0.9}
                />
              </div>

              <Sidebar className={style.sidebar} />
              <SubVideos class={style.subVideos} />
              <Omnibar className={style.omnibar} eventId={EVENT_ID} />
            </div>
        }
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  const ready = InitStore.isReady(state);

  return {
    eventId: EVENT_ID,
    featuredRunId: FeaturedRunStore.getFeaturedRunId(state),
    ready
  }
};

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
