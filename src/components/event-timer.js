import {h} from 'preact';
import {connect} from 'react-redux';
import classNames from 'classnames';

import * as TimeStore from '../selectors/time';
import * as EventStore from '../selectors/events';

import {runTime} from '../util';
import style from './event-timer.mod.css';

const EventTimer = (props) => {
  const {
    currentTime,
    eventTimeSeconds,
    eventState,
    className
  } = props;

  const currentTimeString = currentTime.toLocaleString({
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div class={classNames(className)}>
      <p class={style.eventTimer}>{runTime(eventTimeSeconds)}</p>
    </div>
  );
}

const mapStateToProps = (state, props) => {
  const {startedAt} = props;

  return {
    currentTime: TimeStore.getCurrentTime(state, props),
    eventTimeSeconds: EventStore.getEventTimeSeconds(state, props),
    eventState: EventStore.getEventState(state, props)
  };
};

export default connect(
  mapStateToProps,
)(EventTimer);
