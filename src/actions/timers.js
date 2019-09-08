import {DateTime} from 'luxon';

let intervalID = null;

export function startTimers(dispatch, interval = 1000) {
  intervalID = setInterval(() => {
    dispatch(tick(DateTime.utc().toISO()));
  }, interval);
}

export function stopTimers(interval) {
  clearInterval(intervalID);
  intervalID = null;
}


export function tick(currentTime) {
  return {
    type: "TIMER_TICK",
    data: {
      currentTime
    }
  }
}
