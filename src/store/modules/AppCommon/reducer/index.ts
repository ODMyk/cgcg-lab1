import {produce} from 'immer';
import {AppCommonActions} from 'store/modules/AppCommon/actions';
import {Triangle} from 'types/Triangle';

export interface State {
  position: Point;
  points: Point[];
  convexHull?: Point[];
  triangle?: Triangle;
  canvasDimensions?: {width: number; height: number};
  isMouseInputEnabled: boolean;
}

type Actions = ReturnType<
  | typeof AppCommonActions.IMPORT_DATA.SUCCESS.create
  | typeof AppCommonActions.SET_POSITION.START.create
  | typeof AppCommonActions.SOLVE_TASK.SUCCESS.create
  | typeof AppCommonActions.CLEAR_CANVAS.START.create
  | typeof AppCommonActions.SET_CANVAS_DIMENSIONS.START.create
  | typeof AppCommonActions.RANDOM_INPUT.SUCCESS.create
  | typeof AppCommonActions.CLEAR_SOLUTION.START.create
  | typeof AppCommonActions.TOGGLE_MOUSE_INPUT.START.create
  | typeof AppCommonActions.ADD_POINT.SUCCESS.create
>;

const INITIAL_STATE: State = {
  points: [],
  position: {x: 0, y: 0},
  isMouseInputEnabled: false,
};

export function appCommonReducer(
  state = INITIAL_STATE,
  action: Actions,
): State {
  return produce(state, draft => {
    switch (action.type) {
      case AppCommonActions.IMPORT_DATA.SUCCESS.type:
      case AppCommonActions.RANDOM_INPUT.SUCCESS.type:
        draft.points = action.payload;
        draft.convexHull = undefined;
        draft.triangle = undefined;
        break;
      case AppCommonActions.SET_POSITION.START.type:
        draft.position = action.payload;
        break;
      case AppCommonActions.SOLVE_TASK.SUCCESS.type:
        draft.convexHull = action.payload.convexHull;
        draft.triangle = action.payload.triangle;
        break;
      case AppCommonActions.CLEAR_CANVAS.START.type:
        draft.convexHull = undefined;
        draft.triangle = undefined;
        draft.points = [];
        break;
      case AppCommonActions.SET_CANVAS_DIMENSIONS.START.type:
        draft.canvasDimensions = action.payload;
        break;
      case AppCommonActions.CLEAR_SOLUTION.START.type:
        draft.convexHull = undefined;
        draft.triangle = undefined;
        break;
      case AppCommonActions.TOGGLE_MOUSE_INPUT.START.type:
        draft.isMouseInputEnabled = !draft.isMouseInputEnabled;
        break;
      case AppCommonActions.ADD_POINT.SUCCESS.type:
        draft.points.push(action.payload);
        break;
    }
  });
}
