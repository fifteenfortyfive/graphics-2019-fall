import {h, Component, createRef} from 'preact';
import TimelineMax from 'gsap/TimelineMax';
import TweenMax from 'gsap/TweenMax';
import classNames from 'classnames';
import _ from 'lodash';


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

    timeline
        .staggerFromTo(this.refs, 0.4, {opacity: 0, y: 80}, {opacity: 1, y: 0, ease: "Power3.easeInOut"}, 0.05);
  }

  render() {
    const {
      children,
      childClassName,
    } = this.props;

    return _.map(_.flatten(children), (child, i) => (
      <div
          key={i}
          ref={(r) => this.setRef(r, i)}
          class={childClassName}
        >
        {child}
      </div>
    ));
  }
};

export default SlideCycle;
