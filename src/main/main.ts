/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import * as Sentry from '@sentry/electron/main';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import WindowMG from './WindowManager';
import MenuBuilder from './menu';
import { resolveHtmlPath } from '../utils';
import initSentry from '../SDK/sentry/main';
import initTray from './tray';
import { init as initNamedPipeExample } from '../SDK/NamedPipe/example';
import r2mHandlersRegister from '../SDK/IPC/R2M/server';
import { methods as app_methods } from '../SDK/NativeAPI/app';
import r2rBridgeInit from '../SDK/IPC/R2R/bridge';
import { R2R_REPEATER_TYPE } from '../SDK/IPC/dictionary';

initSentry();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  await r2rBridgeInit({ repeater: R2R_REPEATER_TYPE.MP });

  mainWindow = WindowMG.createWindow('main', resolveHtmlPath('index.html'), {
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'main.preload.js')
        : path.join(__dirname, '../../.engine/dll/main.preload.js'),
    },
  })

  mainWindow.on('ready-to-show', () => {
    Sentry.setUser({
      id: '123',
      username: 'test',
      email: 'test@example.com',
    });
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  WindowMG.createWindow('baidu', 'https://www.baidu.com/', {
    show: true,
    width: 1024,
    height: 728,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'main.preload.js')
        : path.join(__dirname, '../../.engine/dll/main.preload.js'),
    },
  })

  WindowMG.createWindow('youku', 'https://www.youku.com/', {
    show: true,
    width: 1024,
    height: 728,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'main.preload.js')
        : path.join(__dirname, '../../.engine/dll/main.preload.js'),
    },
  })

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    const process_id = process.pid;
    log.info(`主进程的进程ID是: ${process_id}`);
    r2mHandlersRegister(app_methods);
    r2mHandlersRegister({ '12': (num) => num * num });
    initNamedPipeExample();
    createWindow();
    initTray();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
