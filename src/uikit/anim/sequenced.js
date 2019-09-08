import {h, Component, cloneElement} from 'preact';
import _ from 'lodash';

// Component for sequencing Timelined components one after another. By default
// only supports a static list of components, but the sequence can be
// interrupted with by setting the `override` prop with a component to render.
class Sequenced extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentChild: 0
    };
  }

  componentDidUpdate(prevProps) {
    // TODO: Check for override prop
  }

  handleComplete() {
    const { children, onLoop } = this.props;
    const { currentChild } = this.state;

    const nextChild = currentChild + 1;

    if(nextChild >= children.length) {
      onLoop && onLoop();
    }

    this.setState({ currentChild: nextChild % children.length });
  }

  render() {
    const { children } = this.props;
    const { currentChild } = this.state;

    const childrenArray = Array.from(children);

    // Safety modulo in case an update removed children somehow
    const child = childrenArray[currentChild % children.length];

    if(!child) return null;

    const controlledChild = cloneElement(child, {
      onComplete: this.handleComplete.bind(this)
    });

    return controlledChild;
  }
};

export default Sequenced;
