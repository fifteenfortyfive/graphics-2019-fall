import {h, Component} from 'preact';
import {connect} from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';

import * as ActiveRunStore from '../../../selectors/active-runs';
import * as FeaturedRunStore from '../../../selectors/featured-run';
import * as FeaturedRunActions from '../../../actions/featured-runs';
import * as RemoteControlActions from '../../actions/remote-control';
import Section from '../section';
import Run from '../../../components/run';
import Button from '../button';

import {CollectionTypes} from '../../../constants';
import {runTime, simpleDateTimeUTC} from '../../../util';
import style from './featured-run.mod.css';

class FeaturedRunSection extends Component {
  constructor(props) {
    super(props);
    this.handleDisableRotation = this._handleDisableRotation.bind(this);
    this.handleEnableRotation  = this._handleEnableRotation.bind(this);
    this.handleSetRotationInterval = this._handleSetRotationInterval.bind(this);
    this.handleRotationIntervalInput = this._handleRotationIntervalInput.bind(this);
    this.handleRotateNow = this._handleRotateNow.bind(this);

    this.setState({
      newRotationInterval: null
    });
  }

  _handleDisableRotation() {
    const { dispatch } = this.props;

    const action = FeaturedRunActions.setRotationEnabled(false);
    dispatch(RemoteControlActions.pushAction(action));
  }

  _handleEnableRotation() {
    const { dispatch } = this.props;
    const action = FeaturedRunActions.setRotationEnabled(true);
    dispatch(RemoteControlActions.pushAction(action));
  }

  _handleRotationIntervalInput(ev) {
    const newValue = ev.target.value;
    const newSeconds = parseInt(newValue);

    if(newSeconds) {
      this.setState({
        newRotationInterval: Math.floor(newSeconds)
      });
    }
  }

  _handleSetRotationInterval() {
    const { dispatch } = this.props;
    const { newRotationInterval } = this.state;
    if(newRotationInterval) {
      const action = FeaturedRunActions.setRotationInterval(newRotationInterval);
      dispatch(RemoteControlActions.pushAction(action));

      this.setState({
        newRotationInterval: null,
      });
    }
  }

  _handleRotateNow() {
    const {
      nextFeaturedRunId,
      nextRotatesAt,
      dispatch
    } = this.props;

    const action = FeaturedRunActions.setFeaturedRun(nextFeaturedRunId, nextRotatesAt);
    dispatch(RemoteControlActions.pushAction(action));
  }


  render() {
    const {
      featuredRunId,
      activeRunIds,
      rotationInterval,
      rotateAt,
      rotationEnabled,
      className,
      dispatch
    } = this.props;

    const {
      newRotationInterval
    } = this.state;

    return (
      <Section
          className={className}
          title="Featured Run"
        >
        <Run
          runId={featuredRunId}
          showProgressBar
        />

        <div class={style.actions}>
          <p>
            Rotates At: { rotateAt
              ? <strong>{simpleDateTimeUTC(rotateAt)}</strong>
              : "not set"
            }
          </p>
          { rotationEnabled
            ? <p class={style.success}>Will rotate when scheduled</p>
            : <p class={style.failure}>Will not rotate</p>
          }

          <Button
              onClick={this.handleRotateNow}
            >
            Rotate Now
          </Button>
        </div>

        <h1 class={style.subHeader}>Auto Rotation</h1>

        <div class={style.actions}>
          { rotationEnabled
            ? <p class={style.success}>The stream is set to auto rotate</p>
            : <p class={style.failure}>The stream will not auto rotate</p>
          }

          { rotationEnabled
            ? <Button
                  onClick={this.handleDisableRotation}
                >
                Disable Auto Rotation
              </Button>
            : <Button
                  onClick={this.handleEnableRotation}
                >
                Resume Auto Rotation
              </Button>
          }
        </div>

        <h1 class={style.subHeader}>Rotation Interval</h1>

        { rotationInterval
          ? <p>The rotation interval is set to <strong>{rotationInterval ? runTime(rotationInterval) : "unset"}</strong></p>
          : <p class={style.failure}>The rotation interval is not set</p>
        }

        <input
          class={style.intervalInput}
          type="number"
          min="0"
          step="1"
          placeholder="New Rotation Interval (seconds)"
          onInput={this.handleRotationIntervalInput}
          value={newRotationInterval}
        />

        <Button
            onClick={this.handleSetRotationInterval}
            disabled={!parseInt(newRotationInterval)}
          >
          Update Rotation Interval
        </Button>
      </Section>
    );
  }
};


const mapStateToProps = (state, props) => {
  return {
    featuredRunId: FeaturedRunStore.getFeaturedRunId(state),
    rotationInterval: FeaturedRunStore.getRotationInterval(state),
    rotationEnabled: FeaturedRunStore.getRotationEnabled(state),
    rotateAt: FeaturedRunStore.getRotateAtRaw(state),
    nextRotatesAt: FeaturedRunStore.getNextRotatesAt(state),
    nextFeaturedRunId: FeaturedRunStore.getNextFeaturedRunId(state),
  };
};

export default connect(
  mapStateToProps
)(FeaturedRunSection)
