import {h, Component, createRef} from 'preact';
import {connect} from 'react-redux';
import {TimelineMax} from 'gsap/TimelineMax';
import _ from 'lodash';
import style from './team-runs.mod.css';

import Run from '../run';
import SlideCycle from '../../uikit/anim/slide-cycle';


class GameResults extends Component {
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

  render() {
    const {
      runIds,
      game,
    } = this.props;

    return (
      <div class={style.content} ref={this.container} style={{'--color': `#${game.color}`}}>
        <div ref={this.header} class={style.teamHeader}>
          <p>{game.name}</p>
        </div>
        <SlideCycle
            class={style.content}
            timeline={this.childTimeline}
          >
          { _.map(runIds, (runId) => (
              <Run
                className={style.run}
                key={runId}
                runId={runId}
                midRow="team"
              />
            ))
          }
        </SlideCycle>
      </div>
    );
  }
};

const mapStateToProps = (state, props) => {
  const {gameId} = props;

  const game = state.games[gameId];
  const runIds = _.reduce(state.runs, (acc, run, runId) => {
    if(run.game_id == gameId) acc.push(runId);
    return acc;
  }, []);

  return {
    runIds,
    game,
  };
}

export default connect(
  mapStateToProps
)(GameResults);
