import {h, Component, Fragment} from 'preact';
import {TimelineMax} from 'gsap/TimelineMax';
import { connect } from 'react-redux';
import _ from 'lodash';

import GameResults from './game-results';
import Sequenced from '../../uikit/anim/sequenced';

class GamesList extends Component {
  render() {
    const {
      gameIds,
      onComplete
    } = this.props;

    return (
      <Sequenced
          onLoop={onComplete}
        >
        { _.map(gameIds, (gameId) => (
            <GameResults key={gameId} gameId={gameId} />
          ))
        }
      </Sequenced>
    );
  }
};

const mapStateToProps = (state) => ({
  gameIds: Object.keys(state.games),
});

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GamesList);
