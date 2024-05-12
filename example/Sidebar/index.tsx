import { Link } from 'react-router-dom';

import './index.scss';

function SideBar() {
  const actions = [
    { name: 'Hello', route: '/' },
    { name: 'Settings', route: '/settings' },
  ];
  return (
    <nav className="sidebar">
      <ul>
        {actions.map((action) => {
          return (
            <li className="sideitem" key={action.name}>
              <Link to={action.route}>{action.name}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SideBar;
