import {h, Component} from 'preact';
import classNames from 'classnames';
import {connect} from 'react-redux';
import _ from 'lodash';

import * as TeamStore from '../../../selectors/teams';
import * as PreshowActions from '../../../actions/preshow';
import * as RemoteControlActions from '../../actions/remote-control';
import Section from '../section';
import Button from '../button';

import {simpleDateTimeUTC} from '../../../util';
import style from './preshow.mod.css';

class PreshowSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTeamId: null,
    };
  }

  setActiveOverlay() {
    const {dispatch} = this.props;
    const {selectedTeamId} = this.state;

    const action = PreshowActions.setTeam(selectedTeamId);
    dispatch(RemoteControlActions.pushAction(action));
  }

  setSelectedTeam(ev) {
    const newTeamId = ev.target.value;

    this.setState({selectedTeamId: newTeamId});
  }

  clearSelectedTeam() {
    const {dispatch} = this.props;
    this.setState({selectedTeamId: null});
    const action = PreshowActions.clearActiveOverlay();
    dispatch(RemoteControlActions.pushAction(action));
  }

  render() {
    const {
      teams,
      className
    } = this.props;
    const {
      selectedTeamId
    } = this.state;

    return (
      <Section
          className={className}
          title="Preshow"
        >
        <h1 class={style.subHeader}>Set Active Team</h1>

        <select
            value={selectedTeamId || ''}
            onChange={(ev) => this.setSelectedTeam(ev)}
          >
            <option value="" disabled>Select a Team</option>
          { _.map(teams, (team) => (
              <option
                  value={team.id}
                >
                {team.name}
              </option>
            ))
          }
        </select>

        <Button
            onClick={() => this.setActiveOverlay()}
          >
          Set Active Overlay
        </Button>

        <Button
            onClick={() => this.clearSelectedTeam()}
          >
          Clear Active Overlay
        </Button>
      </Section>
    );
  }
};

export default connect((state) => ({
  teams: TeamStore.getSortedTeams(state),
}))(PreshowSection);
