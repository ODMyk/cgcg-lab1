import {CANVAS_SCALE} from 'constants/canvas';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppCommonActions} from 'store/modules/AppCommon/actions';
import {
  canvasDimensionsSelector,
  convexHullSelector,
  isMouseInputEnabledSelector,
  pointsSelector,
  triangleSelector,
} from 'store/modules/AppCommon/selectors';

import styles from './styles.module.css';

export function Canvas() {
  const dispatch = useDispatch();
  const points = useSelector(pointsSelector);
  const convexHull = useSelector(convexHullSelector);
  const maxTriangle = useSelector(triangleSelector);
  const dimensions = useSelector(canvasDimensionsSelector);
  const isMouseInputEnabled = useSelector(isMouseInputEnabledSelector);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (isMouseInputEnabled) {
      dispatch(AppCommonActions.ADD_POINT.START.create());
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const {width, height} = containerRef.current.getBoundingClientRect();
      dispatch(
        AppCommonActions.SET_CANVAS_DIMENSIONS.START.create({width, height}),
      );
    }
  }, [containerRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const rootStyle = getComputedStyle(document.documentElement);
    const primaryColor = rootStyle.getPropertyValue('--primary').trim();
    const borderColor = rootStyle.getPropertyValue('--border').trim();
    const highlightColor = rootStyle.getPropertyValue('--highlight').trim();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (convexHull) {
      convexHull.forEach((p, i, arr) => {
        const next = arr[(i + 1) % arr.length];
        ctx.beginPath();
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      });
    }

    if (maxTriangle) {
      ctx.beginPath();
      ctx.strokeStyle = highlightColor;
      ctx.lineWidth = 2;
      ctx.moveTo(maxTriangle.p1.x, maxTriangle.p1.y);
      ctx.lineTo(maxTriangle.p2.x, maxTriangle.p2.y);
      ctx.lineTo(maxTriangle.p3.x, maxTriangle.p3.y);
      ctx.lineTo(maxTriangle.p1.x, maxTriangle.p1.y);
      ctx.stroke();
    }

    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);

      ctx.fillStyle = convexHull?.includes(p) ? primaryColor : borderColor;

      ctx.fill();
    });
  }, [points, dimensions, convexHull, maxTriangle]);

  const onMouseMove = (
    event: Pick<MouseEvent, 'clientX' | 'clientY'> & {
      currentTarget?: {offsetTop: number};
    },
  ) => {
    const x = event.clientX * CANVAS_SCALE;
    const y =
      (event.clientY - (event.currentTarget?.offsetTop ?? 0)) * CANVAS_SCALE;
    dispatch(AppCommonActions.SET_POSITION.START.create({x, y}));
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <canvas
        ref={canvasRef}
        height={(dimensions?.height ?? 0) * CANVAS_SCALE}
        width={(dimensions?.width ?? 0) * CANVAS_SCALE}
        onMouseMove={onMouseMove}
        className={styles.canvas}
        style={{
          height: dimensions?.height,
          width: dimensions?.width,
        }}
        onClick={handleClick}
      />
    </div>
  );
}
