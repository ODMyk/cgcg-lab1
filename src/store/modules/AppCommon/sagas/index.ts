import {all, takeLatest} from 'redux-saga/effects';
import {AppCommonActions} from 'store/modules/AppCommon/actions';

import {importDataSaga} from './importDataSaga';
import {saveSolutionSaga} from './saveSolutionSaga';
import {solveTaskSaga} from './solveTaskSaga';

export function* rootAppCommonSaga() {
  yield all([
    takeLatest(AppCommonActions.SAVE_SOLUTION.START.type, saveSolutionSaga),
    takeLatest(AppCommonActions.SOLVE_TASK.START.type, solveTaskSaga),
    takeLatest(AppCommonActions.IMPORT_DATA.START.type, importDataSaga),
  ]);
}
