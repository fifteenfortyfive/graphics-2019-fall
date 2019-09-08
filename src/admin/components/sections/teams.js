import {h, Component} from 'preact';
import classNames from 'classnames';
import {connect} from 'react-redux';
import _ from 'lodash';

import * as EventStore from '../../../selectors/events';
import * as TeamStore from '../../../selectors/teams';
import * as AdminTeamActions from '../../actions/team';
import Section from '../section';
import Button from '../button';

import {EventStates, EVENT_ID} from '../../../constants';
import {runTime} from '../../../util';
import style from './teams.mod.css';

class TeamsSection extends Component {
  getTeamState({actual_start_time, actual_time_seconds}) {
    if(actual_time_seconds) {
      return EventStates.FINISHED;
    } else if(actual_start_time) {
      return EventStates.STARTED;
    } else {
      return EventStates.READY;
    }
  }

  getTeamTime({actual_time_seconds, actual_start_time}) {
    const {eventTimeSeconds} = this.props;

    if(actual_time_seconds) {
      return runTime(actual_time_seconds);
    } else if(actual_start_time) {
      return runTime(eventTimeSeconds || 0);
    } else {
      return runTime(0);
    }
  }

  render() {
    const {
      teams,
      eventTimeSeconds,
      className,
      dispatch
    } = this.props;


    return (
      <Section
          className={className}
          title="Team Times"
        >

        <div class={style.teams}>
          { _.map(teams, (team) => {
              const teamState = this.getTeamState(team);

              return (
                <div class={style.team} style={{'--color': `#${team.color}`}}>
                  <h2 class={style.subHeader}>{team.name}</h2>
                  <p class={style.time}>{this.getTeamTime(team)}</p>
                  <p class={style.state}>{teamState.toUpperCase(0)}</p>

                  <div class={style.teamActions}>
                    <Button
                        onClick={() => dispatch(AdminTeamActions.finishTeam(EVENT_ID, team.id))}
                        disabled={teamState !== EventStates.STARTED}
                      >
                      Finish Team
                    </Button>

                    <Button
                        onClick={() => dispatch(AdminTeamActions.resumeTeam(EVENT_ID, team.id))}
                        disabled={teamState !== EventStates.FINISHED}
                      >
                      Resume Team
                    </Button>
                  </div>
                </div>
              );
            })
          }
        </div>
      </Section>
    );
  }
};

export default connect((state) => ({
  teams: TeamStore.getSortedTeams(state),
  eventTimeSeconds: EventStore.getEventTimeSeconds(state, {eventId: EVENT_ID})
}))(TeamsSection);
