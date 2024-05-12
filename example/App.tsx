import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import icon from '../assets/icon.svg';

import './App.scss';
import Settings from './Settings';
import Layout from './Layout';

function Hello() {
  return (
    <>
      <img width="200" alt="icon" src={icon} />
      <h1>electron-app-engine</h1>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Hello />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Hello />} />
        </Route>
      </Routes>
    </Router>
  );
}
