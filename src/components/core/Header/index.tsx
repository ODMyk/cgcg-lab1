import {Button} from 'components/core/Button';
import {LogoIcon} from 'components/icons/LogoIcon';
import {useDispatch, useSelector} from 'react-redux';
import {AppCommonActions} from 'store/modules/AppCommon/actions';
import {
  convexHullSelector,
  pointsSelector,
  triangleSelector,
} from 'store/modules/AppCommon/selectors';

import styles from './styles.module.css';

export function Header() {
  const dispatch = useDispatch();

  const points = useSelector(pointsSelector);
  const conexHull = useSelector(convexHullSelector);
  const triangle = useSelector(triangleSelector);

  const processDisabled = !points.length;

  const saveDisabled = conexHull === undefined || triangle === undefined;

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

  return (
    <nav className={styles.container}>
      <div className={styles.titleContainer}>
        <LogoIcon />
      </div>
      <div className={styles.buttons}>
        <Button onClick={handleImport}>Import</Button>
        <Button onClick={handleProcess} disabled={processDisabled}>
          Process
        </Button>
        <Button onClick={handleClear} disabled={processDisabled}>
          Clear
        </Button>
        <Button onClick={handleSave} disabled={saveDisabled}>
          Save
        </Button>
      </div>
    </nav>
  );
}
