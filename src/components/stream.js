import {h, Component, Fragment, createRef} from 'preact';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as AccountActions from '../actions/accounts';
import Avatar from './accounts/avatar';
import LoadingSpinner from '../uikit/loading-spinner';

import { ASSETS_URL } from '../constants';
import style from './stream.mod.css';

// Set this to use thumbnails instead of interactive twitch players.
// Reduces load times and helps React Dev Tools not break.
const USE_STREAM_PLACEHOLDERS = true;

const GLOBAL_PLAYER_OPTIONS = {
  width: "100%",
  height: "100%",
  controls: false
};

class Stream extends Component {
  constructor(props) {
    super(props);

    this.playerContainer = createRef();
    this.playerContainerID = _.uniqueId('stream_player_');
    this.player = null;
  }

  shouldComponentUpdate(nextProps) {
    const {twitchName, show} = this.props;

    return twitchName !== nextProps.twitchName
        || show !== nextProps.show;
  }

  componentDidMount() {
    const { accountId, account, dispatch } = this.props;

    this.updateTwitchPlayer();
  }

  componentDidUpdate() {
    this.updateTwitchPlayer();
  }

  updateTwitchPlayer() {
    if(USE_STREAM_PLACEHOLDERS) return null;


    const {
      twitchName,
      quality,
      volume,
      onStreamReady,
      onStreamUnready
    } = this.props;

    if(twitchName == null) return null;

    if(!this.player && !this.playerContainer.current) {
      return null;
    } else if(!this.player) {
      this.player = new Twitch.Player(this.playerContainerID, {...GLOBAL_PLAYER_OPTIONS});
      this.player.setVolume(0);
      this.player.addEventListener(Twitch.Player.PLAYING, onStreamReady);
      this.player.addEventListener(Twitch.Player.OFFLINE, onStreamUnready);
    }


    this.player.setChannel(twitchName);
    this.player.setQuality(quality);
    this.player.setVolume(volume);
  }

  renderStream() {
    return (
      <div
        class={style.playerContainer}
        id={this.playerContainerID}
        ref={this.playerContainer}
      >
      </div>
    );
  }

  renderPlaceholder() {
    const { twitchName } = this.props;

    const thumbSrc = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${twitchName}-320x180.jpg`;

    return (
      <div class={style.playerContainer}>
        <img class={style.thumbnail} src={thumbSrc} />
      </div>
    );
  }

  render() {
    const {twitchName} = this.props;
    return (
      <div class={style.stream}>
        { USE_STREAM_PLACEHOLDERS
          ? this.renderPlaceholder()
          : this.renderStream()
        }
      </div>
    );
  }
}


Stream.Qualities = {
  VERY_LOW: '160p30',
  LOW: '360p30',
  NORMAL: '480p30',
  HIGH: '720p30',
  SOURCE: 'chunked'
};


const mapStateToProps = (state, props) => {
  const {runId} = props;

  const run = state.runs[runId];
  const account = run && state.accounts[run.account_id];

  const twitchName = account && account.twitch && account.twitch.toLowerCase();

  return {
    twitchName
  };
};

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stream);
