import {h, Component} from 'preact';
import {connect} from 'react-redux';

import * as WebSocketActions from '../actions/websocket';
import {getCurrentTimeWithAccuracy} from '../selectors/time';

// 2 seconds is essentially real-time. This might be too chatty.
const SYNC_INTERVAL = 2 * 1000;

class StateSync extends Component {
  constructor(props) {
    super(props);
    this.intervalID = null;
  };

  componentShouldUpdate() {
    return true;
  }

  componentDidMount() {
    this.intervalID = setInterval(() => {
      WebSocketActions.syncStateToServer(this.props.state);
    }, SYNC_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
    this.intervalID = null;
  }

  render() {
    return null;
  }
};

const mapStateToProps = (state, props) => {
  return {
    state
  };
};

export default connect(
  mapStateToProps
)(StateSync);
