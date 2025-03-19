import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppCommonActions} from 'store/modules/AppCommon/actions';
import {
  convexHullSelector,
  pointsSelector,
  triangleSelector,
} from 'store/modules/AppCommon/selectors';

import styles from './styles.module.css';

export function Canvas() {
  const dispatch = useDispatch();
  const points = useSelector(pointsSelector);
  const convexHull = useSelector(convexHullSelector);
  const maxTriangle = useSelector(triangleSelector);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimenstions] = React.useState({height: 0, width: 0});

  useEffect(() => {
    if (containerRef.current) {
      const {width, height} = containerRef.current.getBoundingClientRect();
      setDimenstions({
        width,
        height,
      });
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
    const x = event.clientX;
    const y = event.clientY - (event.currentTarget?.offsetTop ?? 0);
    dispatch(AppCommonActions.SET_POSITION.START.create({x, y}));
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <canvas
        ref={canvasRef}
        height={dimensions.height}
        width={dimensions.width}
        onMouseMove={onMouseMove}
        className={styles.canvas}
      />
    </div>
  );
}
