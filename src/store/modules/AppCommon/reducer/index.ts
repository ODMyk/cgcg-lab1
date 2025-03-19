import {produce} from 'immer';
import {AppCommonActions} from 'store/modules/AppCommon/actions';
import {Triangle} from 'types/Triangle';

export interface State {
  position: Point;
  points: Point[];
  convexHull?: Point[];
  triangle?: Triangle;
}

type Actions = ReturnType<
  | typeof AppCommonActions.IMPORT_DATA.SUCCESS.create
  | typeof AppCommonActions.SET_POSITION.START.create
  | typeof AppCommonActions.SOLVE_TASK.SUCCESS.create
  | typeof AppCommonActions.CLEAR_CANVAS.START.create
>;

const INITIAL_STATE: State = {
  points: [],
  position: {x: 0, y: 0},
};

export function appCommonReducer(
  state = INITIAL_STATE,
  action: Actions,
): State {
  return produce(state, draft => {
    switch (action.type) {
      case AppCommonActions.IMPORT_DATA.SUCCESS.type:
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
    }
  });
}
