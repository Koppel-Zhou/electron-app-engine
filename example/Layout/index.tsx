import { Outlet } from 'react-router-dom';
import SideBar from '../Sidebar';

import './index.scss';

function Layout() {
  return (
    <div className="page">
      <SideBar />
      <div className="right">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
