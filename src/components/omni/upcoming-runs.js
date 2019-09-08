import {h, Component, createRef} from 'preact';
import {connect} from 'react-redux';
import {TimelineMax} from 'gsap/TimelineMax';
import _ from 'lodash';
import humanizeDuration from "humanize-duration";

import * as TimeStore from '../../selectors/time';
import * as UpcomingRunsStore from '../../selectors/upcoming-runs';
import Run from '../run';
import SlideCycle from '../../uikit/anim/slide-cycle';

import style from './team-runs.mod.css';


class TeamRuns extends Component {
  constructor(props) {
    super(props);

    this.container  = createRef();
    this.header     = createRef();
    this.banner     = createRef();
    this.timeline       = new TimelineMax({paused: true, autoRemoveChildren: true});
    this.childTimeline  = new TimelineMax({autoRemoveChildren: true});
  }

  componentDidMount() {
    const {play, onComplete} = this.props;
    this.timeline
        // In
        .set(this.header.current, {opacity: 0})
        .set(this.header.current, {x: -320})
        .to(this.header.current, 0.2, {opacity: 1})
        .to(this.header.current, 0.3, {x: 0, ease: "Power2.easeOut"})
        // Children
        .add(this.childTimeline, "-=0.1")
        // Out
        .to(this.header.current, 0.5, {x: -320, ease: "Power2.easeIn"})
        .eventCallback("onComplete", onComplete)
        .play(play);
  }

  renderRunStartTime(startTime) {
    const {currentTime} = this.props;
    const diffMinutes = startTime.diff(currentTime).as('minutes');
    const roundedTimeUntil = Math.round(diffMinutes) * 60 * 1000;
    const timeString = humanizeDuration(roundedTimeUntil, { largest: 2, units: ['h', 'm'] });
    return (
      <p>
        <span style={{opacity: 0.6}}>Starts in </span>
        {timeString}
      </p>
    );
  }

  render() {
    const {
      upcomingRuns,
    } = this.props;

    return (
      <div class={style.content} ref={this.container}>
        <div ref={this.header} class={style.teamHeader}>
          <p>Upcoming Runs</p>
        </div>
        <SlideCycle
            class={style.content}
            timeline={this.childTimeline}
          >
          { _.map(upcomingRuns, ({runId, estimatedStartTime}) => (
              <Run
                className={style.run}
                key={runId}
                runId={runId}
                midRow="game"
                timeRow={this.renderRunStartTime(estimatedStartTime)}
              />
            ))
          }
        </SlideCycle>
      </div>
    );
  }
};

const mapStateToProps = (state, props) => {
  const currentTime = TimeStore.getCurrentTime(state, props);
  const upcoming = UpcomingRunsStore.getUpcomingRuns(state, {count: 10});

  return {
    currentTime,
    upcomingRuns: UpcomingRunsStore.getUpcomingRuns(state, {count: 10}),
  };
}

export default connect(
  mapStateToProps
)(TeamRuns);
