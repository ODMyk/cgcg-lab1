import {Button} from 'components/core/Button';
import {LogoIcon} from 'components/icons/LogoIcon';
import {useDispatch, useSelector} from 'react-redux';
import {AppCommonActions} from 'store/modules/AppCommon/actions';
import {
  convexHullSelector,
  isMouseInputEnabledSelector,
  pointsSelector,
  triangleSelector,
} from 'store/modules/AppCommon/selectors';

import styles from './styles.module.css';

export function Header() {
  const dispatch = useDispatch();

  const points = useSelector(pointsSelector);
  const convexHull = useSelector(convexHullSelector);
  const triangle = useSelector(triangleSelector);
  const isMouseInputEnabled = useSelector(isMouseInputEnabledSelector);

  const processDisabled = isMouseInputEnabled || !points.length;

  const saveDisabled =
    isMouseInputEnabled || convexHull === undefined || triangle === undefined;

  const importDisabled = isMouseInputEnabled;

  const randomDisabled = isMouseInputEnabled;

  const finishDisabled = isMouseInputEnabled && points.length < 3;

  const handleImport = () => {
    dispatch(AppCommonActions.IMPORT_DATA.START.create());
  };

  const handleProcess = () => {
    dispatch(AppCommonActions.SOLVE_TASK.START.create());
  };

  const handleSave = () => {
    dispatch(AppCommonActions.SAVE_SOLUTION.START.create());
  };

  const handleClear = () => {
    dispatch(AppCommonActions.CLEAR_CANVAS.START.create());
  };

  const handleRemoveSolution = () => {
    dispatch(AppCommonActions.CLEAR_SOLUTION.START.create());
  };

  const handleToggleMouseInput = () => {
    if (!isMouseInputEnabled) {
      handleRemoveSolution();
    }
    dispatch(AppCommonActions.TOGGLE_MOUSE_INPUT.START.create());
  };

  const handleRandomInput = () => {
    dispatch(AppCommonActions.RANDOM_INPUT.START.create());
  };

  return (
    <nav className={styles.container}>
      <div className={styles.titleContainer}>
        <LogoIcon />
      </div>
      <div className={styles.buttons}>
        <Button onClick={handleImport} disabled={importDisabled}>
          Import
        </Button>
        <Button onClick={handleToggleMouseInput} disabled={finishDisabled}>
          {isMouseInputEnabled ? 'Finish' : 'Mouse input'}
        </Button>
        <Button onClick={handleRandomInput} disabled={randomDisabled}>
          Random input
        </Button>
        <Button onClick={handleClear} disabled={processDisabled}>
          Clear
        </Button>
        <Button onClick={handleProcess} disabled={processDisabled}>
          Process
        </Button>
        <Button onClick={handleRemoveSolution} disabled={saveDisabled}>
          Remove solution
        </Button>
        <Button onClick={handleSave} disabled={saveDisabled}>
          Save
        </Button>
      </div>
    </nav>
  );
}
