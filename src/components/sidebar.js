import {h, Component} from 'preact';
import {connect} from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';

import TeamCard from './sidebar/team-card';

import style from './sidebar.mod.css';

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      teamIds,
      className
    } = this.props;

    return (
      <div class={classNames(style.container, className)}>
        <div class={style.teamCards}>
          { _.map(teamIds, (teamId) => {
              return <TeamCard className={style.teamCard} teamId={teamId} />
            })
          }
        </div>
      </div>
    );
  }
};


const mapStateToProps = (state, props) => {
  return {
    teamIds: Object.keys(state.teams)
  };
};

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
