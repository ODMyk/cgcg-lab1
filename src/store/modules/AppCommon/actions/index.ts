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

const SAVE_INPUT = createAction('SAVE_INPUT', {
  START: () => {},
  SUCCESS: () => {},
});

const RANDOM_INPUT = createAction('RANDOM_INPUT', {
  START: () => {},
  SUCCESS: (points: Point[]) => points,
});

const SET_CANVAS_DIMENSIONS = createAction('SET_CANVAS_DIMENSIONS', {
  START: (dimensions: {width: number; height: number}) => dimensions,
});

const CLEAR_SOLUTION = createAction('CLEAR_SOLUTION', {
  START: () => {},
  SUCCESS: () => {},
});

const ADD_POINT = createAction('ADD_POINT', {
  START: () => {},
  SUCCESS: (p: Point) => p,
});

const TOGGLE_MOUSE_INPUT = createAction('TOGGLE_MOUSE_INPUT', {
  START: () => {},
});

export const AppCommonActions = Object.freeze({
  TOGGLE_MOUSE_INPUT,
  ADD_POINT,
  CLEAR_SOLUTION,
  SET_CANVAS_DIMENSIONS,
  RANDOM_INPUT,
  SAVE_SOLUTION,
  CLEAR_CANVAS,
  SOLVE_TASK,
  IMPORT_DATA,
  SET_POSITION,
  SAVE_INPUT,
});
