import {all, takeLatest} from 'redux-saga/effects';
import {AppCommonActions} from 'store/modules/AppCommon/actions';

import {addPointSaga} from './addPointSaga.ts';
import {importDataSaga} from './importDataSaga';
import {randomInputSaga} from './randomInputSaga';
import {saveInputSaga} from './saveInputSaga.ts';
import {saveSolutionSaga} from './saveSolutionSaga';
import {solveTaskSaga} from './solveTaskSaga';

export function* rootAppCommonSaga() {
  yield all([
    takeLatest(AppCommonActions.RANDOM_INPUT.START.type, randomInputSaga),
    takeLatest(AppCommonActions.SAVE_SOLUTION.START.type, saveSolutionSaga),
    takeLatest(AppCommonActions.SAVE_INPUT.START.type, saveInputSaga),
    takeLatest(AppCommonActions.SOLVE_TASK.START.type, solveTaskSaga),
    takeLatest(AppCommonActions.IMPORT_DATA.START.type, importDataSaga),
    takeLatest(AppCommonActions.ADD_POINT.START.type, addPointSaga),
  ]);
}
