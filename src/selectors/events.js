import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import _ from 'lodash';

import {getCurrentTime} from './time';

import {EventStates} from '../constants';
import {timeFromISO} from '../util';


const getEvents = (state) => Object.values(state.events);
const getEventId = (_, props) => props.eventId;
export const getEvent = (state, props) => state.events && state.events[props.eventId];

export const getEventStartTime = createCachedSelector(
  [getEvent],
  (event) => event.actual_start_time
)(getEventId);

export const getEventTimeSeconds = createCachedSelector(
  [getEvent, getCurrentTime],
  (event, currentTime) => {
    const {
      actual_start_time,
      actual_time_seconds
    } = event;

    if(actual_time_seconds) {
      return actual_time_seconds;
    } else if(actual_start_time == null) {
      return 0;
    } else if(currentTime != null) {
      const elapsed = currentTime.diff(timeFromISO(actual_start_time)).as('seconds');
      return elapsed;
    } else {
      // If currentTime doesn't exist, we can't state elapsed time.
      return 0;
    }
  }
)(getEventId);


export const getEventState = createCachedSelector(
  [getEvent],
  (event) => {
    const {
      actual_start_time,
      actual_time_seconds
    } = event;

    if(actual_time_seconds) {
      return EventStates.FINISHED;
    } else if(actual_start_time) {
      return EventStates.STARTED;
    } else {
      return EventStates.READY;
    }
  }
)(getEventId);
