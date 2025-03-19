import {open} from '@tauri-apps/plugin-dialog';
import {readTextFile} from '@tauri-apps/plugin-fs';
import {toast} from 'react-fox-toast';
import {call, put, SagaReturnType} from 'redux-saga/effects';
import {AppCommonActions} from 'store/modules/AppCommon/actions';
import {getErrorMessage} from 'store/utils/errors';

export function* importDataSaga() {
  try {
    const filename: SagaReturnType<typeof open<{directory: false}>> =
      yield call(open, {
        title: 'Select file',
        filters: [
          {
            name: 'Allowed files only',
            extensions: ['txt'],
          },
        ],
      });

    if (!filename) {
      yield put(AppCommonActions.IMPORT_DATA.RESET.create());
      return;
    }

    const fileContent: SagaReturnType<typeof readTextFile> = yield call(
      readTextFile,
      filename,
    );

    const data = fileContent
      .split('\n')
      .filter(Boolean)
      .map(line => {
        const [x, y] = line.split(';').map(Number);
        return {x, y};
      });

    if (
      data.length < 3 ||
      data.some(
        p =>
          Number.isNaN(p.x) ||
          Number.isNaN(p.y) ||
          p.x === undefined ||
          p.y === undefined,
      )
    ) {
      throw new Error('Invalid data');
    }

    yield put(AppCommonActions.IMPORT_DATA.SUCCESS.create(data));
  } catch (error) {
    toast.error('Selected file contains invalid data');
    yield put(
      AppCommonActions.IMPORT_DATA.FAILED.create({
        errorMessage: getErrorMessage(error),
      }),
    );
  }
}
