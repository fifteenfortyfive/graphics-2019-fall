import {h} from 'preact';
import classNames from 'classnames';
import {connect} from 'react-redux';

import * as TimeStore from '../../../selectors/time';
import * as SocketStatusStore from '../../selectors/socket';
import Section from '../section';

import {simpleDateTimeUTC} from '../../../util';
import style from './current-time.mod.css';

const CurrentTimeSection = (props) => {
  const {
    currentTime,
    className
  } = props;

  return (
    <Section
        className={className}
        title="Current Time (UTC)"
      >

      <p class={style.time}>{simpleDateTimeUTC(currentTime)}</p>
    </Section>
  );
};

export default connect((state) => ({
  currentTime: TimeStore.getCurrentTime(state)
}))(CurrentTimeSection);
