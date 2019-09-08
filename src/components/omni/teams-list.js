import {h, Component, Fragment} from 'preact';
import {TimelineMax} from 'gsap/TimelineMax';
import { connect } from 'react-redux';
import _ from 'lodash';

import TeamRuns from './team-runs';
import Sequenced from '../../uikit/anim/sequenced';

class TeamsList extends Component {
  render() {
    const {
      teamIds,
      onComplete
    } = this.props;

    return (
      <Sequenced
          onLoop={onComplete}
        >
        { _.map(teamIds, (teamId) => (
            <TeamRuns key={teamId} teamId={teamId} />
          ))
        }
      </Sequenced>
    );
  }
};

const mapStateToProps = (state) => ({
  teamIds: Object.keys(state.teams),
});

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamsList);
