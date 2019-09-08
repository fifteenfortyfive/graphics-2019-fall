import {h, Component, createRef} from 'preact';
import {connect} from 'react-redux';
import TimelineMax from 'gsap/TimelineMax';

import Stream from './stream';
import FeaturedIndicator from '../uikit/featured-indicator';

import style from './runner-stream.mod.css';

class RunnerStream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatingOut: false,
    }

    this.container = createRef();
    this.timeline = new TimelineMax({paused: true, autoRemoveChildren: true});

    this.animateIn  = this._animateIn.bind(this);
    this.animateOut = this._animateOut.bind(this);
    this.handleAnimatedOut = this._handleAnimatedOut.bind(this);
    this.handleStreamReady = this._handleStreamReady.bind(this);
    this.handleStreamLost  = this._handleStreamLost.bind(this);
  }

  componentDidMount() {
    const {isFeatured} = this.props;

    if(!isFeatured) {
      this.timeline
          .set(this.container.current, {yPercent: 80, opacity: 0})
          .play();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {runId, isFeatured} = this.props;
    const {animatingOut} = this.state;
    const becameFeatured = (!isFeatured && nextProps.isFeatured);

    if(runId != nextProps.runId) {
      this.animateOut();
      return false;
    } else if(becameFeatured) {
      this.animateOut();
      return false;
    }

    return !nextState.animatingOut;
  }

  componentDidUpdate(prevProps) {
    const {isFeatured} = this.props;
    const lostFeatured = !isFeatured && prevProps.isFeatured;

    if(lostFeatured) {
      this.prepareAnimateIn();
    }
  }

  prepareAnimateIn() {
    this.timeline
        .set(this.container.current, {yPercent: 105, opacity: 0})
        .play();
  }

  _handleAnimatedOut() {
    this.setState({animatingOut: false});
  }

  _animateIn() {
    this.timeline
        .fromTo(this.container.current, 1.2, {yPercent: 105, opacity: 0}, {yPercent: 0, opacity: 1, ease: "Power3.easeOut"})
        .play();
  }

  _animateOut() {
    this.setState({ animatingOut: true });

    this.timeline
        .to(this.container.current, 2, {yPercent: 105, opacity: 0, ease: "Power4.easeIn"})
        .addCallback(this.handleAnimatedOut)
        .play();
  }

  _handleStreamReady() {
    const {onStreamReady} = this.props;
    this.animateIn();
    if(onStreamReady) {
      onStreamReady();
    }
  }

  _handleStreamLost() {
    const {onStreamLost} = this.props;
    this.animateOut();
    if(onStreamLost) {
      onStreamLost();
    }
  }

  render() {
    const {runId, isFeatured, includeFeaturedIndicator} = this.props;
    return (
      <div class={style.container}>
        { includeFeaturedIndicator &&
          <FeaturedIndicator
            className={style.featuredIndicator}
            runId={runId}
          />
        }
        { !isFeatured &&
          <div ref={this.container} class={style.streamHolder}>
            <Stream
              {...this.props}
              onStreamReady={this.handleStreamReady}
              onStreamUnready={this.handleStreamLost}
            />
          </div>
        }
      </div>
    );
  }
};

export default RunnerStream;
