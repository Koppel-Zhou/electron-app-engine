import { Menu, Tray, app } from 'electron';
import log from 'electron-log';

import { ICON, ICON_16 } from '../utils/PATHSET';

const init = () => {
  const tray = new Tray(ICON);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1' },
    { label: 'Item2' },
    { label: 'Item3' },
    { label: 'Item4' },
    { type: 'separator' },
    { label: 'Item5' },
    { label: 'Item6' },
    { label: 'Item7' },
    {
      icon: ICON_16,
      label: '退出',
      click: () => {
        log.info('tray quit');
        app.quit();
      },
    },
  ]);
  tray.setToolTip('Electron App Engine');
  tray.setContextMenu(contextMenu);
  return tray;
};

export default init;