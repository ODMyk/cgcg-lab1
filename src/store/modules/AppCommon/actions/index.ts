import {createAction} from 'store/utils/actions/createAction';
import {Triangle} from 'types/Triangle';

interface SolvedTask {
  convexHull: Point[];
  triangle: Triangle;
}

const IMPORT_DATA = createAction('IMPORT_DATA', {
  START: () => {},
  SUCCESS: (points: Point[]) => points,
});

const SET_LINE = createAction('SET_LINE', {
  START: (coefficients: {k: number; b: number}) => coefficients,
});

const SET_POSITION = createAction('SET_POSITION', {
  START: (position: Point) => position,
});

const SOLVE_TASK = createAction('SOLVE_TASK', {
  START: () => {},
  SUCCESS: (solution: SolvedTask) => solution,
});

const CLEAR_CANVAS = createAction('CLEAR_CANVAS', {
  START: () => {},
});

const SAVE_SOLUTION = createAction('SAVE_SOLUTION', {
  START: () => {},
  SUCCESS: () => {},
});


export const AppCommonActions = Object.freeze({
  SAVE_SOLUTION,
  CLEAR_CANVAS,
  SOLVE_TASK,
  IMPORT_DATA,
  SET_LINE,
  SET_POSITION,
});
