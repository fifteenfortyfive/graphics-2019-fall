import {h, Component} from 'preact';
import classNames from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as TeamsStore from '../selectors/teams';
import * as FeaturedRunActions from '../actions/featured-runs';
import * as FeaturedRunStore from '../selectors/featured-run';
import * as ActiveRunsStore from '../selectors/active-runs';
import RunnerStream from './runner-stream';
import Stream from './stream';
import LoadingSpinner from '../uikit/loading-spinner';

import style from './sub-videos.mod.css';

class SubVideos extends Component {
  constructor(props) {
    super(props);

    this.rotateFeatured = this._rotateFeatured.bind(this);
  }

  componentDidMount() {
    this.rotateFeatured();
  }

  componentDidUpdate(prevProps) {
    const {
      shouldRotate
    } = this.props;

    if(shouldRotate) {
      this.rotateFeatured();
    }
  }

  _rotateFeatured() {
    const {
      nextFeaturedRunId,
      nextRotatesAt,
      dispatch
    } = this.props;

    dispatch(FeaturedRunActions.setFeaturedRun(
      nextFeaturedRunId,
      nextRotatesAt
    ));
  }

  renderElement(runId) {
    const {featuredRunId} = this.props;

    return (
      <RunnerStream
        runId={runId}
        isFeatured={runId == featuredRunId}
        includeFeaturedIndicator={true}
        quality={Stream.Qualities.LOW}
        volume={0}
      />
    );
  }

  render() {
    const {
      activeRunIds,
      className
    } = this.props;

    return (
      <div class={classNames(style.container, className)}>
        { _.map(activeRunIds, (runId) => {
            return (
              <div key={runId} class={style.element}>
                {this.renderElement(runId)}
              </div>
            );
          })
        }
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    featuredRunId: FeaturedRunStore.getFeaturedRunId(state),
    rotationEnabled: FeaturedRunStore.getRotationEnabled(state),
    nextRotatesAt: FeaturedRunStore.getNextRotatesAt(state),
    nextFeaturedRunId: FeaturedRunStore.getNextFeaturedRunId(state),
    shouldRotate: FeaturedRunStore.shouldRotate(state),
    activeRunIds: ActiveRunsStore.getActiveRunIds(state),
    sortedTeams: TeamsStore.getSortedTeams(state),
  };
};

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubVideos);
