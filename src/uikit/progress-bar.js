import {h} from 'preact';
import classNames from 'classnames';

import style from './progress-bar.mod.css';

const ProgressBar = (props) => {
  const {
    progress,
    color,
    className
  } = props;

  return (
    <div class={classNames(style.progressBarContainer, className)}>
      <div class={style.progressBar} style={{
          '--progress': `${progress}%`,
          '--color': color
        }} />
    </div>
  );
};

export default ProgressBar;
