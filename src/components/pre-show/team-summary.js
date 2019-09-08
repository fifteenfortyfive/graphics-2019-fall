import {h, Component, createRef} from 'preact';
import {connect} from 'react-redux';
import {TimelineMax} from 'gsap/TimelineMax';
import _ from 'lodash';
import style from './team-summary.mod.css';

import * as TeamStore from '../../selectors/teams';
import Run from '../run';
import StaggerIn from '../../uikit/anim/stagger-in';

class TeamRuns extends Component {
  constructor(props) {
    super(props);

    this.animateIn  = this._animateIn.bind(this);
    this.animateOut = this._animateOut.bind(this);
    this.handleAnimatedOut = this._handleAnimatedOut.bind(this);

    this.header     = createRef();
    this.container  = createRef();
    this.timeline       = new TimelineMax({paused: true, autoRemoveChildren: true});
    this.childTimeline  = new TimelineMax();

    this.state = {
      animatingOut: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {teamId} = this.props;
    const {animatingOut} = this.state;

    if(teamId != nextProps.teamId && !animatingOut) {
      this.animateOut();
      return false;
    }

    return !nextState.animatingOut;
  }

  componentDidUpdate(prevProps) {
    const {teamId} = this.props;

    if(teamId != prevProps.teamId) {
      this.animateIn();
    }
  }

  componentDidMount() {
    const {onComplete, team} = this.props;
    if(team != null) {
      this.animateIn();
    }
  }

  _handleAnimatedOut() {
    this.setState({animatingOut: false});
  }

  _animateIn() {
    this.timeline
        // In
        .set(this.container.current, {opacity: 1})
        .fromTo(this.header.current, 0.6, {opacity: 0, yPercent: -25}, {opacity: 1, yPercent: 0, ease: "Power4.easeOut"}, 1)
        // Children
        .add(this.childTimeline)
        .play();
  }

  _animateOut() {
    this.setState({ animatingOut: true });

    this.timeline
        .to(this.container.current, 1, {opacity: 1, ease: "Power4.easeIn"})
        .addCallback(this.handleAnimatedOut)
        .play();
  }

  render() {
    const {
      runIds,
      team,
    } = this.props;

    if(team == null) return null;

    return (
      <div class={style.content} ref={this.container} style={{'--color': `#${team.color}`}}>
        <div ref={this.header} class={style.teamHeader}>
          <p>{team.name}</p>
        </div>
        <div class={style.runs}>
          <StaggerIn
              childClassName={style.staggerElement}
              timeline={this.childTimeline}
            >
            { _.map(runIds, (runId) => (
                <Run
                  className={style.run}
                  key={runId}
                  runId={runId}
                  midRow="game"
                />
              ))
            }
          </StaggerIn>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state, props) => {
  const {teamId} = props;

  const team = TeamStore.getTeam(state, props);
  const runIds = TeamStore.getTeamRunIdsGameOrdered(state, props);

  return {
    runIds,
    team,
  };
}

export default connect(
  mapStateToProps
)(TeamRuns);
