import { h, render, Component, Fragment } from 'preact';
import { connect } from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';

import * as AuthStore from './selectors/auth';
import * as InitStore from '../selectors/init';
import * as InitActions from '../actions/init';
import * as StreamSyncActions from './actions/stream-sync';
import LoginForm from './components/login-form';
import CurrentRunsSection from './components/sections/current-runs';
import CurrentTimeSection from './components/sections/current-time';
import EventTimeSection from './components/sections/event-time';
import FeaturedRunSection from './components/sections/featured-run';
import PreshowSection from './components/sections/preshow';
import RawStateSection from './components/sections/raw-state';
import ResyncSection from './components/sections/resync';
import SocketStatusSection from './components/sections/socket-status';
import TeamSection from './components/sections/teams';
import LoadingSpinner from '../uikit/loading-spinner';

import { EVENT_ID } from '../constants';
import style from './admin.mod.css';


class App extends Component {
  componentDidMount() {
    const {eventId, dispatch} = this.props;
    StreamSyncActions.bindSocketToDispatch(dispatch);

    dispatch(InitActions.fetchAll(EVENT_ID));
  }

  componentWillUnmount() {
    TimerActions.stopTimers();
  }

  render() {
    const {
      isAuthenticated,
      ready,
      dispatch
    } = this.props;

    if(!ready) {
      return (
        <div class={style.container}>
          <LoadingSpinner />
        </div>
      );
    }

    return (
      <div class={classNames(style.body, "admin-dashboard")}>
        <div class={style.container}>
          { isAuthenticated
            ? <Fragment>
                <SocketStatusSection className={style.socketStatus} />
                <CurrentTimeSection className={style.currentTime} />
                <FeaturedRunSection className={style.featuredRun} />
                <CurrentRunsSection className={style.currentRuns} />
                <EventTimeSection className={style.eventTime} />
                <ResyncSection className={style.resync} />
                <PreshowSection className={style.preshow} />
                <RawStateSection className={style.rawState} />
                <TeamSection className={style.teams} />
              </Fragment>
            : <LoginForm dispatch={dispatch} />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const ready = InitStore.isReady(state);

  const isAuthenticated = AuthStore.isLoggedIn(state);

  return {
    eventId: EVENT_ID,
    isAuthenticated,
    ready,
  };
};

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
