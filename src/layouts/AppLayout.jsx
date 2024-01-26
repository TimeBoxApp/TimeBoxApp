import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar/Sidebar';
import UserFloatButton from '../components/UserFloatButton/UserFloatButton';

import styles from './app-layout.module.scss';

function AppLayout() {
  return (
    <div className={styles.background}>
      <Sidebar />
      <UserFloatButton />
      <div className={styles.outlet}>
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
