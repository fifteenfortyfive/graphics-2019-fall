import { h, render, Component } from 'preact';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as InitStore from '../selectors/init';
import * as PreshowStore from '../selectors/preshow';
import * as InitActions from '../actions/init';
import * as TimerActions from '../actions/timers';
import * as WebSocketActions from '../actions/websocket';
import Layout from '../components/layout';
import Omnibar from '../components/omnibar';
import TeamSummary from '../components/pre-show/team-summary';
import LoadingSpinner from '../uikit/loading-spinner';

import { EVENT_ID } from '../constants';
import style from './pre-show.mod.css';


class Preshow extends Component {
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
      activeOverlay,
      ready
    } = this.props;

    return (
      <Layout>
        { !ready
          ? <LoadingSpinner />
          : <div class={style.layoutContainer}>
              <div class={style.overlay}>
                { activeOverlay.teamId &&
                  <TeamSummary key={activeOverlay.teamId} teamId={activeOverlay.teamId} />
                }
              </div>

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
    activeOverlay: PreshowStore.getActiveOverlay(state),
    ready
  }
};

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Preshow);
