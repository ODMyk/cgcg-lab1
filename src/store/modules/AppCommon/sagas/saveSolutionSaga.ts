import {save} from '@tauri-apps/plugin-dialog';
import {writeTextFile} from '@tauri-apps/plugin-fs';
import {call, put, SagaReturnType, select} from 'redux-saga/effects';
import {AppCommonActions} from 'store/modules/AppCommon/actions';
import {
  convexHullSelector,
  triangleSelector,
} from 'store/modules/AppCommon/selectors';
import {getErrorMessage} from 'store/utils/errors';

export function* saveSolutionSaga() {
  try {
    const savePath: SagaReturnType<typeof save> = yield call(save, {
      title: 'Save solution',
      canCreateDirectories: true,
      filters: [
        {
          name: 'Allowed files only',
          extensions: ['txt'],
        },
      ],
    });
    if (!savePath) {
      yield put(AppCommonActions.SAVE_SOLUTION.RESET.create());
      return;
    }
    const convexHull: SagaReturnType<typeof convexHullSelector> = yield select(
      convexHullSelector,
    );
    const triangle: SagaReturnType<typeof triangleSelector> = yield select(
      triangleSelector,
    );

    const fileContent = `${triangle?.p1.x};${triangle?.p1.y} ${
      triangle?.p2.x
    };${triangle?.p2.y} ${triangle?.p3.x};${triangle?.p3.y}\n${convexHull
      ?.map(point => `${point.x};${point.y}`)
      .join('\n')}`;

    yield call(writeTextFile, savePath, fileContent);

    yield put(AppCommonActions.SAVE_SOLUTION.SUCCESS.create());
  } catch (error) {
    yield put(
      AppCommonActions.SAVE_SOLUTION.FAILED.create({
        errorMessage: getErrorMessage(error),
      }),
    );
  }
}
