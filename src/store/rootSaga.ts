import {all, AllEffect, call, ForkEffect, spawn} from 'redux-saga/effects';

import {rootAppCommonSaga} from './modules/AppCommon/sagas';

type Saga =
  | (() => Generator<ForkEffect<void>, void, unknown>)
  | (() => Generator<AllEffect<ForkEffect<never>>, void, unknown>);

const sagas: Saga[] = [rootAppCommonSaga];

export function* rootSaga() {
  yield all([
    ...sagas.map(saga =>
      spawn(function* () {
        while (true) {
          try {
            yield call(saga);
            break;
          } catch (error) {
            console.error(error);
          }
        }
      }),
    ),
  ]);
}
