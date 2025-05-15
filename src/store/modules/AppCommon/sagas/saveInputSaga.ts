import {save} from '@tauri-apps/plugin-dialog';
import {writeTextFile} from '@tauri-apps/plugin-fs';
import {call, put, SagaReturnType, select} from 'redux-saga/effects';
import {AppCommonActions} from 'store/modules/AppCommon/actions';
import {pointsSelector} from 'store/modules/AppCommon/selectors';
import {getErrorMessage} from 'store/utils/errors';

export function* saveInputSaga() {
  try {
    const savePath: SagaReturnType<typeof save> = yield call(save, {
      title: 'Save input',
      canCreateDirectories: true,
      filters: [
        {
          name: 'Allowed files only',
          extensions: ['txt'],
        },
      ],
    });
    if (!savePath) {
      yield put(AppCommonActions.SAVE_INPUT.RESET.create());
      return;
    }
    const points: SagaReturnType<typeof pointsSelector> = yield select(
      pointsSelector,
    );

    const fileContent = points
      ?.map(point => `${point.x};${point.y}`)
      .join('\n');

    yield call(writeTextFile, savePath, fileContent);

    yield put(AppCommonActions.SAVE_INPUT.SUCCESS.create());
  } catch (error) {
    yield put(
      AppCommonActions.SAVE_INPUT.FAILED.create({
        errorMessage: getErrorMessage(error),
      }),
    );
  }
}
