import {
  CANVAS_OFFSET,
  CANVAS_SCALE,
  MAX_POINTS,
  MIN_POINTS,
} from 'constants/canvas';
import {toast} from 'react-fox-toast';
import {put, SagaReturnType, select} from 'redux-saga/effects';
import {AppCommonActions} from 'store/modules/AppCommon/actions';
import {canvasDimensionsSelector} from 'store/modules/AppCommon/selectors';
import {getErrorMessage} from 'store/utils/errors';

export function* randomInputSaga() {
  try {
    const dimensions: SagaReturnType<typeof canvasDimensionsSelector> =
      yield select(canvasDimensionsSelector);
    if (!dimensions) {
      throw new Error('Invalid input data');
    }

    const n =
      Math.floor(Math.random() * (MAX_POINTS - MIN_POINTS)) + MIN_POINTS;
    const points = Array.from({length: n}, () => ({
      x: Math.floor(
        Math.random() * (dimensions.width * CANVAS_SCALE - CANVAS_OFFSET * 2) +
          CANVAS_OFFSET,
      ),
      y: Math.floor(
        Math.random() * (dimensions.height * CANVAS_SCALE - CANVAS_OFFSET * 2) +
          CANVAS_OFFSET,
      ),
    }));

    yield put(AppCommonActions.RANDOM_INPUT.SUCCESS.create(points));
  } catch (error) {
    toast.error(
      'Something went wrong, please try again or restart application',
    );
    yield put(
      AppCommonActions.RANDOM_INPUT.FAILED.create({
        errorMessage: getErrorMessage(error),
      }),
    );
  }
}
