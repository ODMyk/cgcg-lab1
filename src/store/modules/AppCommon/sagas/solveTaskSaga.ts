import {put, SagaReturnType, select} from 'redux-saga/effects';
import {findLargestTriangle, grahamScan} from 'services/geometry';
import {AppCommonActions} from 'store/modules/AppCommon/actions';
import {pointsSelector} from 'store/modules/AppCommon/selectors';
import {getErrorMessage} from 'store/utils/errors';

export function* solveTaskSaga() {
  try {
    const points: SagaReturnType<typeof pointsSelector> = yield select(
      pointsSelector,
    );

    if (!points.length) {
      throw new Error('Invalid input data');
    }

    const convexHull = grahamScan([...points]);
    const maxTriangle = findLargestTriangle(convexHull);

    yield put(
      AppCommonActions.SOLVE_TASK.SUCCESS.create({
        convexHull,
        triangle: maxTriangle,
      }),
    );
  } catch (error) {
    yield put(
      AppCommonActions.SOLVE_TASK.FAILED.create({
        errorMessage: getErrorMessage(error),
      }),
    );
  }
}
