import {h} from 'preact';
import classNames from 'classnames';

import style from './button.mod.css';

const Button = (props) => {
  const {
    onClick,
    children,
    className,
    ...buttonProps
  } = props;

  return (
    <button
        {...buttonProps}
        className={classNames(style.button, style.fullwidth, className)}
        onClick={onClick}
      >
      {children}
    </button>
  );
}

export default Button;
