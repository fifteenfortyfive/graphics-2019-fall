import {h} from 'preact';

import style from './loading-spinner.mod.css';

const LoadingSpinner = (props) => {
  return (
    <div class={style.container}>
      <div class={style.spinner} style={{'--color': props.color || 'white'}}>
        Loading
      </div>
    </div>
  );
};

export default LoadingSpinner;
