import {toast} from 'react-fox-toast';
import {put, SagaReturnType, select} from 'redux-saga/effects';
import {AppCommonActions} from 'store/modules/AppCommon/actions';
import {positionSelector} from 'store/modules/AppCommon/selectors';
import {getErrorMessage} from 'store/utils/errors';

export function* addPointSaga() {
  try {
    const position: SagaReturnType<typeof positionSelector> = yield select(
      positionSelector,
    );
    if (!position) {
      throw new Error('Invalid input data');
    }

    yield put(AppCommonActions.ADD_POINT.SUCCESS.create(position));
  } catch (error) {
    toast.error(
      'Something went wrong, please try again or restart application',
    );
    yield put(
      AppCommonActions.ADD_POINT.FAILED.create({
        errorMessage: getErrorMessage(error),
      }),
    );
  }
}
