import {createSelector} from "@reduxjs/toolkit";
import lodashGet from "lodash/get";
import {useMemo} from "react";
import {useSelector} from "react-redux";
import {ActionData} from "store/modules/UtilityProcessStatuses/reducer";
import {RootState} from "store/rootReducer";

interface Action {
  id?: string | number;
  majorType: string;
}

const processStatusesRootSelector = (state: RootState) =>
  state.utilityProcessStatuses;

export const createActionStateSelector = (action: Action) =>
  createSelector(
    (state: RootState) => processStatusForActionSelector(state, action),
    (requestData) => {
      if (!requestData) {
        return undefined;
      }

      const status = lodashGet(requestData, "status");
      const errorMessage =
        status === "FAILED"
          ? lodashGet(requestData?.payload, "errorMessage")
          : undefined;

      return {
        loading: status === "START",
        success: status === "SUCCESS",
        failed: status === "FAILED",
        errorMessage,
      };
    },
  );

export const useActionState = (action: Action) => {
  const selector = useMemo(() => createActionStateSelector(action), [action]);
  return useSelector((state: RootState) => selector(state));
};

export const processStatusForActionSelector = (
  state: RootState,
  action: Action,
): ActionData | undefined =>
  lodashGet(
    processStatusesRootSelector(state),
    action.id ? `${action.majorType}.${action.id}` : `${action.majorType}`,
  ) as ActionData;

export const isLoadingSelector = (action: Action, state: RootState) => {
  const requestData = processStatusForActionSelector(state, action);

  return !!(requestData && requestData.status === "START");
};

export const isSuccessSelector = (action: Action, state: RootState) => {
  const requestData = processStatusForActionSelector(state, action);

  return !!(requestData && requestData.status === "SUCCESS");
};

export const isFailedSelector = (action: Action, state: RootState) => {
  const requestData = processStatusForActionSelector(state, action);

  return !!(requestData && requestData.status === "FAILED");
};

export const actionPayloadSelector = (action: Action, state: RootState) => {
  const requestData = processStatusForActionSelector(state, action);

  return lodashGet(requestData, "payload");
};

export const actionTimestampSelector = (
  action: Action,
  state: RootState,
): number => {
  const requestData = processStatusForActionSelector(state, action);

  return lodashGet(requestData, "timestamp", 0);
};

export const successActionTimestampSelector = (
  action: Action,
  state: RootState,
): number => {
  const isSuccess = isSuccessSelector(action, state);

  if (isSuccess) {
    return actionTimestampSelector(action, state);
  }

  return 0;
};

export const failedReasonSelector = (
  action: Action,
  state: RootState,
): string | undefined => {
  const isFailed = isFailedSelector(action, state);

  if (isFailed) {
    const requestData = processStatusForActionSelector(state, action);

    return lodashGet(requestData?.payload, "errorMessage");
  }

  return undefined;
};
