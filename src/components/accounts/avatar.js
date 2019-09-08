import {h} from 'preact';
import classNames from 'classnames';

import { ASSETS_URL } from '../../constants';
import style from './avatar.mod.css';

const Avatar = (props) => {
  const {
    url=ASSETS_URL,
    src,
    size=128, // should be one of 16, 24, 32, 48, 64, 96, 128
    className,
  } = props;

  const assetUrl = `${url}/${src}`;

  return (
    <img
      class={classNames(style.avatar, className)}
      width={size}
      height={size}
      src={assetUrl}
    />
  );
}

export default Avatar;
