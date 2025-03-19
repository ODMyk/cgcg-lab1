import {combineReducers} from "redux";
import {appCommonReducer} from "store/modules/AppCommon/reducer";

import {processStatusesReducer} from "./modules/UtilityProcessStatuses/reducer";

export const rootReducer = combineReducers({
  appCommon: appCommonReducer,
  utilityProcessStatuses: processStatusesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
