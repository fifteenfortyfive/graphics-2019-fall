import {h, Component, Fragment} from 'preact';
import classNames from 'classnames';
import {connect} from 'react-redux';

import * as EventStore from '../../../selectors/events';
import * as AdminEventActions from '../../actions/event';
import Section from '../section';
import Button from '../button';
import LoadingSpinner from '../../../uikit/loading-spinner';

import {EVENT_ID, EventStates} from '../../../constants';
import {runTime} from '../../../util';
import style from './event-time.mod.css';

class EventTimeSection extends Component {
  constructor(props) {
    super(props);
    this.handleFinishClick = this._handleFinishClick.bind(this);
    this.handleResetClick  = this._handleResetClick.bind(this);
  }

  _handleFinishClick() {
    const { dispatch } = this.props;
    const confirm = window.confirm("Are you sure you want to end the event timer?");

    if(confirm) {
      dispatch(AdminEventActions.finishEvent(EVENT_ID));
    }
  }

  _handleResetClick() {
    const { dispatch } = this.props;
    const confirm = window.confirm("Are you sure you want to end the event timer? The timer will not be recoverable from the dashboard.");

    if(confirm) {
      dispatch(AdminEventActions.resetEvent(EVENT_ID));
    }
  }

  renderReady() {
    const {
      event,
      eventState,
      eventTimeSeconds,
      tick,
      ready,
      className,
      dispatch
    } = this.props;

    return (
      <Fragment>
        <h1>{eventState.toUpperCase()}</h1>
        <p class={style.time}>{runTime(eventTimeSeconds || 0)}</p>

        <Button
            onClick={() => dispatch(AdminEventActions.startEvent(EVENT_ID))}
            disabled={eventState !== EventStates.READY}
          >
          Start Event
        </Button>

        <Button
            onClick={this.handleFinishClick}
            disabled={eventState !== EventStates.STARTED}
          >
          Finish Event
        </Button>

        <Button
            onClick={() => dispatch(AdminEventActions.resumeEvent(EVENT_ID))}
            disabled={eventState !== EventStates.FINISHED}
          >
          Resume Event
        </Button>

        <Button
            onClick={this.handleResetClick}
            disabled={eventState !== EventStates.FINISHED}
          >
          Reset Event
        </Button>
      </Fragment>
    );
  }

  render() {
    const {
      ready,
      className,
    } = this.props;

    return (
      <Section
          className={className}
          title="Event Time"
        >
        { ready
          ? this.renderReady()
          : <LoadingSpinner color="black" />
        }
      </Section>
    );
  }
};

const mapStateToProps = (state) => {
  const props = {eventId: EVENT_ID};
  const event = EventStore.getEvent(state, props);

  return {
    event,
    eventTimeSeconds: EventStore.getEventTimeSeconds(state, props),
    eventState: EventStore.getEventState(state, props),
    tick: state.tick,
    ready: event
  };
};

export default connect(
  mapStateToProps
)(EventTimeSection);
