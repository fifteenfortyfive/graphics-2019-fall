import {h} from 'preact';
import {useSelector} from 'react-redux';
import classNames from 'classnames';

import * as TeamStore from '../selectors/teams';
import Run from '../components/run';

import style from './vertical-team-list.mod.css';

const ALIGN_STYLE = {
  left: style.left,
  right: style.right,
}

const VerticalTeamList = (props) => {
  const {
    teamId,
    activeRunId,
    color,
    align,
    className,
  } = props;

  const {team, runs} = useSelector((state) => {
    return {
      team: TeamStore.getTeam(state, props),
      runs: TeamStore.getTeamRuns(state, props),
    };
  });

  return (
    <div
        class={classNames(ALIGN_STYLE[align], style.container, className)}
        style={{'--accent-color': `#${team.color}`}}
      >
      <h2 class={style.teamName}>{team.name}</h2>
      { runs.map((run) => <Run
          runId={run.id}
          showProgressBar={true}
          wrapText={false}
          className={classNames(style.run, {
            [style.activeRun]: run.id == activeRunId
          })}
        />)
      }
    </div>
  );
};

export default VerticalTeamList;
