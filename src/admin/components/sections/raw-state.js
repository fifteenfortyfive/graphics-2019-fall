import {h} from 'preact';
import classNames from 'classnames';
import {connect} from 'react-redux';
import ReactJson from 'react-json-view';

import Section from '../section';

import style from './socket-status.mod.css';

const RawStateSection = (props) => {
  const {
    streamState,
    className
  } = props;

  return (
    <Section
        className={className}
        title="Raw State"
      >
      <ReactJson
        src={streamState}
        name={null}
        collapsed
      />
    </Section>
  );
};

const mapStateToProps = (state) => {
  return {
    streamState: state
  };
};

export default connect(
  mapStateToProps
)(RawStateSection);
