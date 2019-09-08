import {h, Fragment} from 'preact';
import classNames from 'classnames';

import style from './section.mod.css';

const Section = (props) => {
  const {
    title,
    children,
    className
  } = props;

  return (
    <div class={classNames(style.section, className)}>
      <h1 class={style.sectionTitle}>{title}</h1>

      <div class={style.sectionContent}>
        {children}
      </div>
    </div>
  );
};

export default Section;
