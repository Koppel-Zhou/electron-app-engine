import path from 'path';
import { app } from 'electron';

export const RESOURCES = process.resourcesPath;
export const ASSETS = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export const PRELOAD_FILE = app.isPackaged
  ? path.join(__dirname, 'preload.js')
  : path.join(__dirname, '../../.engine/dll/preload.js');

export const ICON = path.join(ASSETS, 'icon.png');
export const ICON_16 = path.join(ASSETS, 'icons/16x16.png');
export const ICON_24 = path.join(ASSETS, 'icons/24x24.png');
