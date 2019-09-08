import {h, Component, createRef} from 'preact';
import TimelineMax from 'gsap/TimelineMax';
import TweenMax from 'gsap/TweenMax';
import classNames from 'classnames';
import _ from 'lodash';

import { FadeShrink } from './timelines';

import style from './slide-cycle.mod.css';

class SlideCycle extends Component {
  constructor(props) {
    super(props);

    this.refs = [];
  }

  setRef(ref, index) {
    this.refs[index] = ref;
  }

  componentDidMount() {
    const {timeline} = this.props;
    const fadeTLs = _.map(this.refs, FadeShrink);

    timeline
        .staggerFromTo(this.refs, 0.4, {y: 80}, {y: 0, ease: "Power4.easeOut"}, 0.08)
        .add(fadeTLs, "+=3", "normal", 5);
  }

  render() {
    const {
      className,
      children,
      childClassName,
    } = this.props;

    return (
      <div class={classNames(style.content, className)}>
        { _.map(children, (child, i) => (
            <div
                key={i}
                ref={(r) => this.setRef(r, i)}
                class={classNames(style.item, childClassName)}
              >
              {child}
            </div>
          ))
        }
      </div>
    );
  }
};

export default SlideCycle;
