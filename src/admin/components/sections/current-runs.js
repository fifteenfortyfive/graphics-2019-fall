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
import {runTime} from '../../../util';
import style from './current-runs.mod.css';

class CurrentRunsSection extends Component {
  constructor(props) {
    super(props);
    this.handleMakeFeatured = this._handleMakeFeatured.bind(this);
  }

  _handleMakeFeatured(runId) {
    const { nextRotatesAt, dispatch } = this.props;
    const action = FeaturedRunActions.setFeaturedRun(runId, nextRotatesAt);
    dispatch(RemoteControlActions.pushAction(action));
  }

  render() {
    const {
      featuredRunId,
      activeRunIds,
      className,
      dispatch
    } = this.props;

    return (
      <Section
          className={className}
          title="Current Runs"
        >
        <ul class={style.availableRuns}>
          { _.map(activeRunIds, (runId) => (
              <li
                  class={classNames(style.availableRunContainer, {
                    [style.isActive]: runId === featuredRunId
                  })}
                >
                <Run
                  className={style.availableRun}
                  runId={runId}
                  midRow="team"
                  showProgressBar
                />
                <Button
                    className={style.featureButton}
                    onClick={() => this.handleMakeFeatured(runId)}
                    disabled={runId === featuredRunId}
                  >
                  Make Featured
                </Button>
              </li>
            ))
          }
        </ul>
      </Section>
    );
  }
};


const mapStateToProps = (state, props) => {
  return {
    featuredRunId: FeaturedRunStore.getFeaturedRunId(state),
    nextRotatesAt: FeaturedRunStore.getNextRotatesAt(state),
    activeRunIds: ActiveRunStore.getActiveRunIds(state),
  };
};

export default connect(
  mapStateToProps
)(CurrentRunsSection)
