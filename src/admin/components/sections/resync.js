import {h, Component} from 'preact';
import {connect} from 'react-redux';

import * as RemoteControlActions from '../../actions/remote-control';
import Section from '../section';
import Button from '../button';

import {CollectionTypes} from '../../../constants';

class ResyncSection extends Component {
  render() {
    const {
      className,
      dispatch
    } = this.props;

    return (
      <Section
          className={className}
          title="Force Data Resync"
        >
        <p style={{marginBottom: 24}}>Use these buttons to force the layout to reload all of that kind of data without having to refresh the whole page.</p>

        <Button
            onClick={() => dispatch(RemoteControlActions.forceResyncAccounts())}
          >
          Refresh Accounts
        </Button>
        <Button
            onClick={() => dispatch(RemoteControlActions.forceResyncEvent())}
          >
          Refresh Event
        </Button>
        <Button
            onClick={() => dispatch(RemoteControlActions.forceResyncGames())}
          >
          Refresh Games
        </Button>
        <Button
            onClick={() => dispatch(RemoteControlActions.forceResyncRuns())}
          >
          Refresh Runs
        </Button>
        <Button
            onClick={() => dispatch(RemoteControlActions.forceResyncTeams())}
          >
          Refresh Teams
        </Button>
      </Section>
    );
  }
};

export default connect()(ResyncSection);
