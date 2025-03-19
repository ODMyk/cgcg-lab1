import {createSelector} from '@reduxjs/toolkit';
import {RootState} from 'store/rootReducer';

const selectSelf = (state: RootState) => state.appCommon;

export const pointsSelector = createSelector(selectSelf, state => state.points);

export const positionSelector = createSelector(
  selectSelf,
  state => state.position,
);

export const convexHullSelector = createSelector(
  selectSelf,
  state => state.convexHull,
);

export const triangleSelector = createSelector(
  selectSelf,
  state => state.triangle,
);
