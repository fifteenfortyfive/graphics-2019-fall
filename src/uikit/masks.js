import {h, forwardRef} from 'preact';

export const StretchReveal = (props) => {
  const {
    pathId,
    rectId,
    objectId,
    children
  } = props;

  return (
    <svg
        preserveAspectRatio="none"
        style={{
          position: 'relative',
          width: "100%",
          height: "100%",
          transformOrigin: "0px 0px 0px",
        }}
      >
      <defs>
        <clipPath id={pathId}>
          <rect id={rectId} x="0" y="0" width="100%" height="100%" />
        </clipPath>
      </defs>

      <foreignObject id={objectId} clip-path={`url(#${pathId})`} width="100%" height="100%">
        {children}
      </foreignObject>
    </svg>
  );
};
